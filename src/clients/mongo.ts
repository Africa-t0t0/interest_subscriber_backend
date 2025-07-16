import mongoose from "mongoose";

import { DB_PROCESS_URI } from "../utils/parameters";

let isConnected = false;

export async function connectToMongo() {
    if (isConnected) return;

    try {
        await mongoose.connect(DB_PROCESS_URI);
        isConnected = true;
    } catch (error) {
        console.log(error);
        throw error;
    }

};

export async function getAll<T>(Model: mongoose.Model<T>) {
    await connectToMongo();

    try {
        const result = await Model.find();
        return result;
    } catch (error) {
        console.log(error);
    }
};

export async function getById<T>(Model: mongoose.Model<T>, id: string) {
    await connectToMongo();

    try {
        const result = await Model.findById(id);
        return result;
    } catch (error) {
        console.log(error);
    }
};
