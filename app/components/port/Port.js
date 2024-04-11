'use client';

import { deselectPort, selectPort } from '@/app/reducers/portsSlice';
import { getViewerFromRef } from '@/app/utils';
import { Cartesian3 } from 'cesium';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useStore } from 'react-redux';
import { BillboardGraphics, Entity } from 'resium';

export function Port({ port, viewerRef, selected }) {

    const [lon, lat] = port.coordinates,
        viewer = getViewerFromRef(viewerRef),
        entityRef = useRef(null),
        position = useMemo(() => Cartesian3.fromDegrees(lon, lat), [lon, lat]),
        store = useStore(),
        dispatch = useDispatch();

    /**
     * Handles when the user clicks on the port
     */
    const handleClick = useCallback((mvt, target) => {
        if (port.key !== store.getState().ports.selected) {
            dispatch(selectPort(port.key));
        } // de-selecting the entity 
        else {
            dispatch(deselectPort());
        }
    }, [port, store, dispatch]);

    // check if we need to fly to the port 
    useEffect(() => {
        if (entityRef?.current?.cesiumElement && selected) {
            viewer.flyTo(entityRef.current.cesiumElement);
        }
    }, [selected, entityRef, viewer]);

    return (
        <Entity position={position} description={port.name} onClick={handleClick} id={port.key} ref={entityRef}>
            <BillboardGraphics image="/images/gps-icon.svg" height={16} width={16} />
        </Entity>
    );
}