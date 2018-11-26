// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const sessionAttributes = {};

        Object.assign(sessionAttributes, {
          points: {
              "David": 11,
              "Celeste": 0
          }
        });

        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        const speechText = 'Chaudoudoux is up and running!';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('patate')
            .getResponse();
    }
};

const AddPointIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'add_point';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const child = sessionAttributes.child
        
        let count = parseInt(sessionAttributes.points[child], 10)
        count += 1
        sessionAttributes.points[child] = count
        
        const speechText = 'Good Job ' + child + '!!!' + ' You now have ' + sessionAttributes.points[child] + ' chaudoudoux!';
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('patate')
            .getResponse();
    }
};

const TotalPointIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'count_points';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const child = sessionAttributes.child
        const speechText = child + ' has ' + sessionAttributes.points[child] + ' chaudoudoux';
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('patate')
            .getResponse();
    }
};

const RewardIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'reward';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const child = sessionAttributes.child

        let count = parseInt(sessionAttributes.points[child], 10)
        let diff = 20 - count

        const speechText = 'You need ' + diff + ' more chaudoudoux to get a candy!';
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('patate')
            .getResponse();
    }
};

const ListTasksIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'list_tasks';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const speechText = 'Here are the tasks you can do';
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('patate')
            .getResponse();
    }
};

const SwitchChildIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'switch_child';
    },
    handle(handlerInput) {
        const child = handlerInput.requestEnvelope.request.intent.slots.child.value
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.child = child
        const speechText = 'Hi ' + child + '! You have ' + sessionAttributes.points[child] + ' chaudoudoux!';
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('patate')
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        const speechText = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.message}`);
        const speechText = `Sorry, I couldn't understand what you said. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        AddPointIntentHandler,
        TotalPointIntentHandler,
        SwitchChildIntentHandler,
        RewardIntentHandler,
        ListTasksIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addErrorHandlers(
        ErrorHandler)
    .lambda();
