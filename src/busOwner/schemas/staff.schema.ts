import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Bus } from "./bus.schema";

export type StaffsDocument = Staffs & Document;

@Schema({ timestamps: true })
export class Staffs {
    @Prop({ required: true })
    username: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    password: string;
    
    @Prop({ required: true })
    mobile: string;

    @Prop({ type: Types.ObjectId, ref: 'Bus', required: true })
    bus: Bus;

    @Prop({ type: Types.ObjectId, ref: 'verifiedOwner', required: true })
    ownerId: Types.ObjectId;
}

export const StaffsSchema = SchemaFactory.createForClass(Staffs)