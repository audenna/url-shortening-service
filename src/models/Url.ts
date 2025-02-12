import mongoose, { Schema, Document } from 'mongoose';

export interface IUrl extends Document {
    originalUrl: string;
    shortUrl: string;
    alias?: string;
    clicks: number;
    expiresAt?: Date;
    createdAt: Date;
}

const UrlSchema = new Schema<IUrl>({
    originalUrl: { type: String, required: true },
    shortUrl: { type: String, required: true, unique: true },
    alias: { type: String, unique: true, sparse: true },
    clicks: { type: Number, default: 0 },
    expiresAt: { type: Date, default: null },
    createdAt: { type: Date, default: new Date() },
});

export const UrlModel = mongoose.model<IUrl>("Url", UrlSchema);
