import { EventModel } from "../models/Event";
import { getById, getAll } from "../clients/mongo";

const express = require('express');
const router = express.Router();

router.get("/", (req: any, res: any) => {
    res.send('API is running!');
});

router.get("/events", async (_: any, response: any) => {
    try {
        const events = await getAll(EventModel);
        response.json(events);
    } catch (error) {
        console.error(`Error fetching events: ${error}`);
        response.status(500).json({ error: 'Failed to fetch events' });
    }
});

module.exports = router;