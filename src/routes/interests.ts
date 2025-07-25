import { InterestModel } from "../models/Interest";
import { getById, getAll, getByField } from "../clients/mongo";
import { authMiddleware } from "../utils/authUtils";
import { UserModel } from "../models/User";
import { Types } from "mongoose";
import { getInteresectionOfArrays } from "../utils/utils";

const express = require('express');
const router = express.Router();

router.get("/", (req: any, res: any) => {
    res.send('API is running!');
});

router.get("/interests", authMiddleware, async (request: any, response: any) => {
    console.log("request", request.user);
    try {
        const interests = await getAll(InterestModel);
        response.json(interests);
    } catch (error) {
        console.error(`Error fetching interests: ${error}`);
        response.status(500).json({ error: 'Failed to fetch interests' });
    }
});

router.get("/interests/:id", authMiddleware, async (request: any, response: any) => {
    try {
        const { id } = request.params;
        const interest = await getById(InterestModel, id);
        response.json(interest);
    } catch (error) {
        console.error(`Error fetching interest: ${error}`);
        response.status(500).json({ error: 'Failed to fetch interest' });
    }
});

router.get("/user-interests", authMiddleware, async (request: any, response: any) => {
    // Get the interests of the user based on the email
    try {
        const { email } = request.user;
        const user = await getByField(UserModel, "email", email);
        let interests = user?.interests;
        if (!interests) {
            interests = [];
        }
        const realInterests = await Promise.all(interests.map((interestId: Types.ObjectId) => {
            return getById(InterestModel, interestId.toString());
        }));
        response.json(realInterests.filter((interest) => interest !== null));
    } catch (error) {
        console.error(`Error fetching interest: ${error}`);
        response.status(500).json({ error: 'Failed to fetch interest' });
    }
});

router.post("/user-interests", authMiddleware, async (request: any, response: any) => {
    // receives the user posted interests and add them to the user
    try {
        const { email } = request.user;
        const user = await getByField(UserModel, "email", email);
        if (!user) {
            return response.status(401).json({ error: "User not found" });
        }

        // get the user by email and then set the received interests to the user
        const { interests } = request.body;
        user.interests = interests;

        let newInterests = await Promise.all(interests.map((interestId: Types.ObjectId) => {
            return getById(InterestModel, interestId.toString());
        }));

        await user.save();
        response.json(newInterests);
    } catch (error) {
        console.error(`Error fetching interest: ${error}`);
        response.status(500).json({ error: 'Failed to fetch interest' });
    }
});

router.patch("/user-interests", authMiddleware, async (request: any, response: any) => {
    try {
        const { email } = request.user;
        const user = await getByField(UserModel, "email", email);
        if (!user) {
            return response.status(401).json({ error: "User not found" });
        }

        const { interests } = request.body;
        // now instead of replacing the interests, we update the current user interests
        const currentInterests = user.interests;

        if (!currentInterests) {
            return response.status(401).json({ error: "User not found" });
        }

        const updatedInterests = getInteresectionOfArrays(currentInterests, interests);
        user.interests = updatedInterests;
        await user.save();
        let newInterests = await Promise.all(interests.map((interestId: Types.ObjectId) => {
            return getById(InterestModel, interestId.toString());
        }));
        if (newInterests.length === 0) {
            newInterests = [];
        }

        response.json(newInterests);
    } catch (error) {
        console.error(`Error fetching interest: ${error}`);
        response.status(500).json({ error: 'Failed to fetch interest' });
    };
});

module.exports = router;
