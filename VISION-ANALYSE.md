# PAPYR - Vision vs. Aktuelle Implementation

## ⚠️ GROSSE UNTERSCHIEDE ERKANNT

### 1️⃣ ONBOARDING - KOMPLETT ANDERS

**Deine Vision (onboarding.md):**
- Einstein-Zitat am Anfang
- Persönlicher Ton ("Bro oder Sis", Namen erfragen)
- NAME wird durchgehend verwendet
- Lockerer, ermutigender Ton
- Optional: 3-Minuten Video-Version
- Fokus auf "du schaffst das"

**Was wir haben:**
- 4 Slides mit "brutalem" Marketing-Pitch
- Kein Name-Input
- Fokus auf "quadratischer Lerneffekt"
- Daily Questions System (nicht in deiner Vision!)
- 7-Tage-Reflexion (nicht in deiner Vision!)

---

## 2️⃣ KERN-UNTERSCHIEDE

### Zeitfenster
- ❌ Aktuell: 21:00-03:00 Uhr
- ✅ Soll: 20:00-02:00 Uhr

### Free Trial
- ❌ Aktuell: 7 Tage kostenlos
- ✅ Soll: 14 Tage kostenlos

### Pricing
- ❌ Aktuell: Einmalig 0,99€
- ✅ Soll: 1€/Monat (Abo!)
- ➕ Neu: Pro-Account für 4,95€/Monat (nur Badge, keine Features)

### Streak System
- ❌ Aktuell: Streak reset bei Verpassen
- ✅ Soll: Joker-System! Alle 7 Tage Streak = 1 Joker
  (Heißt: Bei 7er Streak kannst du 1x verpassen ohne Reset)

---

## 3️⃣ FEHLENDE FEATURES (in deiner Vision, nicht implementiert)

### CORE Features:
1. ✅ **Name-Input** im Onboarding + Personalisierung
2. ✅ **Initialen-Signatur** - User kann jeden Zettel signieren
3. ⚠️ **Joker-System** - 1 Joker pro 7 Tage Streak
4. ⚠️ **Push Notifications** - Tägliche Erinnerung
5. ⚠️ **Kalender-Sync** - Zettel in Google/Apple Calendar
6. ⚠️ **Globaler Counter** - "Heute wurden X Zettel eingereicht"

### COMMUNITY Features:
7. ❌ **Inspiration Feed** - Lass dich von Zielen anderer inspirieren
8. ❌ **Community Stöberkiste** - Random Ziele von anderen

### MONETIZATION:
9. ❌ **Pro-Account** - 4,95€/Monat für "Pro" Badge
10. ❌ **Shop** - Merchandise & Umweltprojekte

### NICE-TO-HAVE:
11. ⚠️ **Video-Onboarding** - 3-Minuten Video statt Text
12. ⚠️ **Tooltips/Tutorial** - Features als Tooltips, nicht Pop-ups

---

## 4️⃣ WAS WIR HABEN, ABER NICHT IN DEINER VISION IST

### Features die wir gebaut haben, aber nicht erwähnt wurden:
- ❓ **Daily Questions** (7 Fragen in der ersten Woche)
- ❓ **7-Tage-Reflexion** (10-Jahres-Vision)
- ❓ **Monats-Parade** (Video-Supercut + Share)
- ❓ **Polaroid-Entwicklung** (45 Sekunden Warte-Effekt)

**Frage:** Willst du diese Features behalten oder ersetzen?

---

## 🎯 UMSETZUNGS-PLAN - VORSCHLAG

### PHASE 1: Core Fixes (1-2 Tage)
**Basis an deine Vision anpassen:**
- [ ] Zeitfenster auf 20:00-02:00 ändern
- [ ] Free Trial auf 14 Tage ändern
- [ ] Onboarding komplett neu (mit Name-Input)
- [ ] Pricing auf 1€/Monat Abo umstellen
- [ ] Joker-System implementieren
- [ ] Initialen-Signatur-Feature

### PHASE 2: Essential Features (2-3 Tage)
**Wichtigste neue Features:**
- [ ] Push Notifications
- [ ] Kalender-Sync (Google/Apple)
- [ ] Globaler Counter "X Zettel heute"
- [ ] Stripe/PayPal Integration für 1€/Monat

### PHASE 3: Community (3-4 Tage)
**Social Features:**
- [ ] Inspiration Feed
- [ ] Anonyme Ziele-Stöberkiste
- [ ] Pro-Account System (4,95€)

### PHASE 4: Polish & Extras
**Nice-to-Have:**
- [ ] Video-Onboarding Option
- [ ] Shop-Integration
- [ ] Tooltips/Tutorial-System
- [ ] Analytics

---

## ❓ ENTSCHEIDUNGEN DIE WIR TREFFEN MÜSSEN

### 1. Daily Questions & 7-Tage-Reflexion
**Option A:** Komplett entfernen (nicht in deiner Vision)
**Option B:** Behalten als "Bonus-Feature"
**Option C:** In Community-Fragen umwandeln

### 2. Monats-Parade
**Option A:** Behalten (ist viral & cool)
**Option B:** Entfernen (nicht in deiner Vision)
**Option C:** Als "Pro-Feature" anbieten

### 3. Polaroid-Entwicklung
**Option A:** Behalten (70er-Vibe passt)
**Option B:** Entfernen (nicht erwähnt)
**Option C:** Optional machen

### 4. Onboarding-Ton
**Deine Vision:** Locker, ermutigend, "Bro/Sis", persönlich
**Was wir haben:** Marketing-Pitch, brutal, FOMO
**→ Komplett neu schreiben!**

---

## 🚀 MEIN VORSCHLAG FÜR VORGEHEN

### SOFORT (heute):
1. **Gemeinsam entscheiden:**
   - Welche Features behalten? (Daily Questions, Parade, etc.)
   - Welche Priorität haben neue Features?
   - Onboarding-Ton: Genau wie in onboarding.md oder Mischung?

2. **Dann schrittweise umbauen:**
   - Ich erstelle für jeden Schritt eine Branch
   - Du testest nach jedem Schritt
   - Wir mergen nur was funktioniert

### STRUKTUR:
- `feature/new-onboarding` - Name-Input, neuer Ton
- `feature/joker-system` - Joker alle 7 Tage
- `feature/initials-signature` - Signatur-Feature
- `feature/notifications` - Push Notifications
- `feature/calendar-sync` - Kalender-Integration
- `feature/community` - Inspiration Feed
- `feature/pro-account` - 4,95€ Tier
- `feature/shop` - Shop-Integration

---

## 📊 PRIORITÄTEN-FRAGE AN DICH

**Was ist dir am wichtigsten?**

1️⃣ **Onboarding auf deine Vision anpassen** (Name, Ton, Flow)
2️⃣ **Joker-System** (1 Joker pro 7 Tage Streak)
3️⃣ **Initialen-Signatur** (jeden Zettel signieren)
4️⃣ **1€/Monat Abo** statt einmalig
5️⃣ **Push Notifications**
6️⃣ **Community/Inspiration**
7️⃣ **Pro-Account (4,95€)**
8️⃣ **Shop**

**Oder sollen wir erst mal ALLES durchsprechen und einen Master-Plan machen?**

---

Lass uns das jetzt besprechen! Was ist deine Meinung?
