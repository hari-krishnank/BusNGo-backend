export interface IOwner {
    email: string;
    is_verified?: boolean
    is_blocked?: boolean
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
}