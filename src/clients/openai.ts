import { OpenAI } from 'openai';

import { OPENAI_API_KEY } from '../utils/parameters';


const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

export async function askOpenAI(message: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {role: "system", content: "You are a JSON-only data extractor. Never include explanations or text outside JSON."},
        {role: "user", content: message},
      ]
    });

    return String(response.choices[0].message.content);
  } catch (error) {
    console.log(`OpenAI Error: ${error}`);
    throw new Error('Error al obtener respuesta de OpenAI');
  }
}
