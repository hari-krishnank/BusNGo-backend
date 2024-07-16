import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IUser } from "../interfaces/user.interface";
import * as bcrypt from 'bcrypt';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document implements IUser {

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

    @Prop({ default: false })
    is_blocked: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

const isHashed = (password: string): boolean => password.startsWith('$2b$');

UserSchema.pre<User>('save', async function (next: Function) {
    if (this.isModified('password') && !isHashed(this.password)) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});