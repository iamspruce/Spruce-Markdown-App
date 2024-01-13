const Store = require("electron-store");
const { createAssistant } = require("./createAssistant");
const { safeStorage } = require("electron");
const { createThread } = require("./createThread");
const { createMessage } = require("./createMessage");
const { runThread } = require("./runThread");
const { EnterApiKey } = require("../utils/EnterAPIkey");
const { checkAssistant } = require("./checkAssistant");

const store = new Store();

let assistantId;
let response;
exports.OpenAIRequest = async (win, content) => {
  assistantId = store.get("openaiAssistantId");

  let getAPiKey = store.get("openai_key");

  if (getAPiKey == undefined) {
    await EnterApiKey(win);
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
