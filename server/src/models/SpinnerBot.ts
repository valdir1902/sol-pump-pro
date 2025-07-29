import mongoose, { Document, Schema } from 'mongoose';

export interface ISpinnerBot extends Document {
  _id: string;
  userId: string;
  isActive: boolean;
  targetToken?: string;
  investmentAmount: number;
  stopLoss: number;
  takeProfit: number;
  slippage: number;
  maxTrades: number;
  currentTrades: number;
  totalProfit: number;
  totalLoss: number;
  lastTradeAt?: Date;
  configuration: {
    autoReinvest: boolean;
    riskLevel: 'low' | 'medium' | 'high';
    minLiquidity: number;
    maxPositionSize: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SpinnerBotSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  targetToken: {
    type: String,
  },
  investmentAmount: {
    type: Number,
    required: true,
    min: 0.01,
  },
  stopLoss: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  takeProfit: {
    type: Number,
    required: true,
    min: 0,
  },
  slippage: {
    type: Number,
    default: 5,
    min: 0.1,
    max: 50,
  },
  maxTrades: {
    type: Number,
    default: 10,
    min: 1,
  },
  currentTrades: {
    type: Number,
    default: 0,
  },
  totalProfit: {
    type: Number,
    default: 0,
  },
  totalLoss: {
    type: Number,
    default: 0,
  },
  lastTradeAt: Date,
  configuration: {
    autoReinvest: {
      type: Boolean,
      default: false,
    },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    minLiquidity: {
      type: Number,
      default: 1000,
    },
    maxPositionSize: {
      type: Number,
      default: 10,
    },
  },
}, {
  timestamps: true,
});

export const SpinnerBot = mongoose.model<ISpinnerBot>('SpinnerBot', SpinnerBotSchema);