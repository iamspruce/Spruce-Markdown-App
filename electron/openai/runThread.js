const { OpenAI } = require("openai");
const Store = require("electron-store");

const store = new Store();

async function checkRunStatus(apiKey, threadId, runId) {
  const openai = new OpenAI({ apiKey });
  const run = await openai.beta.threads.runs.retrieve(threadId, runId);

  return run;
}

async function displayAssistantResponse(apiKey, threadId) {
  const openai = new OpenAI({ apiKey });
  const messages = await openai.beta.threads.messages.list(threadId);

  // Check if there are any messages and return the response text
  if (messages.data.length > 0) {
    return messages.data[0].content[0].text.value;
  }

  // Return null or another default value if there are no messages yet
  return null;
}

exports.runThread = async (apiKey, threadId, assistantId) => {
  const openai = new OpenAI({ apiKey });
  let model = "gpt-3.5-turbo-0613";
  let getModel = store.get("openai_model");
  if (getModel !== undefined || getModel !== "") {
    model = getModel;
  }
  let run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
    model: model,
  });

  // Periodically check the run status
  const assistantResponse = await checkRunStatusAndGetResponse(
    apiKey,
    threadId,
    run.id
  );

  return assistantResponse;
};

async function checkRunStatusAndGetResponse(
  apiKey,
  threadId,
  runId,
  checkIntervalMs = 2000
) {
  let assistantResponse = null;

  const intervalId = setInterval(async () => {
    try {
      const run = await checkRunStatus(apiKey, threadId, runId);

      if (run.status === "completed") {
        clearInterval(intervalId);
        assistantResponse = await displayAssistantResponse(apiKey, threadId);
      } else if (run.status == "failed") {
        clearInterval(intervalId);
        throw new Error(
          `Run failed at: ${run.failed_at}, Reason: ${run.last_error}`
        );
      } else {
        console.log("Run still in progress, status:", run.status);
      }
    } catch (error) {
      console.error("Error checking run status or retrieving response:", error);
      // Implement error handling or retry logic if needed
    }
  }, checkIntervalMs);

  // Wait for completion or potential errors
  while (!assistantResponse) {
    await new Promise((resolve) => setTimeout(resolve, checkIntervalMs));
  }

  return assistantResponse;
}
