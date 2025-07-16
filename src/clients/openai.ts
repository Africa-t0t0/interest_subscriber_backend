import { OpenAI } from 'openai';

import { OPENAI_API_KEY } from '../utils/parameters';


const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

export async function askOpenAI(message: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content: message}]
    });

    return String(response.choices[0].message.content);
  } catch (error) {
    console.log(`OpenAI Error: ${error}`);
    throw new Error('Error al obtener respuesta de OpenAI');
  }
}
