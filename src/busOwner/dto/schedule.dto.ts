export class CreateScheduleDto {
    startFrom: string;
    end: string;
    duration: string;
    status: 'Active' | 'Inactive';
}

export class UpdateScheduleDto {
    startFrom?: string;
    end?: string;
    duration?: string;
    status?: 'Active' | 'Inactive';
}