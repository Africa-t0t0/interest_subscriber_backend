import { OpenAI } from 'openai';

import { DEEPSEEK_API_KEY } from '../utils/parameters';

const deepseek = new OpenAI({
    apiKey: DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com"
});

export async function askDeepSeek(message: string): Promise<string> {
    try {
        const response = await deepseek.chat.completions.create({
            model: "deepseek-chat",
            messages: [{role: "user", content: message}],
        });

        return String(response.choices[0].message.content);
    } catch (error) {
        console.log(`DeepSeek Error: ${error}`);
        throw new Error('Error al obtener respuesta de DeepSeek');
    }
}