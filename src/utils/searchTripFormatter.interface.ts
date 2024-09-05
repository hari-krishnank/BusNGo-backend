export interface FormattedTrip {
    _id: string;
    title: string;
    ticketPrice: number;
    startFrom: {
        _id: string;
        name: string;
        city: string;
        location: string;
        mobileNumber: string;
    };
    endTo: {
        _id: string;
        name: string;
        city: string;
        location: string;
        mobileNumber: string;
    };
    fleetType: {
        _id: string;
        name: string;
        acStatus: boolean;
        seatLayout: {
            _id: string;
            layoutName: string;
            selectedSeats: string[];
            rows: string;
            columns: string;
        };
        facilities: {
            title: string;
            icon: string;
        }[];
    };
    route: {
        _id: string;
        name: string;
        startingPoint: string;
        endingPoint: string;
        hasMoreStoppage: boolean;
        additionalStops: {
            stop: {
                _id: string;
                name: string;
                city: string;
                location: string;
                mobileNumber: string;
            };
            reachingTime: string;
        }[];
        schedule: {
            _id: string;
            startFrom: string;
            end: string;
            duration: string;
        };
        distance: string;
        time: string;
    };
    bus: {
        _id: string;
        name: string;
        regNo: string;
        engineNo: string;
        chasisNo: string;
        ModelNo: string;
    } | null;
    bookedSeats: any
}