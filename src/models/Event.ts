import { Schema, model, Types, Document } from "mongoose";

export interface IEvent extends Document {
    title: string;
    description?: string;
    date: Date;
    location?: string;
    interests: Types.ObjectId[];
};


const EventSchema = new Schema<IEvent>({
    title: { type: String, required: true },
    description: String,
    date: { type: Date, required: true },
    location: String,
    interests: [{ type: Schema.Types.ObjectId, ref: 'Interest' }]
});

export const EventModel = model<IEvent>('Event', EventSchema);