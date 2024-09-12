export interface IUser {
    username: string;
    lastName?: string;
    email: string;
    phone?: string;
    password?: string;
    profileImage?: string;
    dob?: Date;
    gender?: string;
    is_verified: boolean;
    is_blocked: boolean;
}