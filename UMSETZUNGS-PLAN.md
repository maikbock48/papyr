# PAPYR - Schritt-für-Schritt Umsetzungsplan

## 🎯 STRATEGIE: Foundation → Core → Money → Community → Polish

---

## PHASE 1: FOUNDATION FIXES (Tag 1-2)
**Ziel:** Basis korrigieren, auf der alles andere aufbaut

### Step 1.1: Config & Timing Fix
**Branch:** `fix/core-configs`
**Dauer:** 1-2 Stunden
**Was:**
- Zeitfenster: 21:00-03:00 → 20:00-02:00
- Free Trial: 7 Tage → 14 Tage
- Pricing Model anpassen (Vorbereitung für Abo)

**Warum zuerst?** Diese Werte werden überall referenziert

---

### Step 1.2: Entscheidung - Aktuelle Features
**Dauer:** Diskussion
**Entscheiden:**
- ❓ Daily Questions → BEHALTEN / ENTFERNEN / OPTIONAL
- ❓ 7-Tage-Reflexion → BEHALTEN / ENTFERNEN / UMBAUEN
- ❓ Monats-Parade → BEHALTEN / ENTFERNEN / PRO-FEATURE
- ❓ Polaroid-Entwicklung → BEHALTEN / ENTFERNEN / OPTIONAL

**Meine Empfehlung:**
- Daily Questions → **ENTFERNEN** (nicht in Vision, lenkt ab)
- 7-Tage-Reflexion → **ENTFERNEN** (ersetzt durch Joker-System)
- Monats-Parade → **BEHALTEN** (ist viral, passt zur Mission)
- Polaroid-Entwicklung → **BEHALTEN** (70er-Vibe, "gute Reibung")

---

### Step 1.3: Cleanup - Features entfernen
**Branch:** `cleanup/remove-daily-questions`
**Dauer:** 2-3 Stunden
**Was:**
- Daily Questions komplett entfernen
- 7-Tage-Reflexion entfernen
- 10-Jahres-Vision entfernen
- Code aufräumen

**Warum jetzt?** Reduziert Komplexität für neue Features

---

## PHASE 2: NEUES ONBOARDING (Tag 2-3)
**Ziel:** Erste Impression perfekt machen

### Step 2.1: Onboarding komplett neu
**Branch:** `feature/new-onboarding`
**Dauer:** 4-6 Stunden
**Was:**
- Name-Input erfragen (speichern in AppState)
- Neuer Ton: "Bro/Sis", locker, ermutigend
- Einstein-Zitat am Anfang
- Name durchgehend verwenden
- Exakt dein onboarding.md umsetzen
- Optional: 3-Min Video einbetten (später)

**Screens (wie in onboarding.md):**
1. Einstein-Zitat + Warning
2. "Willkommen Bro/Sis" + Ritual-Intro
3. Notizblock-Erklärung
4. Name-Input
5. Personalisiert: "NAME, du wirst alles erreichen"
6. Beispiele für Ziele
7. "Warum die App?"
8. Dokumentation & Bewegung
9. "Du hast schon gestartet!"
10. Spielregeln + Start-Button

**Warum wichtig?** Das ist der erste Eindruck - muss perfekt sein!

---

## PHASE 3: CORE FEATURES (Tag 3-5)
**Ziel:** User Experience verbessern

### Step 3.1: Joker-System
**Branch:** `feature/joker-system`
**Dauer:** 3-4 Stunden
**Was:**
- Alle 7 Tage Streak = 1 Joker verdient
- Joker-Counter in UI anzeigen
- Wenn Upload verpasst: Option "Joker einsetzen" statt Reset
- Joker-Animation/Feedback
- Joker in AppState speichern

**Logic:**
```
if (streak % 7 === 0 && streak > 0) {
  jokers += 1
}

if (missedUpload && jokers > 0) {
  // Show: "Joker einsetzen?" oder "Streak auf 0"
}
```

**Warum wichtig?** Game-Changer für User-Retention!

