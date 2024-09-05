import { FormattedTrip } from "./searchTripFormatter.interface";

export function formatTripResult(trip: any, bus: any, bookedSeats: string[]): FormattedTrip {
    return {
        _id: trip._id,
        title: trip.title,
        ticketPrice: trip.ticketPrice,
        startFrom: {
            _id: trip.startFrom._id,
            name: trip.startFrom.name,
            city: trip.startFrom.city,
            location: trip.startFrom.location,
            mobileNumber: trip.startFrom.mobileNumber
        },
        endTo: {
            _id: trip.endTo._id,
            name: trip.endTo.name,
            city: trip.endTo.city,
            location: trip.endTo.location,
            mobileNumber: trip.endTo.mobileNumber
        },
        fleetType: {
            _id: trip.fleetType._id,
            name: trip.fleetType.name,
            acStatus: trip.fleetType.acStatus,
            seatLayout: {
                _id: trip.fleetType.seatLayout._id,
                layoutName: trip.fleetType.seatLayout.layoutName,
                selectedSeats: trip.fleetType.seatLayout.selectedSeats,
                rows: trip.fleetType.seatLayout.rows,
                columns: trip.fleetType.seatLayout.columns,
            },
            facilities: trip.fleetType.facilities.map((facility: any) => ({
                title: facility.title,
                icon: facility.icon
            }))
        },
        route: {
            _id: trip.route._id,
            name: trip.route.name,
            startingPoint: trip.route.startingPoint,
            endingPoint: trip.route.endingPoint,
            hasMoreStoppage: trip.route.hasMoreStoppage,
            additionalStops: trip.route.additionalStops.map((stop: any) => ({
                stop: {
                    _id: stop.stop._id,
                    name: stop.stop.name,
                    city: stop.stop.city,
                    location: stop.stop.location,
                    mobileNumber: stop.stop.mobileNumber
                },
                reachingTime: stop.reachingTime
            })),
            schedule: {
                _id: trip.route.schedule._id,
                startFrom: trip.route.schedule.startFrom,
                end: trip.route.schedule.end,
                duration: trip.route.schedule.duration
            },
            distance: trip.route.distance,
            time: trip.route.time
        },
        bus: bus ? {
            _id: bus._id,
            name: bus.name,
            regNo: bus.regNo,
            engineNo: bus.engineNo,
            chasisNo: bus.chasisNo,
            ModelNo: bus.ModelNo
        } : null,
        bookedSeats: bookedSeats
    };
}