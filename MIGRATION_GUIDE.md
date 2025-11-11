# Migration von LocalStorage zu Supabase

## Übersicht

Diese Anleitung zeigt, wie du die PAPYR App von LocalStorage zu Supabase migrieren kannst.

## ✅ Was bereits fertig ist:

### 1. Datenbank & Infrastructure
- ✅ PostgreSQL Schema erstellt (`profiles`, `commitments` Tabellen)
- ✅ Row Level Security (RLS) Policies eingerichtet
- ✅ Storage Bucket für Commitment-Bilder erstellt
- ✅ Middleware für Session-Management

### 2. Helper-Funktionen
- ✅ **Auth-Funktionen** (`lib/supabase/auth.ts`)
  - Sign up, Sign in, Sign out
  - OAuth (Google, GitHub, Apple)
  - Password reset

- ✅ **Datenbank-Funktionen** (`lib/supabase/database.ts`)
  - Profile erstellen/abrufen/aktualisieren
  - Commitments erstellen/abrufen/löschen
  - Bilder zu Storage hochladen
  - Streak & Joker System

- ✅ **Auth Context** (`lib/supabase/context.tsx`)
  - Globaler Auth-Status
  - `useAuth()` Hook für Components

### 3. UI Components
- ✅ **AuthModal** (`components/AuthModal.tsx`)
  - Login & Signup
  - Email/Password Auth
  - OAuth Buttons

### 4. Routes
- ✅ **Auth Callback** (`app/auth/callback/route.ts`)
  - OAuth Redirect Handler
  - Automatische Profil-Erstellung

---

## 🔄 Nächste Schritte: Components migrieren

### Option 1: Schrittweise Migration (Empfohlen für Testing)

1. **Dashboard.tsx migrieren**
   - LocalStorage `getAppState()` durch `useAuth()` und Supabase-Funktionen ersetzen
   - Commitment-Upload an Supabase anpassen

2. **Archive.tsx migrieren**
   - Commitments aus Supabase laden

3. **Settings.tsx migrieren**
   - Profile Updates an Supabase senden

### Option 2: Alles auf einmal (Schneller, aber riskanter)

Alle Components gleichzeitig migrieren.

---

## 📋 Migration Checklist

### Für jede Component:

#### 1. Imports ändern
```tsx
// ALT (LocalStorage)
import { getAppState, addCommitment, deleteCommitment } from '@/lib/storage';

// NEU (Supabase)
import { useAuth } from '@/lib/supabase/context';
import { getCommitments, createCommitment, deleteCommitment } from '@/lib/supabase/database';
```

#### 2. State Management anpassen
```tsx
// ALT
const [appState, setAppState] = useState(getAppState());

// NEU
const { profile, refreshProfile } = useAuth();
const [commitments, setCommitments] = useState([]);

useEffect(() => {
  loadCommitments();
}, []);

async function loadCommitments() {
  const data = await getCommitments();
  setCommitments(data);
}
```

#### 3. Auth Guard hinzufügen
```tsx
const { user, profile, loading } = useAuth();
const [showAuthModal, setShowAuthModal] = useState(false);

if (loading) return <div>Lädt...</div>;

if (!user) {
  return <AuthModal
    isOpen={true}
    onClose={() => {}}
    onSuccess={() => window.location.reload()}
  />;
}
```

#### 4. Bild-Upload anpassen
```tsx
// ALT (Base64)
const reader = new FileReader();
reader.onload = () => {
  addCommitment(reader.result as string, goals);
};
reader.readAsDataURL(file);

// NEU (File Upload)
await createCommitment(file, goals, signWithInitials);
await refreshProfile(); // Streak & Joker aktualisieren
```

---

## 🎯 Mapping: Alt zu Neu

| LocalStorage Funktion | Supabase Funktion |
|----------------------|-------------------|
| `getAppState()` | `useAuth().profile` + `getCommitments()` |
| `saveAppState()` | Automatisch durch Supabase |
| `addCommitment()` | `createCommitment(file, goals, sign)` |
| `deleteCommitment()` | `deleteCommitment(id)` |
| `markCommitmentCompleted()` | `markCommitmentCompleted(id)` |
| `completeOnboarding()` | `completeOnboarding(paid, name)` |
| `canCommitToday()` | `canCommitToday()` |
| `needsPaywall()` | `needsPaywall()` |

---

## 🧪 Testing Strategy

1. **Lokales Testing**
   - Teste mit Testuser in Supabase
   - Prüfe Console für Fehler

2. **Daten Migration**
   - Optional: Script schreiben, um LocalStorage-Daten zu Supabase zu migrieren
   - Oder: Nutzer müssen neu anfangen (empfohlen für Beta)

3. **Rollout**
   - Deploye auf Vercel/Netlify
   - Teste Production Environment
   - Monitore Supabase Dashboard für Fehler

---

## 🔐 Wichtige Sicherheits-Checks

- ✅ RLS Policies aktiv für alle Tabellen
- ✅ Storage Policies erlauben nur Zugriff auf eigene Bilder
- ✅ Service Role Key nur in `.env.local` (nicht in Git!)
- ✅ HTTPS in Production

---

## 🐛 Troubleshooting

### Problem: "No user found"
→ User ist nicht eingeloggt. AuthModal zeigen.

### Problem: "Profile not found"
→ Profile wurde nicht erstellt. Automatisch in Auth Callback erstellen.

### Problem: "Storage upload failed"
→ Bucket-Policies prüfen. Bucket muss existieren und korrekt benannt sein.

### Problem: "RLS policy violation"
→ User ist nicht authentifiziert oder Policy stimmt nicht.

---

## 📊 Vorteile der Migration

1. **Sync über Geräte** - Daten sind nicht mehr nur lokal
2. **Backup** - Automatisches Backup in Supabase Cloud
3. **Skalierbarkeit** - Unlimitierte Nutzer möglich
4. **Sicherheit** - Row Level Security schützt User-Daten
5. **Storage** - Bilder effizient in CDN statt Base64
6. **Performance** - Schnellerer Load (keine großen localStorage objects)

---

## 🚀 Bereit zum Start?

Sag Bescheid, welche Component wir als Erstes migrieren sollen!
