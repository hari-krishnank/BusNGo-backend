export interface IUser {
    username: string;
    lastName?: string;
    email: string;
    phone?: string;
    password?: string;
    profileImage?: string;
    is_verified: boolean;
    is_blocked: boolean;
}