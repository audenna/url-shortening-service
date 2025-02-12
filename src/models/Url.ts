import mongoose, { Schema, Document } from 'mongoose';

export interface IUrl extends Document {
    originalUrl: string;
    shortUrl: string;
    createdAt: Date;
}

const UrlSchema = new Schema<IUrl>({
    originalUrl: { type: String, required: true },
    shortUrl: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: new Date() },
});

export const UrlModel = mongoose.model<IUrl>("Url", UrlSchema);
