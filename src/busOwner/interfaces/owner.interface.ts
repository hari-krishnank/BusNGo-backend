export interface IOwner {
    email: string;
    firstName?: string;
    lastName?: string;
    mobile?: string;
    password?: string;
    agencyName?: string;
    designation?: string;
    country?: string;
    state?: string;
    city?: string;
    postalCode?: string;
    address?: string;
    is_verified?: boolean;
    is_blocked?: boolean;
    registrationRequestSent?: boolean;
    statusOfApproval?: string;
}