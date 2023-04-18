import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const article = req.body.article || '';
  if (article.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid URL",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(article),
      temperature: 0.6,
      max_tokens:3897
    });
    res.status(200).json({ result: completion.data.choices[0].text });
    // res.status(200).json({ result: completion.data });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(article) {
  return `summarize the article in detail and chinese and numbers like below ${article}  

  0. Title of the article //
  1. Description about the point
  2. Description about the point
  3.
  4.
  5.
  6.
  7.
  8.
`;
}
