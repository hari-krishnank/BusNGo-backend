export interface IUserAuthService {
    validateUser(email: string, password: string): Promise<IUser | null>;
    login(user: IUser): Promise<{ access_token: string, user: IUserResponse }>;
    googleLogin(credential: string): Promise<{ access_token: string, user: IUserResponse }>;
}

export interface IUser {
    _id: string;
    email: string;
    username: string;
    password?: string;
    is_blocked: boolean;
    phone?: string;
    profileImage?: string;
    is_googleUser?: boolean;
}

export interface IUserResponse {
    userId: string;
    email: string;
    username: string;
    phone?: string;
    profileImage?: string;
}