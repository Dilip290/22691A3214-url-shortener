import mongoose, { Schema, Document } from 'mongoose';

export interface IClick {
  timestamp: Date;
  referrer?: string;
  location?: string;
  userAgent?: string;
}

export interface IUrl extends Document {
  originalUrl: string;
  shortcode: string;
  createdAt: Date;
  expiresAt: Date;
  clicks: IClick[];
  isActive: boolean;
}

const clickSchema = new Schema<IClick>({
  timestamp: { type: Date, required: true, default: Date.now },
  referrer: { type: String, default: null },
  location: { type: String, default: null },
  userAgent: { type: String, default: null }
});

const urlSchema = new Schema<IUrl>({
  originalUrl: { type: String, required: true },
  shortcode: { type: String, required: true, unique: true },
  createdAt: { type: Date, required: true, default: Date.now },
  expiresAt: { type: Date, required: true },
  clicks: [clickSchema],
  isActive: { type: Boolean, default: true }
});

urlSchema.index({ shortcode: 1 });
urlSchema.index({ expiresAt: 1 });

export const UrlModel = mongoose.model<IUrl>('Url', urlSchema);
