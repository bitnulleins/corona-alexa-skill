/* *
 * We create a language strings object containing all of our strings.
 * The keys for each string will then be referenced in our code, e.g. handlerInput.t('WELCOME_MSG').
 * The localisation interceptor in index.js will automatically choose the strings
 * that match the request's locale.
 * */

module.exports = {
    de: {
        translation: {
            WELCOME_ERROR_MSG: 'Ich konnte die Daten vom <say-as interpret-as="spell-out">RKI</say-as> nicht öffnen. Bitte prüfe es später erneut.',
            WELCOME_MSG_SUMMARY: '{{date}} wurden <say-as interpret-as="cardinal">{{newCases}}</say-as> neue Corona Fälle gemeldet.',
            WELCOME_MSG_REGION_DETAIL: ' In {{region}} gibt es <say-as interpret-as="cardinal">{{newCases}}</say-as> neue Fälle. Der 7-Tages-Inzidenz liegt bei {{sevenDaysIncidence}}.',
            WELCOME_MSG_INFO: ' Heute sind die Zahlen niedriger, da nicht alle Gesundheitsämter Zahlen des Vortages übermittelt haben.',
            REGION_MSG: 'In {{region}} gibt es <say-as interpret-as="number">{{newCases}}</say-as> neue Fälle. Der 7-Tages-Inzidenz liegt bei {{sevenDaysIncidence}}. Insgesamt gibt es in {{region}} <say-as interpret-as="cardinal">{{casesSum}}</say-as> bestätigte Fälle.',
            REGION_ERROR_MSG: 'Leider konnte ich das Bundesland nicht verstehen{{region}}.',
            GOODBYE_MSG: 'OK. Bleib gesund!',
            SOURCE: 'Die Zahlen stammen von der offiziellen Fallzahlen Seite des Robert Koch Instituts. Zuletzt habe ich die Zahlen am {{last_update}} abgerufen.',
            REPEAT_QUESTION: ' Möchtest du noch etwas wissen?',
            FALLBACK_MSG: 'Es tut mir leid, das kann ich leider nicht beantworten.',
            ERROR_MSG: 'Es tut mir leid, das konnte ich nicht machen. Bitte wiederhole deine Anfrage.',
            GERMANY: 'Deutschland',
            TODAY: 'Heute',
            AT_THE: 'Am',
            REPROMPT: 'Nenne mir bitte ein Bundesland oder sage Deutschland'
        }
    },
}