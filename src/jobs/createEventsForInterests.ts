import { EventModel } from "../models/Event";
import { InterestModel, IInterest } from "../models/Interest";
import { handleChat } from "../handlers/chatHandler";
import { getAll } from "../clients/mongo";
import mongoose, { Types } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function createEventsForInterests () {

    const interests = await getAll(InterestModel).then((interests) => interests);
    // fix this

    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear();

    const prompt = `
    Given the following list of interests: ${interests}

Return a JSON array containing only the most recent ONGOING or UPCOMING event for each interest. Each event must:

- Match the following structure:
{
    title: string;
    description?: string;
    creationDate: Date;
    startDateRange: Date;
    endDateRange: Date;
    location?: string;
    tags?: string[];
    status: "pending" | "active" | "completed" | "cancelled";
    interests: string[];
}

- Be scheduled for the current month (${currentMonth}) of ${currentYear} or the upcoming month.
- Be ONGOING (today is between startDateRange and endDateRange) or UPCOMING (startDateRange is in the future).
- Be the most recent valid event per interest.
- USE INTERNET TO SEARCH
- Return at least 5 events per category
- Return events that are relevant to the current date and time

Return only the final JSON array. No explanations or additional text.

    `

    try {
        const response = await handleChat(prompt, "openai");
        const eventsWithStrings = JSON.parse(response);

        if (!interests) {
            throw new Error('No interests found in database');
        }

        // Convert interest names to ObjectIds
        const events = eventsWithStrings.map((event: any) => {
            const interestNames = event.interests as string[];
            const interestObjectIds = interestNames.map(name => {
                const interest = interests.find((i: IInterest) => i.name === name);
                return interest?._id;
            }).filter((id): id is Types.ObjectId => id !== undefined);
            
            return { ...event, interests: interestObjectIds };
        });

        await EventModel.insertMany(events);

    } catch (error) {
        console.error('Error creating events:', error);
        throw error;
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