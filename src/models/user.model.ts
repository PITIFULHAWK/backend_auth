import { Schema, model, Document } from "mongoose";
import * as bcrypt from "bcryptjs";

export interface IUser extends Document {
    fullname: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword: (password: string) => Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
    {
        fullname: {
            type: String,
            required: [true, "Full name is required"],
            trim: true,
            minlength: [3, "Full name must be at least 3 characters"],
            maxlength: [100, "Full name must be at most 100 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            unique: true,
            lowercase: true,
            match: [
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                "Please enter a valid email address",
            ],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            trim: true,
            minlength: [6, "Password must be at least 6 characters"],
            maxlength: [100, "Password must be at most 100 characters"],
        },
    },
    { timestamps: true }
);

UserSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.comparePassword = async function (currentPassword: string) {
    return await bcrypt.compare(currentPassword, this.password);
};

export const User = model<IUser>("User", UserSchema);
