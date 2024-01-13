const { OpenAI } = require("openai");

exports.createMessage = async (apiKey, threadId, content) => {
  const openai = new OpenAI({ apiKey });

  const message = await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: `${content}`,
  });

  return message.id;
};
