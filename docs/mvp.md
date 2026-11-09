# MVP: (Modern) Software Engineer Simulator

## Ziel des MVP

Das MVP beweist, dass der Core Loop Spaß macht: Klicken, Generatoren kaufen und dabei Tech Debt managen. Alles andere kommt erst danach.

**Hypothese:** Spieler bleiben länger dran, wenn Wachstum einen Preis hat (Tech Debt) und sie aktiv entscheiden müssen, wann sie refactoren.

## Umfang (In Scope)

Das MVP umfasst genau die MUST-Stories:

| Story | Feature | MVP-Umfang |
| --- | --- | --- |
| US-01 | Code schreiben (Core Loop) | Klickfläche (Editor), +Tokens pro Klick, fliegende Code-Zeilen als Feedback, Anzeige von Tokens und TPS, 3 Klick-Upgrades |
| US-02 | Automatisierungen kaufen | 5 Generatoren, exponentielle Preise (×1,15), Anzeige des TPS-Anteils pro Generator |
| US-03 | Tech Debt | Debt-Anzeige, 3 Schwellen mit TPS-Malus, Aktion „Refactoring Sprint“ |
| US-10 | Speichern und Achievements | Autosave, Offline-Fortschritt mit Cap, 5 Achievements |

## Startwerte für das Balancing

Alle Werte liegen in einer zentralen Konfiguration und sind nur Startwerte zum Testen.

### Klick-Upgrades

| Upgrade | Preis | Effekt |
| --- | --- | --- |
| Mechanische Tastatur | 50 | +1 Token pro Klick |
| Vim-Kenntnisse | 500 | ×2 Tokens pro Klick |
| Dark Mode | 5.000 | ×2 Tokens pro Klick |

### Generatoren

| Generator | Basispreis | TPS | Debt pro Sekunde |
| --- | --- | --- | --- |
| Praktikant | 15 | 0,1 | 0,01 |
| Junior Dev | 100 | 1 | 0,05 |
| Senior Dev | 1.100 | 8 | 0,02 |
| Copilot | 12.000 | 47 | 0,5 |
| KI-Agent | 130.000 | 260 | 3 |

Preis nach n Käufen: `Basispreis × 1,15^n`

### Tech Debt

| Debt-Stand | TPS-Malus |
| --- | --- |
| ab 100 | −10 % |
| ab 500 | −25 % |
| ab 2.000 | −50 % |

**Refactoring Sprint:** senkt die Debt um 50 %, dafür produzieren alle Generatoren 30 Sekunden lang nur die Hälfte. Cooldown 2 Minuten.

### Speichern

- Autosave alle 10 Sekunden und beim Schließen
- Offline-Fortschritt: TPS × Offline-Zeit, maximal 8 Stunden, ohne zusätzliche Debt-Berechnung
- Spielstand mit Versionsnummer, damit spätere Updates alte Stände lesen können

### Achievements

- „Hello World“: erster Klick
- „It works on my machine“: erster Generator gekauft
- „10x Engineer“: 10 Generatoren besessen
- „Spaghetti Code“: erste Debt-Schwelle erreicht
- „Clean Coder“: ersten Refactoring Sprint gestartet

## Nicht im MVP

- Production Incidents (US-04)
- Energie / Burnout-Meter (US-05)
- Hype-Zyklen und Tech-Trends (US-06)
- Code Review Minispiel (US-07)
- Compute-Ressource und Rate Limits (US-08)
- Prestige mit Exit / IPO (US-09)
- Sound, Animationen über das Klick-Feedback hinaus, weitere Generatoren

## Abnahmekriterien

- [ ] Ein neuer Spieler versteht ohne Erklärung, was er tun soll, und kauft innerhalb der ersten Minute einen Generator
- [ ] Tokens, TPS und Debt sind jederzeit sichtbar und korrekt berechnet
- [ ] Ab dem Copilot wird Tech Debt spürbar und der Refactoring Sprint wird bewusst eingesetzt
- [ ] Nach einem Neustart ist der Spielstand vollständig da, Offline-Fortschritt wird angezeigt und gutgeschrieben
- [ ] Spiellogik (Tick, Preise, Debt-Malus, Offline-Berechnung) ist mit Unit-Tests abgedeckt
- [ ] Eine Session von 15 Minuten läuft ohne Fehler und ohne Stillstand (es gibt immer ein erreichbares nächstes Ziel)

## Erfolgsmessung

Das MVP gilt als Erfolg, wenn Testspieler freiwillig länger als 15 Minuten spielen und den Tech-Debt-Mechanismus als interessante Entscheidung beschreiben, nicht als Strafe.

## Nächste Schritte nach dem MVP

1. Feedback der Testspieler auswerten und Balancing anpassen
2. Meilenstein M2: Incidents, Energie, Hype-Zyklen (US-04 bis US-06)
3. Meilenstein M3: Prestige mit Exit / IPO (US-09)
