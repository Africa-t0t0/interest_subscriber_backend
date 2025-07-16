import { handleChat } from "../handlers/chatHandler";
import { InterestModel } from "../models/Interest";

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


export async function createBaseInterests() {
    const basicInterest = ["Formula 1", "Tennis", "UFC", "Football", "Basketball", "Volleyball", "Hockey"];

    const prompt = `
        I have this Mongoose model in TypeScript:


        export interface IInterest extends Document {
            name: string;
            description: string;
            icon: string;
        }

        const InterestSchema = new Schema<IInterest>({
            name: {
                type: String,
                required: true,
                unique: true,
            },
            description: String,
            icon: String,
        });
        Given the following list of interests: ${basicInterest}

    Please return a JSON array containing one object per interest suitable for database insertion. Each object should include the required fields defined in the model (name, description, icon). The icon should be the most suitable emoji that represents the corresponding interest.

    Provide the JSON output only, no additional explanations.
    `

    try {
        const response = await handleChat(prompt, "openai");
        const interests = JSON.parse(response);

        await InterestModel.insertMany(interests);

    } catch (error) {
        console.log(error);
    }
}


async function main() {
    try {
        // FIXME: fix this, don't use process.env.DB_PROCESS_URI
        const dbProcessUri = String(process.env.DB_PROCESS_URI)
        await mongoose.connect(dbProcessUri);

        await createBaseInterests();

        await mongoose.disconnect();

        console.log("✅ DB seed completed successfully")
    } catch (error) {
        console.error("❌ Error in DB seed:", error);
        await mongoose.disconnect();
    }
}

main();