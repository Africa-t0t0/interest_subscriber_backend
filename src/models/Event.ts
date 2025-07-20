import { Schema, model, Types, Document } from "mongoose";

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

export const EventModel = model<IEvent>('Event', EventSchema);