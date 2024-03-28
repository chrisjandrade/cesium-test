import moment from "moment";
import { getUUID, randomLat, randomLong } from "../utils";
import { linearInterpolateCoords } from "../utils/animation";

export const vehicleService = {

    numVehicles: 0,
    durationSec: moment.duration(1, 'hour').asSeconds(),

    mockVehicles(numVehicles = 0) {
        const vehicles = [];

        for (let i = 0; i < numVehicles; i++) {
            let points = linearInterpolateCoords(
                [randomLong(), randomLat()],
                [randomLong(), randomLat()]);

            const now = moment();
            points = points.map(([long, lat]) => ({
                startTime: now.valueOf(),
                endTime: now.add(vehicleService.durationSec / points.length, 'seconds').valueOf(),
                coords: [long, lat]
            }));

            vehicles.push({
                name: `vehicle-${vehicleService.numVehicles++}`,
                id: getUUID(),
                points
            });
        }

        return vehicles;
    }

};

