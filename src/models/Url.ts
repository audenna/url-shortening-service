import mongoose, { Schema, Document } from 'mongoose';

export interface IUrl extends Document {
    originalUrl: string;
    shortUrl: string;
    alias?: string;
    clicks: number;
    expiresAt?: Date;
}

const UrlSchema = new Schema<IUrl>({
    originalUrl: { type: String, required: true },
    shortUrl: { type: String, required: true, unique: true },
    alias: { type: String, unique: true, sparse: true },
    clicks: { type: Number, default: 0 },
    expiresAt: { type: Date, default: null },
});

export default mongoose.model<IUrl>('Url', UrlSchema);
