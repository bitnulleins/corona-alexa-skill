<img src="https://www.bit01.de/wp-content/uploads/2020/11/alexa_coronazahlen.png" width="100" />

# Corona Zahlen
Alexa App für Corona Zahlen

## Aktuelle Features
* Alle 60 Minuten ein Update der Zahlen
* Fässt die wichtigsten Corona Covid-19 Zahlen des RKI's zusammen.
* Beim öffnen werden die neuen Corona Fälle aufgelistet.
* Wenn Standort Berechtigung erlaubt ist, wird automatisch der Inzidenz des Bundeslandes ausgegeben.

## Datenquelle

Als Datenquelle wird die [Seite des RKIs](https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Fallzahlen.html) verwendet. Zusammengefasst und strukturiert gespeichert werden die Zahlen in einer öffentlichen API auf meinem Server zur Verfügung gestellt. Diese Zahlen werden alle 60 Minuten aktualisiert:
``https://api.bitnulleins.de/corona/cases/all``

oder z.B. für "Gesamt" Deutschland oder Hamburg:

``https://api.bitnulleins.de/corona/cases/[Gesamt/Hamburg]``
