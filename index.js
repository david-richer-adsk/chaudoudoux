// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');

function bootstrap(handlerInput) {
    const sessionAttributes = {};

    Object.assign(sessionAttributes, {
      child: "Paul",
      points: {
          "David": 0,
          "Celeste": 0
      },
      tasks:{ 
        "David": [
            "Make your bed",
            "Clean your room",
            "Take out the trash"
        ],
        "Celeste": [
            "Clean the dishes",
            "Do your homework",
            "Feed the dog"
        ]
    });

    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        bootstrap(handlerInput)

        const speechText = 'Chaudoudoux is up and running!';

        return handlerInput.responseBuilder
            .speak(speechText)
            .shouldEndSession(false)
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
        
        const speechText = 'One chaudoudoux added for ' + child + '. Good Job ' + child + '!!!' ;
        return handlerInput.responseBuilder
            .speak(speechText)
            .shouldEndSession(false)
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
            .shouldEndSession(false)
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
        const child = sessionAttributes.child
        const tasks = sessionAttributes.tasks[child]
        return handlerInput.responseBuilder
            .speak(tasks)
            .shouldEndSession(false)
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
        const speechText = child + ' has ' + sessionAttributes.points[child] + ' chaudoudoux';
        return handlerInput.responseBuilder
            .speak(speechText)
            .shouldEndSession(false)
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
        ListTasksIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addErrorHandlers(
        ErrorHandler)
    .lambda();
