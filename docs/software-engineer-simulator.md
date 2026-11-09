# (Modern) Software Engineer Simulator: Projektdefinition und User Stories

## 1. Projektübersicht

Der (Modern) Software Engineer Simulator ist ein satirisches Idle-/Clicker-Spiel über moderne Softwareentwicklung, in dem der Spieler ständig zwischen schnellem Wachstum und Codequalität abwägen muss.

- **Arbeitstitel:** (Modern) Software Engineer Simulator
- **Genre:** Incremental / Idle Game mit Management- und Minispiel-Elementen
- **Spielmodus:** Single-Player

**Grundidee:** Jeder Klick schreibt Code und bringt **Tokens**. Mit Tokens kauft man Automatisierungen wie Junior Devs, KI-Agenten oder CI-Pipelines, die Tokens pro Sekunde (TPS) erzeugen. Jede Automatisierung hat aber Nebenwirkungen, vor allem **Tech Debt**, und dadurch entstehen die Mechaniken, die das Spiel über einen reinen Clicker hinausheben.

**Ausgangslage:** Klassische Clicker wie Cookie Clicker belohnen fast nur das Anhäufen von Ressourcen. Der Alltag in der Softwareentwicklung bietet dagegen echte Zielkonflikte: Geschwindigkeit gegen Qualität, Automatisierung gegen Kontrolle, Hype gegen Stabilität. Genau diese Konflikte werden zur Spielmechanik.

**Vision:** Ein Spiel, das man in kurzen Sessions spielt, das im Hintergrund weiterläuft und das Entwicklerinnen und Entwickler zum Schmunzeln bringt, weil sie Incidents, Freitags-Deployments und halluzinierte APIs aus dem eigenen Alltag wiedererkennen.

**Zielgruppe** : Gamer/Software engineers oder "Tech Bros"

## 2. Projektziele

### Produktziele

| ID | Ziel | Messgröße / Erfolgskriterium |
| --- | --- | --- |
| Z1 | Spielbarer MVP mit dem Core Loop | Alle MUST-Stories (US-01, US-02, US-03, US-10) sind umgesetzt und abgenommen |
| Z2 | Tech Debt als zentrale strategische Entscheidung | Spieler müssen regelmäßig zwischen Ausbau und Refactoring abwägen; ein Run ohne Debt-Management ist spürbar langsamer |
| Z3 | Aktives Spielerlebnis statt reinem Warten | Incidents, Hype-Zyklen und Energie-Meter (US-04 bis US-06) sorgen für Entscheidungen in jeder Session |
| Z4 | Langzeitmotivation | Prestige über Exit / IPO (US-09) ist verfügbar; der erste Exit ist nach ca. 30 bis 60 Minuten Spielzeit erreichbar |
| Z5 | Wiedererkennbarer Humor | Generatoren, Events und Achievements greifen echte Situationen aus dem Entwickleralltag auf |
| Z6 | Fortschritt bleibt erhalten | Automatisches Speichern und Offline-Fortschritt mit Cap funktionieren zuverlässig |

### Qualitätsziele

- **Balancing:** Alle Spielwerte (Preise, Multiplikatoren, Debt-Schwellen, Event-Wahrscheinlichkeiten) liegen zentral in einer Konfiguration und lassen sich ohne Codeänderung anpassen.
- **Wartbarkeit:** Spiellogik (Tick, Berechnungen, Events) ist von der Darstellung getrennt und mit Unit-Tests abgedeckt.
- **Performance:** Flüssige Darstellung auch bei großen Zahlen; große Werte werden lesbar formatiert (z. B. 1,2 M, 3,4 B).
- **Robustheit:** Ein beschädigter oder alter Spielstand führt nicht zum Absturz; Spielstände sind versioniert.
- **Usability:** Wichtige Werte (Tokens, TPS, Debt, Energie) sind jederzeit sichtbar; jede Mechanik erklärt sich beim ersten Auftreten selbst.

### Lernziele für das Team

- Agile Arbeitsweise mit User Stories, Priorisierung nach MoSCoW und iterativen Releases
- Game-Loop-Architektur, Zustandsverwaltung und Persistenz
- Balancing und Testen von Spielsystemen mit exponentiellem Wachstum

## 3. Zielgruppe und Rahmenbedingungen

**Zielgruppe**

- Softwareentwicklerinnen und -entwickler, IT-Studierende und Tech-Interessierte, die den Insider-Humor verstehen
- Gelegenheitsspieler, die kurze Sessions (5 bis 15 Minuten) spielen und das Spiel im Hintergrund laufen lassen

