import { InterestModel } from "../models/Interest";
import { getById, getAll } from "../clients/mongo";

const express = require('express');
const router = express.Router();

router.get("/", (req: any, res: any) => {
    res.send('API is running!');
});

router.get("/interests", async (_: any, response: any) => {
    try {
        const interests = await getAll(InterestModel);
        response.json(interests);
    } catch (error) {
        console.error(`Error fetching interests: ${error}`);
        response.status(500).json({ error: 'Failed to fetch interests' });
    }
});

router.get("/interests/:id", async (request: any, response: any) => {
    try {
        const { id } = request.params;
        const interest = await getById(InterestModel, id);
        response.json(interest);
    } catch (error) {
        console.error(`Error fetching interest: ${error}`);
        response.status(500).json({ error: 'Failed to fetch interest' });
    }
});

module.exports = router;
