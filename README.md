# PAPYR - Dein digitales Bekenntnis

> "Du brauchst es nicht? Dann kriegst du's nicht. Morgen wirst du es brauchen."

Die unnötigste App der Welt - und genau deswegen genial.

## Das Konzept

PAPYR ist kein Produktivitäts-Tool. Es ist ein Ritual.

**Das analoge Schwur:**
- Jeden Abend, von Hand, auf Papier
- 1-2 fokussierte Ziele für morgen
- Ohne Ausnahme

**Der quadratische Lerneffekt:**
- Du schreibst es (Hand)
- Du scannst es (Digital)
- Du tippst es ab (Verinnerlichung)
- = Fokus hoch 2

Die App ist "unnötig" - aber das Abtippen ist der Trick. Das ist die Verinnerlichung.

## Features

### 🌙 Die Stunde des Wolfs
- Upload nur zwischen 21:00 - 03:00 Uhr möglich
- Das ist die Zeit der Planung, der Vorbereitung

### 📸 Polaroid-Entwicklung
- Dein Bekenntnis entwickelt sich über 45 Sekunden
- Authentisches Warten, echte Vorfreude
- 70er-Jahre-Vibe

### 🔥 Streak System
- Schwarzer Splash-Screen mit deiner Streak-Zahl
- Jeden Tag ohne Ausnahme
- Dein Leben in 10 Jahren wird dir danken

### 🌍 Globaler Puls
- "In diesem Moment bekennen sich: [8.452] Seelen"
- Live während der Stunde des Wolfs
- Du bist nicht allein

### 🎬 **Monats-Parade (NEU!)**
- Am 1-7. des Monats verfügbar
- Rasender Supercut all deiner Bekenntnisse
- Mit 70er-Jahre-Gitarren-Riff (Audio einfügen unter `/public/parade-music.mp3`)
- **Share-Button für Social Media** - "Mein November. Durchgezogen."
- Das ist der virale Hebel!

### 💶 7-Tage Paywall
- Kostenlos für 7 Tage
- Dann: 0,99€ für ewiges Archiv
- "Investiere 99 Cent in DICH, statt 10€ in die Träume anderer."

## Tech Stack

- **Next.js 14** - App Router
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling mit 70er-Jahre-Vibe
- **PWA** - Installierbar auf dem Homescreen
- **LocalStorage** - Alle Daten bleiben lokal

## Installation & Development

```bash
# Dependencies installieren
npm install

# Dev Server starten
npm run dev

# Build für Production
npm run build
npm start
```

Die App läuft auf [http://localhost:3000](http://localhost:3000)

## Testing Tipps

### Stunde des Wolfs testen
Standardmäßig nur 21:00-03:00 Uhr. Zum Testen:

In `lib/storage.ts` Zeile 92, ändere temporär:
```typescript
export const isWithinWolfHour = (): boolean => {
  return true; // IMMER erlauben für Tests
};
```

### Monats-Parade testen
Die Parade erscheint nur wenn:
1. Es ist Tag 1-7 des Monats
2. Du hast mindestens 7 Bekenntnisse vom letzten Monat

Zum Testen in `lib/monthlyParade.ts` Zeile 42-46 anpassen:
```typescript
export const canShowParade = (commitments: Commitment[]): boolean => {
  return commitments.length >= 7; // Immer zeigen wenn 7+ vorhanden
};
```

Dann einfach 7+ Bekenntnisse erstellen (Datum im Code anpassen wenn nötig).

### Audio für Parade hinzufügen
Lege einen 70er-Jahre-Gitarren-Riff als `public/parade-music.mp3` ab.
Empfehlung: 3-4 Sekunden, upbeat, "cheesey" Vibe.

## Deployment

### Vercel (empfohlen)
```bash
npm install -g vercel
vercel
```

### Andere Hosting-Optionen
- Netlify
- Railway
- Eigener Server mit PM2

## Monetarisierung

**Phase 1:** 0,99€ einmalig für ewiges Archiv (nach 7 Tagen)

**Phase 2 (optional):**
- Gebrandete Klebezettel-Blöcke verkaufen
- Premium-Features (Analytics, Insights)
- "PAPYR Club" - exklusive Community

## Marketing-Strategie

Siehe `chad.md` für die komplette Vision.

**Kern-Idee:** "Flüster-Launch"
- Keine klassische Werbung
- Seeding an 10 "stille" Hustle-Philosophen
- Viral durch Monats-Parade Shares
- FOMO durch den "Du brauchst es nicht?"-Pitch

## To-Do für Production

- [ ] Echte Icons erstellen (192x192, 512x512)
- [ ] 70er-Jahre-Audio für Parade hinzufügen
- [ ] Sound-Effekte: Vintage Camera Click
- [ ] Push Notifications für 21:00 Uhr
- [ ] Payment-Integration (Stripe/PayPal) für 0,99€
- [ ] Backend für echten "Globalen Puls"
- [ ] Analytics (optional)

## Die Vision

Diese App wird viral gehen nicht weil sie gut ist, sondern weil sie **unnötig** ist.

Sie ist der "Pet Rock" für den Erfolg. Sie ist arrogant. Sie schreibt dir vor, wann du sie nutzen darfst. Sie lässt dich warten. Sie nimmt dir Geld ab.

Und genau deswegen wird sie funktionieren.

**"Teil das Ritual einmal für 0,99€. Dein Leben wird's dir danken. Und wir auch. Bekenne dich."**

---

Made with 🔥 and a typewriter
