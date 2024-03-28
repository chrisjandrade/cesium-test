import moment from "moment";

/**
 * Calculates a point between two given numbers
 */
export const linearInterpolate = (x, y, a) => x * (1 - a) + y * a;

/**
 * Generates an array of coordinates
 */
export const linearInterpolateCoords = ([startLon, startLat], [endLon, endLat], numPoints = 100) => {

    const coords = [[startLon, startLat]];

    for (let i = 1; i < numPoints - 1; i++) {
        coords.push([
            linearInterpolate(startLon, endLon, i / numPoints),
            linearInterpolate(startLat, endLat, i / numPoints)
        ]);
    }

    coords.push([endLon, endLat]);
    return coords;
};

export const findCurrentPosition = (points, time) => {
    let currentCoords;

    points.some(({ startTime, endTime, coords }) => {
        
        if (time >= startTime && time <= endTime) {
            currentCoords = coords;
        }

        return !!currentCoords;
    });

    return currentCoords;
};
