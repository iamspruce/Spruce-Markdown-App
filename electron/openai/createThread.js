const { OpenAI } = require("openai");
const Store = require("electron-store");

const store = new Store();

exports.createThread = async (apiKey, win) => {
  const openai = new OpenAI({ apiKey });

  const threads = loadThreads();

  const isThread = threads.find((thread) => thread.filePath == win.filePath);

  if (isThread) {
    return isThread.threadId;
  }

  /* Todo: check if thread still exists on openai, i.e the user did not delete the thread */

  const thread = await openai.beta.threads.create();
  let filePath = win.filePath,
    threadId = thread.id;
  threads.push({ filePath, threadId });
  saveThreads(threads);

  return thread.id;
};

function saveThreads(threads) {
  store.set("threads", threads);
}

function loadThreads() {
  return store.get("threads", []);
}
