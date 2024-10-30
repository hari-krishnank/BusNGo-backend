export interface IUser {
    username: string;
    lastName?: string;
    email: string;
    phone?: string;
    password?: string;
    profileImage?: string;
    dob?: Date;
    gender?: string;
    walletBalance?: number;
    refreshToken?:any
    is_verified: boolean;
    is_blocked: boolean;
}