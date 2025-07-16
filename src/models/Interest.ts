import {Schema, model, Document} from "mongoose";


export interface IInterest extends Document {
    name: string;
}

const InterestSchema = new Schema<IInterest>({
    name: {
        type: String,
        required: true,
        unique: true,
    }
});

export const InterestModel = model<IInterest>("Interest", InterestSchema);
