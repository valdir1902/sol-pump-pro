import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  _id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'trade' | 'fee';
  amount: number;
  token?: string;
  signature: string;
  status: 'pending' | 'confirmed' | 'failed';
  feeAmount?: number;
  fromAddress?: string;
  toAddress?: string;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'trade', 'fee'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  token: {
    type: String,
    default: 'SOL',
  },
  signature: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'failed'],
    default: 'pending',
  },
  feeAmount: {
    type: Number,
    default: 0,
  },
  fromAddress: String,
  toAddress: String,
  metadata: Schema.Types.Mixed,
}, {
  timestamps: true,
});

export const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);