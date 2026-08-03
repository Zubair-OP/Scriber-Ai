import mongoose, { Document } from "mongoose";
import { IUser } from "@/types/user.types";
import bcrypt from "bcrypt";

interface NewDocument extends Omit<IUser, '_id'>, Document {
    ComparePassword(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<NewDocument>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false,
    },
    Mobile: {
        type: String,
        minlength: 10,
        maxlength: 10,
    },
    passwordResetTokenHash: {
        type: String,
        select: false,
    },
    passwordResetExpiresAt: {
        type: Date,
        select: false,
    },
    stripeCustomerId: {
        type: String,
        index: true,
    },
    stripeSubscriptionId: {
        type: String,
        index: true,
    },
    subscriptionStatus: {
        type: String,
        enum: ["free", "active", "past_due", "canceled"],
        default: "free",
    },
    plan: {
        type: String,
        enum: ["free", "pro", "enterprise"],
        default: "free",
    },
    currentPeriodEnd: {
        type: Date,
    },
}, {
    timestamps: true,
});

userSchema.pre('save', async function (): Promise<void> {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.ComparePassword = function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

const UserModel = (mongoose.models.User as mongoose.Model<NewDocument>) || mongoose.model<NewDocument>('User', userSchema);
export default UserModel;