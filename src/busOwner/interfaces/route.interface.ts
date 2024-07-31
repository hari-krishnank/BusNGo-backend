export interface IRoute {
    name: string;
    startingPoint: string;
    endingPoint: string;
    hasMoreStoppage: boolean;
    additionalStops: string[];
    distance: number;
    time: string;
    status: string;
}