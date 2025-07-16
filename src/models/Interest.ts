import {Schema, model, Document} from "mongoose";


export interface IInterest extends Document {
    name: string;
    description: string;
    icon: string;
};

const InterestSchema = new Schema<IInterest>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: String,
    icon: String,
});

export const InterestModel = model<IInterest>("Interest", InterestSchema);
