import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY, // Make sure the API key is loaded properly
  });
  
  const openai = new OpenAIApi(configuration);
  
  export const getFinancialAdvice = async (messages) => {
    try {
      const response = await openai.createChatCompletion({
        model: "gpt-4", // Use the correct model
        messages: messages,
        max_tokens: 200,
        temperature: 0.7,
      });
  
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error("Error getting financial advice:", error.response ? error.response.data : error.message);
      throw new Error("Unable to fetch financial advice.");
    }
  };
  