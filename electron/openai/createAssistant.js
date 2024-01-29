const { OpenAI } = require("openai");
const Store = require("electron-store");

exports.createAssistant = async (apiKey) => {
  const store = new Store();

  const openai = new OpenAI({ apiKey: apiKey });

  let model = "gpt-3.5-turbo-0613";
  let getModel = store.get("openai_key").model;
  if (getModel !== undefined || getModel !== "") {
    model = getModel;
  }

  const assistantConfig = {
    name: "SpruceMarkdownAssistant",
    description:
      "Your helpful assistant for enhancing Markdown content with Spruce Markdown App. Get assistance in formatting, organizing, and improving your Markdown documents.",
    model: model,
    instructions:
      "You are a Markdown enhancement assistant, designed to assist users in improving and formatting their Markdown documents. Analyze the provided Markdown content and offer suggestions for better formatting, organization, and overall improvement. Respond to user prompts related to Markdown structure, syntax, and content enhancement. Provide helpful insights and guidance to make the Markdown writing experience more efficient and effective.",
  };

  const createdAssistant = await openai.beta.assistants.create(assistantConfig);

  store.set("openaiAssistantId", createdAssistant.id);

  return createdAssistant;
};
