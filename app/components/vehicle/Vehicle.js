'use client';

import { deselectVehicle, selectVehicle } from "@/app/reducers/vehiclesSlice";
import { getViewerFromRef } from "@/app/utils";
import { findCurrentPosition } from "@/app/utils/animation";
import { Cartesian3 } from "cesium";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { BillboardGraphics, Entity } from "resium";

export function Vehicle({ vehicle, viewerRef, selected, time }) {

    const { name, id, points } = vehicle,
        entityRef = useRef(),
        [lastTime, setLastTime] = useState(time),
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
        const [lon, lat] = findCurrentPosition(points, currentTime);
        return Cartesian3.fromDegrees(lon, lat);
    }, [points, currentTime]);

    const handleClick = useCallback(() => {
        if (selected) {
            dispatch(deselectVehicle());
        } else {
            dispatch(selectVehicle(id));
        }
    }, [id, selected, dispatch]);

    useEffect(() => {
        if (selected) {
            const viewer = getViewerFromRef(viewerRef);

            if (entityRef?.current?.cesiumElement && selected) {
                viewer.flyTo(entityRef.current.cesiumElement);
            }
        }
    }, [selected, viewerRef, entityRef]);

    return (
        <Entity position={position} onClick={handleClick} description={name} id={id} ref={entityRef}>
            <BillboardGraphics image="images/ship.svg" height={16} width={16} />
        </Entity>
    );

}