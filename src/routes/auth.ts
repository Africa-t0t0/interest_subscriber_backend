import jwt from "jsonwebtoken";
import { hashPassword, verifyPassword } from "../utils/authUtils";
import { UserModel } from "../models/User";
import { create, getByField } from "../clients/mongo";

const express = require("express");
const router = express.Router();


router.post("/register", async (request: any, response: any) => {
    const { email, password } = request.body;

    if (!email || !password) {
        return response.status(400).json({ error: "Email and password are required" });
    }

    try {
        const user = await getByField(UserModel, "email", email);
        if (user) {
            return response.status(401).json({ error: "User already exists" });
        }

        const { name, birthDate } = request.body;

        const hashedPassword = hashPassword(password);
        const newUser = await create(UserModel, { email, password: hashedPassword, name, birthDate, interests: [] });
        if (!newUser) {
            return response.status(500).json({ error: "User creation failed" });
          }

        const token = jwt.sign({ email: newUser.email }, "secret", { expiresIn: "1d" });
        response.json({ token });
    } catch (error) {
        console.error(`Error registering user: ${error}`);
        response.status(500).json({ error: "Failed to register user" });
    };
})


router.post("/login", async (request: any, response: any) => {
    const { email, password } = request.body;

    if (!email || !password) {
        return response.status(400).json({ error: "Email and password are required" });
    }

    try {
        const user = await getByField(UserModel, "email", email);
        if (!user) {
            return response.status(401).json({ error: "Invalid email or password" });
        }

        const isPasswordValid = verifyPassword(password, user.password);
        if (!isPasswordValid) {
            return response.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign({ email: user.email }, "secret", { expiresIn: "1d" });
        response.json({ token });
    } catch (error) {
        console.error(`Error logging in: ${error}`);
        response.status(500).json({ error: "Failed to log in" });
    };
});

module.exports = router;