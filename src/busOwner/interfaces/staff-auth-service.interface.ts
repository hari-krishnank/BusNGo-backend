export interface IStaffAuthService {
    validateStaff(username: string, password: string): Promise<any>;
    loginStaff(staff: IStaff): Promise<{ access_token: string }>;
}

export interface IStaff {
    _id: string;
    email: string;
    password?: string;
}