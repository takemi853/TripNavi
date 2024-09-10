import mongoose, { Schema, Document } from 'mongoose';

interface Log extends Document {
    request: {
        lat?: number;
        lon?: number;
        location?: string;
    };
    response: {
        success: boolean;
        data?: string;
        message?: string;
    };
    timestamp: Date;
}

const logSchema = new Schema({
    request: {
        lat: { type: Number },
        lon: { type: Number },
        location: { type: String }
    },
    response: {
        success: { type: Boolean, required: true },
        data: { type: String },
        message: { type: String }
    },
    timestamp: { type: Date, default: Date.now }
});

export const LogModel = mongoose.models.Log || mongoose.model<Log>('Log', logSchema);
