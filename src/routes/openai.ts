import { handleChat } from '../handlers/chatHandler';

const express = require('express');
const router = express.Router();

const ENGINE = 'openai';

router.get('/', (req: any, res: any) => {
    res.send('API is running!');
});

router.get('/dummy', async (_: any, response: any) => {
    const prompt = 'testing this api key, if it works, then respond with a json object {message: "success"}';

    try {
        const modelResponse = await handleChat(prompt, ENGINE);
        response.json({ message: modelResponse });
    } catch (error) {
        console.error(`Error using API: ${error}`);
        response.status(500).json({ error: 'Failed to generate response' });
    }
});

router.post('/ask-openai', async (request: any, response: any) => {
    const { prompt, engine = ENGINE } = request.body;

    if (!prompt) {
        return response.status(400).json({ error: 'Prompt is required' });
    }

    try {
        const modelResponse = await handleChat(prompt, engine);
        response.json({ message: modelResponse });
    } catch (error) {
        console.error(`Error using API: ${error}`);
        response.status(500).json({ error: 'Failed to generate response' });
    }
});

module.exports = router;