**Rahmenbedingungen**

- Single-Player, keine Accounts oder Server notwendig
- Spielstand wird lokal gespeichert
- Offline-Fortschritt wird beim nächsten Start gutgeschrieben, aber begrenzt (Cap)
- Offene Punkte: Zielplattform und Technologie-Stack, Projektzeitraum, Teamgröße und Rollen

## 4. Abgrenzung (Out of Scope)

Folgendes ist bewusst **nicht** Teil des Projekts:

- Multiplayer, Online-Ranglisten oder Social Features
- Monetarisierung, Werbung oder In-App-Käufe
- Benutzerkonten und Cloud-Speicherstände
- Echte KI-Anbindung: KI ist nur Thema des Spiels, keine technische Komponente
- Aufwändige Story, Sprachausgabe oder 3D-Grafik

## 5. Priorisierung und Meilensteine

Die User Stories sind nach MoSCoW priorisiert:

- **MUST:** ohne diese Stories ist das Spiel nicht spielbar
- **SHOULD:** machen das Spiel interessant und langfristig motivierend
- **COULD:** zusätzliche Tiefe, wenn Zeit bleibt

| Meilenstein | Inhalt | Stories | Abnahmekriterium |
| --- | --- | --- | --- |
| M1: MVP | Klicken, Generatoren, Tech Debt, Speichern | US-01, US-02, US-03, US-10 | Ein kompletter Spielablauf ist ohne Fehler möglich, Spielstand bleibt erhalten |
| M2: Spieltiefe | Incidents, Energie, Hype-Zyklen | US-04, US-05, US-06 | Jede Session enthält aktive Entscheidungen |
| M3: Langzeitmotivation | Prestige mit Exit / IPO und Equity-Perks | US-09 | Ein zweiter Run fühlt sich spürbar anders an als der erste |
| M4: Extras | Code Review Minispiel, Compute-Ressource | US-07, US-08 | Optional, nur bei verfügbarer Zeit |
| M5: Polish | Balancing, Texte, Sound, Achievements erweitern | alle | Testspieler spielen freiwillig länger als 15 Minuten |

### Definition of Done (pro Story)

- Akzeptanzkriterien der Story sind erfüllt
- Spiellogik ist mit Tests abgedeckt
- Neue Werte sind in der Balancing-Konfiguration ausgelagert
- Feature ist im Spielstand gespeichert und überlebt einen Neustart
- Code ist reviewt und im Hauptzweig gemergt

## 6. Risiken

| Risiko | Auswirkung | Gegenmaßnahme |
| --- | --- | --- |
| Balancing ist schwer zu treffen | Spiel wird zu leicht, zu langsam oder stagniert | Werte zentral konfigurierbar, früh testen, Simulation des Wachstums |
| Scope Creep durch viele Ideen | MUST-Stories werden nicht fertig | Strikte MoSCoW-Reihenfolge, COULD erst nach M3 |
| Tech Debt frustriert statt fordert | Spieler verstehen den TPS-Verlust nicht | Klare Anzeige, Warnung vor Schwellen, Erklärung beim ersten Mal |
| Humor nutzt sich ab | Wiederholte Texte wirken langweilig | Viele Varianten pro Event, zufällige Auswahl |
| Offline-Fortschritt wird ausgenutzt | z. B. durch Verstellen der Systemuhr | Cap auf Offline-Zeit, Plausibilitätsprüfung der Zeitdifferenz |

## 7. User Stories

### US-01: Code schreiben (Core Loop) (MUST)
Als Spieler möchte ich auf eine Tastatur bzw. einen Editor klicken, um Tokens zu verdienen, damit ich sofort Fortschritt spüre.
- Jeder Klick gibt +X Tokens, mit kleinem Feedback (fliegende Code-Zeilen, Tastengeräusch).
- Tokens und TPS werden dauerhaft oben angezeigt.
- Klick-Upgrades wie „Mechanische Tastatur“ oder „Vim-Kenntnisse“ erhöhen den Wert pro Klick.

### US-02: Automatisierungen kaufen (MUST)
Als Spieler möchte ich Generatoren kaufen, damit Tokens auch ohne Klicken entstehen.
- Stufen zum Beispiel: Praktikant → Junior Dev → Senior Dev → Copilot → KI-Agent → Agent-Schwarm → Self-Improving AGI.
- Der Preis steigt mit jedem Kauf exponentiell (z. B. ×1,15).
- Jeder Generator zeigt seinen Anteil am gesamten TPS.

