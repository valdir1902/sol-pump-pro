import mongoose, { Document, Schema } from 'mongoose';

export interface IPumpFunToken extends Document {
  _id: string;
  mint: string;
  name: string;
  symbol: string;
  description?: string;
  image?: string;
  website?: string;
  telegram?: string;
  twitter?: string;
  marketCap: number;
  price: number;
  liquidity: number;
  volume24h: number;
  holders: number;
  isLaunched: boolean;
  launchedAt?: Date;
  creator: string;
  metadata: any;
  lastUpdated: Date;
  createdAt: Date;
}

const PumpFunTokenSchema: Schema = new Schema({
  mint: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  description: String,
  image: String,
  website: String,
  telegram: String,
  twitter: String,
  marketCap: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    default: 0,
  },
  liquidity: {
    type: Number,
    default: 0,
  },
  volume24h: {
    type: Number,
    default: 0,
  },
  holders: {
    type: Number,
    default: 0,
  },
  isLaunched: {
    type: Boolean,
    default: false,
  },
  launchedAt: Date,
  creator: {
    type: String,
    required: true,
  },
  metadata: Schema.Types.Mixed,
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Índices para performance
PumpFunTokenSchema.index({ mint: 1 });
PumpFunTokenSchema.index({ isLaunched: 1 });
PumpFunTokenSchema.index({ marketCap: -1 });
PumpFunTokenSchema.index({ createdAt: -1 });

export const PumpFunToken = mongoose.model<IPumpFunToken>('PumpFunToken', PumpFunTokenSchema);