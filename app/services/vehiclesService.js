import moment from "moment";
import { getUUID, randomLat, randomLong, randomNum } from "../utils";
import { linearInterpolateCoords } from "../utils/animation";

export const vehicleService = {

    numVehicles: 0,
    durationSec: moment.duration(1, 'hour').asSeconds(),

    randomCoord(baseCoord) {
        if (!baseCoord) {
            return [randomLong(), randomLat()];
        } else {
            const deltaLong = randomNum(10),
                deltaLat = randomLat(10);
            
            return [
                (baseCoord[0] + deltaLong) % 180,
                (baseCoord[1] + deltaLat) % 90
            ];
        }
    },

    mockVehicles(numVehicles = 0) {
        const vehicles = [];

        for (let i = 0; i < numVehicles; i++) {
            const start = vehicleService.randomCoord(),
                end = vehicleService.randomCoord(start);

            let points = linearInterpolateCoords(start, end);

            const now = moment().subtract(10, 'minutes');
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