---

### Step 3.2: Initialen-Signatur
**Branch:** `feature/signature-initials`
**Dauer:** 2-3 Stunden
**Was:**
- Name-Initialen aus Onboarding ableiten (z.B. "Max Mustermann" → "MM")
- Beim Upload: Optional Checkbox "Mit Initialen signieren"
- Signatur auf Polaroid anzeigen (bottom-right)
- In AppState speichern ob signiert
- Einstellungen: Initialen ändern können

**UI:**
```
[ ] Mit meinen Initialen signieren (MM)
```

**Warum wichtig?** Macht Commitment persönlicher!

---

### Step 3.3: Globaler Counter verbessern
**Branch:** `feature/global-counter-real`
**Dauer:** 2-3 Stunden
**Was:**
- Statt Simulation: "Heute Abend wurden X Zettel eingereicht"
- Counter zeigt heutige Einreichungen (nicht "live gerade")
- Realistischer: Startet bei ~50-200, steigt über Abend
- Optional: Später mit Backend synchronisieren

**Text-Änderung:**
```
Alte: "In diesem Moment bekennen sich: 8.452 Seelen"
Neu: "Heute wurden bereits 342 Zettel eingereicht."
```

**Warum wichtig?** Ehrlicher, motivierender

---

## PHASE 4: MONETIZATION (Tag 5-7)
**Ziel:** Payment-Flow funktioniert

### Step 4.1: Stripe Integration (1€/Monat Abo)
**Branch:** `feature/stripe-subscription`
**Dauer:** 6-8 Stunden
**Was:**
- Stripe Account einrichten
- 1€/Monat Abo-Produkt erstellen
- Payment-Flow nach 14 Tagen
- Webhook für Subscription-Status
- Cancelled/Failed Handling

**Paywall nach 14 Tagen:**
```
"14 Tage hast du durchgezogen.
Das hier funktioniert. Du weißt es.

1€ im Monat. Für dein ewiges Archiv.
Für deine Disziplin. Für deinen Erfolg.

Bist du bereit?"

[Ja, ich bin dabei - 1€/Monat]
[Nein, ich war noch nicht bereit]
```

**Warum wichtig?** Ohne Payment keine Monetarisierung!

---

### Step 4.2: Pro-Account (4,95€/Monat)
**Branch:** `feature/pro-account`
**Dauer:** 3-4 Stunden
**Was:**
- Pro-Tier in Stripe erstellen (4,95€/Monat)
- "Pro"-Badge neben Name im Profil
- Upgrade-Option in Settings
- Keine Extra-Features! Nur Badge.

**Pitch:**
```
"Willst du mehr tun?

Upgrade auf Pro für 4,95€/Monat.
Du bekommst keine neuen Features.
Nur ein 'Pro'-Badge.

Das ist keine Angeberei.
Das ist Bekennung.

Du unterstützt damit Projekte wie diese.
Danke."

[Upgrade auf Pro]
```

**Warum später?** Erst normal Abo funktionieren lassen

---

## PHASE 5: NOTIFICATIONS & SYNC (Tag 7-9)
**Ziel:** User kommen zurück

### Step 5.1: Push Notifications
**Branch:** `feature/push-notifications`
**Dauer:** 4-6 Stunden
**Was:**
- Browser Push API nutzen (für PWA)
- User fragt bei erstem Start nach Permission
- Tägliche Notification um 20:00 Uhr
- Text: "Zeit für dein Bekenntnis, [NAME]!"
- Settings: An/Aus + Zeit anpassen

**Warum wichtig?** User vergessen sonst → Streak weg

---

### Step 5.2: Kalender-Sync
**Branch:** `feature/calendar-sync`
**Dauer:** 6-8 Stunden
**Was:**
- .ics File generieren für jeden Zettel
- "Zu Kalender hinzufügen" Button
- Google Calendar API (optional)
- Apple Calendar Support
- Settings: Auto-Sync aktivieren

