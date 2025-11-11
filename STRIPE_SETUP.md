# Stripe Integration Setup Guide

Diese Anleitung führt dich durch die komplette Einrichtung der Stripe-Integration für PAPYR.

## 1. Stripe Account erstellen

1. Gehe zu https://stripe.com und erstelle einen Account
2. Nach der Registrierung wirst du zum Dashboard weitergeleitet
3. **WICHTIG:** Stelle sicher, dass du im **Test Mode** bist (Toggle oben rechts)

## 2. API Keys holen

1. Im Stripe Dashboard: Gehe zu **Developers** → **API keys**
2. Du siehst zwei Keys:
   - **Publishable key** (beginnt mit `pk_test_...`)
   - **Secret key** (beginnt mit `sk_test_...`, klicke auf "Reveal test key")
3. Kopiere beide Keys

## 3. Subscription Product erstellen

1. Gehe zu **Products** → **Add Product**
2. Fülle aus:
   - **Name:** PAPYR Membership
   - **Description:** Unbegrenzte Zettel-Uploads und voller Zugriff
   - **Pricing model:** Recurring
   - **Price:** 0,99 EUR
   - **Billing period:** Monthly
3. Klicke auf **Save product**
4. Nach dem Speichern siehst du die **Price ID** (beginnt mit `price_...`)
5. Kopiere diese Price ID

## 4. Supabase Datenbank aktualisieren

Führe die SQL-Migration aus um die Stripe-Felder zur Datenbank hinzuzufügen:

1. Öffne dein Supabase Dashboard
2. Gehe zu **SQL Editor**
3. Öffne die Datei `lib/supabase/add-stripe-fields.sql` in diesem Projekt
4. Kopiere den Inhalt und füge ihn im SQL Editor ein
5. Klicke auf **Run**

## 5. Environment Variables hinzufügen

Füge die folgenden Variablen zu deiner `.env.local` Datei hinzu:

```env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_dein_publishable_key
STRIPE_SECRET_KEY=sk_test_dein_secret_key
NEXT_PUBLIC_STRIPE_PRICE_ID=price_deine_price_id
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Webhook Secret (wird im nächsten Schritt erstellt)
STRIPE_WEBHOOK_SECRET=whsec_dein_webhook_secret
```

Ersetze die Platzhalter mit deinen echten Keys!

## 6. Webhook Endpoint einrichten (Lokal testen)

Für lokale Tests benötigst du die Stripe CLI:

1. Installiere Stripe CLI: https://stripe.com/docs/stripe-cli
2. Authentifiziere dich:
   ```bash
   stripe login
   ```
3. Starte den Webhook Listener:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
4. Die CLI gibt dir einen **Webhook Secret** aus (beginnt mit `whsec_...`)
5. Füge diesen Secret zu `.env.local` hinzu als `STRIPE_WEBHOOK_SECRET`

## 7. Webhook Endpoint einrichten (Production)

Für Production:

1. Im Stripe Dashboard: **Developers** → **Webhooks** → **Add endpoint**
2. Endpoint URL: `https://deine-domain.com/api/stripe/webhook`
3. Wähle diese Events:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`
4. Klicke auf **Add endpoint**
5. Kopiere den **Signing secret** und füge ihn zu deiner Production `.env` hinzu

## 8. App starten und testen

1. Starte die App:
   ```bash
   npm run dev
   ```

2. Starte den Stripe Webhook Listener (in einem separaten Terminal):
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

3. Teste die Integration:
   - Melde dich in der App an
   - Lade 14 Zettel hoch (oder gehe zu Settings)
   - Klicke auf "Jetzt Member werden"
   - Du wirst zu Stripe Checkout weitergeleitet

## 9. Test Cards verwenden

Verwende diese Test-Kartendaten in Stripe Checkout:

**Erfolgreiche Zahlung:**
- Kartennummer: `4242 4242 4242 4242`
- Ablaufdatum: Beliebig in der Zukunft (z.B. `12/34`)
- CVC: Beliebige 3 Ziffern (z.B. `123`)
- PLZ: Beliebig (z.B. `12345`)

**Fehlgeschlagene Zahlung:**
- Kartennummer: `4000 0000 0000 0002`

**3D Secure Authentifizierung:**
- Kartennummer: `4000 0027 6000 3184`

Vollständige Liste: https://stripe.com/docs/testing#cards

## 10. Funktionsweise prüfen

Nach erfolgreicher Zahlung:

1. Du wirst zu `/success` weitergeleitet
2. Der Webhook Handler aktualisiert automatisch `has_paid = true` in der Datenbank
3. Du hast unbegrenzten Zugriff auf die App

Check in deinem Supabase Dashboard:
- **Table Editor** → **profiles** → Suche deinen User
- `has_paid` sollte `true` sein
- `stripe_customer_id` und `stripe_subscription_id` sollten gefüllt sein

## Troubleshooting

### Fehler: "Missing Stripe publishable key"
- Stelle sicher, dass alle Environment Variables in `.env.local` korrekt eingetragen sind
- Starte den Dev Server neu: `npm run dev`

### Webhook Events kommen nicht an
- Stelle sicher, dass die Stripe CLI läuft: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- Check die CLI für Fehler

### Zahlung erfolgreich aber `has_paid` ist noch `false`
- Check die Webhook Logs in der Konsole
- Stelle sicher, dass der `STRIPE_WEBHOOK_SECRET` korrekt ist
- Manuell in Supabase aktualisieren zum Testen

## Production Deployment

Wenn du live gehst:

1. Wechsle im Stripe Dashboard von Test Mode zu Live Mode
2. Erstelle neue API Keys (Live Mode)
3. Aktualisiere alle Environment Variables mit Live Keys
4. Richte den Production Webhook Endpoint ein (siehe Schritt 7)
5. Teste mit echten Karten (kleine Beträge!)

---

**Fertig!** 🎉 Deine Stripe-Integration ist bereit zum Testen.
