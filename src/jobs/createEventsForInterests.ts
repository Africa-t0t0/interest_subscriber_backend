import { EventModel } from "../models/Event";
import { InterestModel } from "../models/Interest";
import { handleChat } from "../handlers/chatHandler";
import { getAll } from "../clients/mongo";

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function createEventsForInterests () {

    const interests = await getAll(InterestModel);

    const prompt = `I have this Mongoose model in TypeScript:
        export interface IEvent extends Document {
    title: string;
    description?: string;
    creationDate: Date;
    startDateRange: Date;
    endDateRange: Date;
    location?: string;
    tags?: string[];
    status?: "pending" | "active" | "completed" | "cancelled";
    interests: Types.ObjectId[];
};


const EventSchema = new Schema<IEvent>({
    title: { type: String, required: true },
    description: String,
    creationDate: { type: Date, default: Date.now },
    startDateRange: { type: Date, required: true },
    endDateRange: { type: Date, required: true},
    location: String,
    tags: [String],
    status: { type: String, enum: ["pending", "active", "completed", "cancelled"], default: "pending" },
    interests: [{ type: Schema.Types.ObjectId, ref: 'Interest' }]
});


    Given the following list of interets: ${interests}

    Please return an array of JSON objects containing the ONGOING and UPCOMING events, formatted to match the model I provided. Return only the JSON response, no additional explanations.
    `

    try {
        const response = await handleChat(prompt, "openai");
        const events = JSON.parse(response);

        await EventModel.insertMany(events);

    } catch (error) {
        console.log(error);
    }
};

async function main () {
    try {
        const dbProcessUri = String(process.env.DB_PROCESS_URI)
        await mongoose.connect(dbProcessUri);

        await createEventsForInterests();

        await mongoose.disconnect();

        console.log("✅ DB seed completed successfully")
    } catch (error) {
        console.error("❌ Error in DB seed:", error);
        await mongoose.disconnect();
    }
}

main();