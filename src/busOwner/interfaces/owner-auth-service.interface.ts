export interface IOwnerAuthService {
    validateOwner(email: string, password: string): Promise<IOwner | null>;
    loginOwner(owner: IOwner): Promise<{ access_token: string }>;
}

export interface IOwner {
    email: string;
    // _id: string;
    is_blocked: boolean;
    password: string;
    [key: string]: any;
}