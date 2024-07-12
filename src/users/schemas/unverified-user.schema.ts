import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as bcrypt from 'bcrypt';
import { Document } from 'mongoose';
import { IUnverifiedUser } from "../interfaces/unverifieduser.interface";

@Schema({ timestamps: true })
export class UnVerifiedUser extends Document implements IUnverifiedUser {
    @Prop()
    username: string;

    @Prop()
    email: string;

    @Prop()
    phone: string;

    @Prop()
    password: string;

    @Prop({ default: false })
    is_verified: boolean;
}

export const UnVerifiedUserSchema = SchemaFactory.createForClass(UnVerifiedUser);

UnVerifiedUserSchema.pre<UnVerifiedUser>('save', async function (next: Function) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});