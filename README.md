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

### ❓ **Daily Questions (NEU!)**
- In der ersten Woche (Tag 1-7) erhält jeder User nach seinem Bekenntnis eine tiefgründige Frage
- 7 Fragen die Commitment aufbauen:
  - Tag 1: "Was wäre anders, wenn du heute dein Leben ernst nehmen würdest?"
  - Tag 2: "Wer bist du, wenn niemand zuschaut?"
  - Tag 3: "Was würdest du tun, wenn Scheitern unmöglich wäre?"
  - usw.
- Kann übersprungen werden, aber wird als "gesehen" markiert
- Alle Antworten werden lokal gespeichert

### 🎯 **7-Tage-Reflexion (NEU!)**
- Nach exakt 7 Tagen erscheint eine große Reflexion (3 Screens):
  1. "7 TAGE - Ohne Ausnahme. Durchgezogen."
  2. **Die entscheidende Frage:** "Wo willst du in 10 Jahren sein?"
  3. **Der brutale Pitch:** "Warum zahlst du nicht einfach den 1€ und legst los?"
- User MUSS seine 10-Jahres-Vision aufschreiben
- Direkt danach: Die verbesserte Paywall
- Entweder zahlen (0,99€) oder Streak zurücksetzen

### 🌙 Die Stunde des Wolfs
- Upload nur zwischen 20:00 - 02:00 Uhr möglich
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

### 💶 14-Tage Free Trial
- Kostenlos für 14 Tage
- Dann: 1€/Monat für ewiges Archiv (Abo)
- "Investiere 1€ in DICH, statt 10€ in die Träume anderer."

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

### Daily Questions testen
Die Fragen erscheinen automatisch nach jedem Bekenntnis in den ersten 7 Tagen.

Zum schnellen Testen:
1. Zeitfenster deaktivieren (siehe unten)
2. Mache 1 Bekenntnis → Frage 1 erscheint
3. Beantworte oder überspringe
4. Mache nächstes Bekenntnis → Frage 2 erscheint
5. usw.

### 7-Tage-Reflexion testen
Nach dem 7. Bekenntnis (Streak = 7) erscheint automatisch die 3-teilige Reflexion:
1. Celebratory Screen
2. 10-Jahres-Vision Eingabe
3. Brutaler 0,99€ Pitch

**Um direkt zur Reflexion zu springen:**
In der Browser Console:
```javascript
const state = JSON.parse(localStorage.getItem('papyr_state'));
state.currentStreak = 7;
state.hasCompletedSevenDayReflection = false;
localStorage.setItem('papyr_state', JSON.stringify(state));
location.reload();
```

### Stunde des Wolfs testen
Standardmäßig nur 20:00-02:00 Uhr. Zum Testen:

In `lib/storage.ts` Zeile 92, ändere temporär:
```typescript
export const isWithinWolfHour = (): boolean => {
  return true; // IMMER erlauben für Tests
};
```

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
- Viral durch authentisches Ritual und Commitment
- FOMO durch den "Du brauchst es nicht?"-Pitch

## To-Do für Production

- [ ] Echte Icons erstellen (192x192, 512x512)
- [ ] Sound-Effekte: Vintage Camera Click
- [ ] Push Notifications für 20:00 Uhr
- [ ] Payment-Integration (Stripe) für 1€/Monat Abo
- [ ] Backend für echten "Globalen Puls"
- [ ] Joker-System (1 Joker pro 7 Tage Streak)
- [ ] Initialen-Signatur Feature
- [ ] Analytics (optional)

## Die Vision

Diese App wird viral gehen nicht weil sie gut ist, sondern weil sie **unnötig** ist.

Sie ist der "Pet Rock" für den Erfolg. Sie ist arrogant. Sie schreibt dir vor, wann du sie nutzen darfst. Sie lässt dich warten. Sie nimmt dir Geld ab.

Und genau deswegen wird sie funktionieren.

**"Teil das Ritual einmal für 0,99€. Dein Leben wird's dir danken. Und wir auch. Bekenne dich."**

---

Made with 🔥 and a typewriter