**Warum später?** Nice-to-have, nicht kritisch

---

## PHASE 6: COMMUNITY (Tag 9-12)
**Ziel:** Soziale Features

### Step 6.1: Inspiration Feed
**Branch:** `feature/inspiration-feed`
**Dauer:** 8-10 Stunden
**Was:**
- Backend/DB für anonyme Ziele
- User können Ziele "teilen" (anonym)
- Feed zeigt random Ziele von anderen
- "Lass dich inspirieren"-Screen
- Upvote/Downvote? (optional)

**UI:**
```
"💡 Inspiration von der Community"

[Random Ziel]
"Morgen 5km laufen"
- Anonym, vor 2 Tagen

[Nächstes Ziel]

[Teile dein eigenes Ziel]
```

**Warum später?** Braucht Backend, Community-Masse

---

### Step 6.2: "Heute committen X User"
**Branch:** `feature/real-community-counter`
**Dauer:** 4-6 Stunden
**Was:**
- Backend zählt echte Uploads
- "Heute haben 1.234 Menschen ihr Bekenntnis abgelegt"
- Optional: Live während 20:00-02:00

**Warum später?** Braucht Backend + User-Masse

---

## PHASE 7: SHOP & EXTRAS (Tag 12+)
**Ziel:** Zusätzliche Revenue-Streams

### Step 7.1: Shop-Integration
**Branch:** `feature/shop`
**Dauer:** Variabel
**Was:**
- Printful/Shopify Integration
- Merchandise: T-Shirts, Notizblöcke, etc.
- "Unterstütze Umweltprojekte"-Link
- Shop-Link in App

**Warum zuletzt?** Nicht core, aber cool

---

### Step 7.2: Video-Onboarding
**Branch:** `feature/video-onboarding`
**Dauer:** 2-3 Stunden (ohne Video-Produktion)
**Was:**
- 3-Min Video einbetten
- Option: "Video ansehen" oder "Text lesen"
- Video in onboarding.md beschrieben

**Warum zuletzt?** Video muss erst produziert werden

---

## 📊 TIMELINE-ÜBERSICHT

| Phase | Tage | Features |
|-------|------|----------|
| Phase 1 | 1-2 | Foundation Fixes + Cleanup |
| Phase 2 | 2-3 | Neues Onboarding |
| Phase 3 | 3-5 | Joker, Signatur, Counter |
| Phase 4 | 5-7 | Stripe Abo + Pro |
| Phase 5 | 7-9 | Notifications + Kalender |
| Phase 6 | 9-12 | Community Feed |
| Phase 7 | 12+ | Shop + Extras |

**Total:** ~2 Wochen für MVP mit allen Core-Features

---

## 🎯 MEINE EMPFEHLUNG FÜR START

**HEUTE/MORGEN starten mit:**

1. **Step 1.1** - Config Fixes (schnell, easy)
2. **Step 1.2** - Gemeinsam entscheiden welche Features bleiben
3. **Step 1.3** - Cleanup (Daily Questions entfernen)
4. **Step 2.1** - Neues Onboarding (wichtigster First Impression)

**Dann weitermachen mit:**
5. **Step 3.1** - Joker-System (Game-Changer!)
6. **Step 3.2** - Initialen-Signatur
7. **Step 4.1** - Stripe Integration

Nach ~1 Woche haben wir dann:
- ✅ Perfektes Onboarding
- ✅ Joker-System
- ✅ Initialen-Signatur
- ✅ 1€/Monat Abo funktioniert
- ✅ 14 Tage Free Trial

**= Launch-Ready MVP!**

Rest (Notifications, Community, Shop) kann nach Launch kommen.

---

## ❓ DEINE ENTSCHEIDUNG JETZT

**Bist du einverstanden mit dieser Reihenfolge?**

**ODER:**
- Andere Prioritäten?
- Andere Reihenfolge?
- Andere Features wichtiger?

**Wenn OK → Ich starte sofort mit Step 1.1!** 🚀
