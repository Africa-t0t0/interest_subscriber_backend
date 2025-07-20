import { EventModel } from "../models/Event";
import { InterestModel, IInterest } from "../models/Interest";
import { handleChat } from "../handlers/chatHandler";
import { getAll } from "../clients/mongo";
import mongoose, { Types } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

function extractJSONFromResponse(response: any): any {
    const raw = response.choices[0].message.content;

    const start = raw.indexOf("[");
    const end = raw.indexOf("]") + 1;
    const jsonString = raw.slice(start, end);

    const events = JSON.parse(jsonString);

    return events;
};

export async function createEventsForInterests () {

    const interests = await getAll(InterestModel).then((interests) => interests);
    // fix this

    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear();

    const prompt = `
You are a JSON-only API.

Instructions:
- Respond ONLY with a valid **raw JSON array**.
- DO NOT wrap the output in triple backticks
- DO NOT include any Markdown formatting.
- DO NOT include any explanations, comments, or extra text.
- Return a raw, valid JSON array ready to be parsed directly by code.
- Dates must be in ISO 8601 format.

Given the following list of interests: ${interests}, return the most recent ONGOING or UPCOMING events for each interest.

Each event must:
- Match this structure:
{
  title: string,
  description?: string,
  creationDate: Date,
  startDateRange: Date,
  endDateRange: Date,
  location?: string,
  tags?: string[],
  status: "pending" | "active" | "completed" | "cancelled" | "upcoming",
  interests: string[]
}
- Be scheduled for the current month (${currentMonth} ${currentYear}) or the next one.
- Be ongoing (current date is between startDateRange and endDateRange) or upcoming (startDateRange is in the future).
- Return at least 5 events per interest, if available.
- Use real and current event data from the internet.

Output: a single raw JSON array, and nothing else.

    `;

    try {
        const response = await handleChat(prompt, "openai");
        console.log("response", response);
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
        console.log("error:", error);
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