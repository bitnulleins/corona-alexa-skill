/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
// i18n library dependency, we use it below in a localisation interceptor
const i18n = require('i18next');
// i18n strings for all supported locales
const languageStrings = require('./languages');
const helper = require('./helper');
const moment = require('moment');

/**
 * Ideen:
 * - Quelle -> "RKI Tagesfalldaten (stündlich aktualisiert)"
 * - Daten für Bundesland abfragen
 * - Beenden: Bleibt gesund!
 * - i18n
 * - Todesfälle
 */

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    async handle(handlerInput) {
        let deviceId = handlerInput.requestEnvelope.context.System.device.deviceId
        let apiKey = handlerInput.requestEnvelope.context.System.apiAccessToken

        let coronaCases = await helper.getCoronaCases()

        let speakOutput = handlerInput.t('WELCOME_ERROR_MSG')

        if (coronaCases != null) {
            let address = await helper.getAddress(deviceId, apiKey)

            const REFERENCE = moment(coronaCases.date);
            const TODAY = REFERENCE.clone().startOf('day');

            let date = (moment().isSame(TODAY, 'd')) ? handlerInput.t('TODAY') : `${handlerInput.t('AT_THE')} ${moment(coronaCases.date).format("DD.MM.YYYY")}`

            speakOutput = handlerInput.t('WELCOME_MSG_SUMMARY', {date: date, newCases: coronaCases.data['Gesamt'].newCases})


            if (address !== null) {
                let city = address.stateOrRegion
                if (city != null) {
                    for (const [key, value] of Object.entries(coronaCases.data)) {
                        if (key.toLowerCase() === city.toLowerCase()) {
                            speakOutput += handlerInput.t('WELCOME_MSG_REGION_DETAIL', {
                                region: city,
                                newCases: value['newCases'],
                                sevenDaysIncidence: value['7daysIncidence']
                            })
                        }
                    }
                }
            }

            if (moment().weekday() == 7 || moment().weekday() == 1) {
                speakOutput += handlerInput.t('WELCOME_MSG_INFO')
            }
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withAskForPermissionsConsentCard([
                'read::alexa:device:all:address'
            ])
            .withSimpleCard('Corona Zahlen', speakOutput.replace(/<(.|\n)*?>/g, ''))
            .getResponse();
    }
};


const InfoIntent = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            (Alexa.getIntentName(handlerInput.requestEnvelope)) === 'InfoIntent';
    },
    async handle(handlerInput) {
        let coronaCases = await helper.getCoronaCases()
        let speakOutput = handlerInput.t('SOURCE',{last_update:moment(coronaCases.last_update*1000).format('DD.MM.YYYY [um] HH:mm')})

        return handlerInput.responseBuilder
            .speak(speakOutput + handlerInput.t('REPEAT_QUESTION'))
            .withShouldEndSession(false)
            .withSimpleCard('Corona Zahlen', speakOutput.replace(/<(.|\n)*?>/g, ''))
            .getResponse()
    }
}

const BundeslandIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            (Alexa.getIntentName(handlerInput.requestEnvelope)) === 'BundeslandIntent';
    },
    async handle(handlerInput) {
        let region = handlerInput.requestEnvelope.request.intent.slots.Bundesland.value;
        let regionFallback = handlerInput.requestEnvelope.request.intent.slots.Bundesland.resolutions.resolutionsPerAuthority;

        if (typeof regionFallback[0].values !== 'undefined') {
            region = regionFallback[0].values[0].value.name
        }

        let speakOutput = handlerInput.t('REGION_ERROR_MSG')

        if (region !== null) {
            let coronaCases = await helper.getCoronaCases()
            for (const [key, value] of Object.entries(coronaCases.data)) {
                if (key.toLowerCase().replace(/ /g,'') === region.toLowerCase().replace(/ /g,'')) {
                    if (region == 'gesamt') region = handlerInput.t('GERMANY')
                    speakOutput = handlerInput.t('REGION_MSG',{region:region.toUpperCase(),newCases:value['newCases'],sevenDaysIncidence:value['7daysIncidence'],casesSum:value['casesSum']})
                }
            }
        }
        return handlerInput.responseBuilder
            .speak(speakOutput + handlerInput.t('REPEAT_QUESTION'))
            .withShouldEndSession(false)
            .reprompt(handlerInput.t('REPROMPT'))
            .withSimpleCard('Corona Zahlen', speakOutput.replace(/<(.|\n)*?>/g, ''))
            .getResponse()
    }
}

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('GOODBYE_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withShouldEndSession(true)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('FALLBACK_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = handlerInput.t('ERROR_MSG');
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// This request interceptor will bind a translation function 't' to the handlerInput
const LocalisationRequestInterceptor = {
    process(handlerInput) {
        i18n.init({
            lng: Alexa.getLocale(handlerInput.requestEnvelope),
            resources: languageStrings
        }).then((t) => {
            handlerInput.t = (...args) => t(...args);
        });
    }
};
/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        BundeslandIntentHandler,
        InfoIntent,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler)
    .addErrorHandlers(
        ErrorHandler)
    .addRequestInterceptors(
        LocalisationRequestInterceptor)
    .lambda();