### US-03: Tech Debt als Nebeneffekt (MUST)
Als Spieler möchte ich, dass schnelle Automatisierung Tech Debt erzeugt, damit ich zwischen Wachstum und Codequalität abwägen muss.
- KI-Generatoren erzeugen mehr Debt als menschliche Devs.
- Ab bestimmten Schwellen sinkt das TPS spürbar (z. B. −10 % / −25 % / −50 %).
- Mit der Aktion „Refactoring Sprint“ baut man Debt ab, verliert dafür aber kurzzeitig Produktion.

### US-04: Production Incidents (Zufallsevents) (SHOULD)
Als Spieler möchte ich auf zufällige Incidents reagieren müssen, damit das Spiel aktiv und spannend bleibt.
- Beispiele: „Prod ist down“, „DNS ist schuld“, „Jemand hat am Freitag deployt“.
- Reagiere ich innerhalb eines Zeitfensters (Klick-Minispiel oder Hotfix-Button), gibt es einen Bonus. Sonst stoppt das TPS für X Sekunden.
- Je höher die Tech Debt, desto häufiger kommen Incidents.

### US-05: Energie / Burnout-Meter (SHOULD)
Als Spieler möchte ich eine Energieanzeige haben, die beim Dauerklicken sinkt, damit Klicken nicht unendlich effektiv ist.
- Bei niedriger Energie sinkt der Wert pro Klick.
- Kaffee, Mate oder „Touch Grass“ füllen die Energie wieder auf, jeweils mit Kosten oder Cooldown.
- Bei vollem Burnout gibt es eine Zwangspause, die Generatoren laufen aber weiter.

### US-06: Hype-Zyklen und Tech-Trends (SHOULD)
Als Spieler möchte ich auf wechselnde Tech-Trends setzen können, damit sich meine Strategie im Lauf der Zeit verändert.
- Alle paar Minuten wird ein Trend „hot“ (z. B. Rust, Web3, Serverless, Agents) und gibt einem Generator-Typ einen Multiplikator.
- Ich kann meinen Stack wechseln, was mich Tokens kostet.
- Ein veralteter Trend wird zu Legacy und erzeugt zusätzliche Debt.

### US-07: Code Review Minispiel (COULD)
Als Spieler möchte ich gelegentlich Pull Requests reviewen, damit es neben dem Klicken eine zweite, skillbasierte Mechanik gibt.
- Ich bekomme einen kurzen Code-Schnipsel und muss entscheiden: Approve oder Request Changes. Mögliche Fehler sind Bugs, Security-Lücken oder halluzinierte APIs der KI.
- Eine richtige Entscheidung gibt Bonus-Tokens und senkt die Debt. Ein falsches Approve löst später einen Incident aus.

### US-08: Rate Limits und Compute-Ressource (COULD)
Als Spieler möchte ich, dass KI-Generatoren GPU-Compute verbrauchen, damit ich eine zweite Ressource managen muss.
- KI-Generatoren laufen nur, wenn genug Compute vorhanden ist.
- Compute kauft man mit Tokens (z. B. Cloud-Credits oder ein eigenes Rechenzentrum).
- Wird Compute knapp, erscheint „429 Too Many Requests“ und die KI-Generatoren pausieren.

### US-09: Prestige durch Exit / IPO (SHOULD)
Als Spieler möchte ich mein Startup verkaufen und neu anfangen können, damit das Spiel langfristig motiviert.
- Ab einer bestimmten Token-Menge wird die Aktion „Exit“ möglich. Sie setzt den Fortschritt zurück und gibt **Equity** als permanente Währung.
- Mit Equity schaltet man dauerhafte Perks frei (z. B. „10x Engineer“, „Startet mit 5 Juniors“, „Debt-resistent“).
- Jeder Run bekommt einen witzigen Firmennamen (z. B. „Synergize.ai“).

### US-10: Achievements und Speichern (MUST)
Als Spieler möchte ich Achievements sammeln und meinen Fortschritt behalten, damit ich wiederkomme.
- Achievements mit Insider-Humor, z. B. „It works on my machine“, „Deployed Friday 17:00“, „rm -rf überlebt“, „1M Zeilen ohne Tests“.
- Der Spielstand wird automatisch gespeichert, und Offline-Fortschritt wird beim nächsten Öffnen gutgeschrieben (mit Cap).
