import { deselectVehicle, selectVehicle } from "@/app/reducers/vehiclesSlice";
import { getViewerFromRef } from "@/app/utils";
import { findCurrentPosition } from "@/app/utils/animation";
import { Cartesian3, Color } from "cesium";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useStore } from "react-redux";
import { BoxGraphics, Entity, LabelGraphics, PointGraphics } from "resium";

const VEHICLE_COLOR = new Color(235/255, 100/255, 52/255, 0.7);

export function Vehicle({ vehicle, viewerRef, selected, time }) {

    const {points, name, id} = vehicle,
        [currentCoords, setCurrentCoords] = useState(findCurrentPosition(points, Date.now())),
        [lon, lat] = currentCoords,
        position = Cartesian3.fromDegrees(lon, lat),
        boxDimensions = new Cartesian3(100, 70, 10),
        store = useStore(),
        dispatch = useDispatch(),
        viewer = getViewerFromRef(viewerRef),
        entityRef = useRef();

    const onClick = useCallback((mvt, target) => {
        if (vehicle.id !== store.getState().vehicles.selected) {
            dispatch(selectVehicle(vehicle.id));
        } else {
            dispatch(deselectVehicle());
        }
    }, [vehicle, store, dispatch]);

    useEffect(() => {
        setCurrentCoords(findCurrentPosition(points, Date.now()));
    }, [points, time])

    useEffect(() => {
        if (entityRef?.current?.cesiumElement && selected) {
            viewer.flyTo(entityRef.current.cesiumElement);
        }
    }, [selected, entityRef, viewer]);

    return (
        <Entity position={position} onClick={onClick} description={name} id={id} ref={entityRef}>
            <PointGraphics pixelSize={5} color={Color.BLUE} />
            <BoxGraphics dimensions={boxDimensions} fill={true} material={VEHICLE_COLOR} outline={true} outlineColor={Color.WHITE}/>
            <LabelGraphics text={name} scale={.35} fillColor={Color.GHOSTWHITE}/>
        </Entity>
    );

}