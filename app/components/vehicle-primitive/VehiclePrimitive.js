'use client';

import { deselectVehicle, selectVehicle } from "@/app/reducers/vehiclesSlice";
import { getViewerFromRef } from "@/app/utils";
import { findCurrentPosition } from "@/app/utils/animation";
import { Cartesian3, Color } from "cesium";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { PointPrimitive } from "resium";

const ZOOM_ALTITUDE = 15000;

export function VehiclePrimitive({ time, viewerRef, selected, vehicle }) {

    const [lastTime, setLastTime] = useState(time),
        color = useMemo(() => selected ? Color.DARKORANGE : Color.WHITE, [selected]),
        size = useMemo(() => selected ? 10 : 6, [selected]),
        dispatch = useDispatch();

    const currentTime = useMemo(() => {
        if (time - lastTime >= 1000) {
            setLastTime(time);
            return time;
        } else {
            return lastTime;
        }
    }, [time, lastTime]);

    const position = useMemo(() => {
        const [lon, lat] = findCurrentPosition(vehicle.points, currentTime);
        return Cartesian3.fromDegrees(lon, lat, ZOOM_ALTITUDE);
    }, [vehicle, currentTime]);

    const handleClick = useCallback(() => {
        if (selected) {
            dispatch(deselectVehicle());
        } else {
            dispatch(selectVehicle(vehicle.id));
        }
    }, [vehicle, selected, dispatch]);

    useEffect(() => {
        if (selected) {
            const { camera } = getViewerFromRef(viewerRef);
            if (camera) {
                camera.flyTo({ destination: position });
            }
        }
    }, [position, viewerRef, selected]);

    return <PointPrimitive 
        id={vehicle.id}
        onClick={handleClick}
        position={position} 
        color={color} 
        pixelSize={size} />
};