import mongoose, {Schema, model, Types, Document} from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    birthDate: Date;
    interests: Types.ObjectId[];
}

const UserSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    birthDate: {
        type: Date,
        required: true,
    },
    interests: [{type: Schema.Types.ObjectId, ref: "Interest"}]
})

export const UserModel = mongoose.model<IUser>("User", UserSchema);
