# Supabase Setup Anleitung

## 1. SQL Schema ausführen

1. Gehe zu deinem Supabase Dashboard: https://supabase.com/dashboard
2. Wähle dein Projekt aus: `hiptwqmdyrfqekvlncax`
3. Navigiere zu **SQL Editor** (linke Sidebar)
4. Klicke auf **New query**
5. Kopiere den Inhalt von `lib/supabase/schema.sql` und füge ihn ein
6. Klicke auf **Run** (oder drücke `Cmd/Ctrl + Enter`)

## 2. Storage Bucket für Bilder erstellen

1. Navigiere zu **Storage** in der linken Sidebar
2. Klicke auf **Create new bucket**
3. Name: `commitment-images`
4. **Public bucket**: NEIN (privat lassen!)
5. Klicke auf **Create bucket**

Die Storage Policies werden automatisch durch das SQL-Schema erstellt.

## 3. Authentication konfigurieren

### E-Mail Authentication aktivieren:
1. Gehe zu **Authentication** > **Providers**
2. **Email** sollte bereits aktiviert sein
3. Optional: Aktiviere **Confirm email** für zusätzliche Sicherheit

### Optional - Google/Social Login:
1. Gehe zu **Authentication** > **Providers**
2. Aktiviere gewünschte Provider (Google, GitHub, etc.)
3. Folge den Anweisungen für OAuth-Setup

## 4. Umgebungsvariablen prüfen

Stelle sicher, dass deine `.env.local` folgende Werte hat:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://hiptwqmdyrfqekvlncax.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dein_anon_key
SUPABASE_SERVICE_ROLE_KEY=dein_service_role_key
```

✅ Diese sind bereits konfiguriert!

## 5. Testdaten erstellen (optional)

Nach dem ersten Login wird automatisch ein Profil erstellt.
Du kannst auch manuell in der Supabase Console Daten hinzufügen:

1. Gehe zu **Table Editor**
2. Wähle die Tabelle `profiles` oder `commitments`
3. Klicke auf **Insert row**

## Nächste Schritte

Nach der Datenbank-Einrichtung:
1. Helper-Funktionen für Datenbankoperationen erstellen
2. LocalStorage-Code durch Supabase-Aufrufe ersetzen
3. Authentifizierung in die App integrieren
4. Bild-Upload zu Supabase Storage implementieren
