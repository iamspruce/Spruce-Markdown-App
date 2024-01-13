const { OpenAI } = require("openai");
const { createAssistant } = require("./createAssistant");

exports.checkAssistant = async (apiKey, assistantId) => {
  let newAssistant;
  const openai = new OpenAI({ apiKey: apiKey });

  try {
    let myAssistant = await openai.beta.assistants.retrieve(assistantId);
    newAssistant = myAssistant.id;
  } catch (error) {
    newAssistant = (await createAssistant(apiKey)).id;
  }

  return newAssistant;
};
