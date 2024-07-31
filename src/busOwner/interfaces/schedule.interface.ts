export interface Schedule {
    id: string;
    startFrom: string;
    end: string;
    duration: string;
    status: 'Active' | 'Inactive';
}