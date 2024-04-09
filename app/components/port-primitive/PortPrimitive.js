import { deselectPort, selectPort } from "@/app/reducers/portsSlice";
import { getViewerFromRef } from "@/app/utils";
import { Color, Cartesian3 } from "cesium";
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { PointPrimitive } from "resium";

const ZOOM_ALTITUDE = 10000;

export function PortPrimitive({ viewerRef, port, selected }) {

    const dispatch = useDispatch();

    const position = useMemo(() => {
        const [lon, lat] = port.coordinates;
        return Cartesian3.fromDegrees(lon, lat, ZOOM_ALTITUDE);
    }, [port]);

    const color = useMemo(() =>
        selected ? Color.DARKORANGE : Color.DARKRED,
        [selected]);

    const size = useMemo(() => selected ? 10 : 6, [selected]);

    const handleSelect = useCallback(() => {
        if (!selected) {
            dispatch(selectPort(port.key));
        } else {
            dispatch(deselectPort());
        }
    }, [port, selected, dispatch]);

    useEffect(() => {
        if (selected) {
            const { camera } = getViewerFromRef(viewerRef);

            if (camera) {
                camera.flyTo({ destination: position });
            }
        }
    }, [selected, viewerRef, position]);

    return <PointPrimitive 
        id={port.key}
        color={color} 
        position={position} 
        onClick={handleSelect} 
        pixelSize={size}/>;
}