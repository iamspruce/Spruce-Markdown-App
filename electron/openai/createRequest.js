const Store = require("electron-store");
const { createAssistant } = require("./createAssistant");
const { safeStorage } = require("electron");
const { createThread } = require("./createThread");
const { createMessage } = require("./createMessage");
const { runThread } = require("./runThread");
const { checkAssistant } = require("./checkAssistant");
const { actionRequired } = require("../utils/modals/actionRequired");
const { prompt } = require("../utils/modals/promptModal");
const { showWarning } = require("../utils/notificationHandler");

const store = new Store();

let assistantId;
let response;
exports.OpenAIRequest = async (win, content) => {
  assistantId = store.get("openaiAssistantId");

  let getAPiKey = store.get("openai_key");

  if (getAPiKey == undefined) {
    const response = await actionRequired(
      win,
      "Enter Your OpenAI API Key",
      "Enter Your OpenAI API Key",
      "Your API key is stored locally and never sent anywhere else",
      "Enter your Api Key"
    );
    if (response == 0) {
      await prompt(
        win,
        "Enter Your OpenAI API Key",
        "apikey",
        "You must provide an OpenAi API key to use this feature"
      );
      /* check if api key is still undefined */
      if (getAPiKey == undefined) {
        showWarning(
          win,
          "API key Required",
          "An OpenAI API key is requires to use this feature"
        );
        return null;
      }
    } else {
      showWarning(
        win,
        "API key Required",
        "An OpenAI API key is requires to use this feature"
      );
      return null;
    }
  }
  const buffer = Buffer.from(store.get("openai_key").key, "base64");
  let apiKey = safeStorage.decryptString(buffer);

  if (!assistantId) {
    assistantId = await createAssistant(apiKey).id;
  }

  if (assistantId) {
    assistantId = await checkAssistant(apiKey, assistantId);
  }

  const threadId = await createThread(apiKey, win);

  if (threadId) {
    let message = await createMessage(apiKey, threadId, content);

    if (message) {
      response = await runThread(apiKey, threadId, assistantId);
    }
  }

  return response;
};
