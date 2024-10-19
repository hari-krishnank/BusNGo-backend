import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WalletTransaction } from '../schemas/walletTransaction.schema';

@Injectable()
export class WalletTransactionService {
    constructor(
        @InjectModel(WalletTransaction.name) private walletTransactionModel: Model<WalletTransaction>
    ) { }

    async addTransaction(userId: string, amount: number, type: 'credit' | 'debit', description: string): Promise<WalletTransaction> {
        const newTransaction = new this.walletTransactionModel({
            userId,
            amount,
            type,
            description,
            status: 'completed'
        });

        return newTransaction.save();
    }

    async getTransactions(userId: string): Promise<WalletTransaction[]> {
        return this.walletTransactionModel.find({ userId }).sort({ createdAt: -1 }).exec();
    }
}