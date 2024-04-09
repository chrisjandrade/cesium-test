'use client';

import { retrievePorts, selectPort } from '@/app/reducers/portsSlice';
import { getViewerFromRef } from '@/app/utils';
import { ScreenSpaceEventType } from '@/public/cesium';
import { SceneMode } from 'cesium';
import moment from 'moment';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Scene, ScreenSpaceEvent, ScreenSpaceEventHandler, Viewer } from 'resium';
import { DevConsole } from '../dev-console/DevConsole';
import { PortInfo } from '../port-info/PortInfo';
import { Ports } from '../ports/Ports';
import { VehicleInfo } from '../vehicle-info/VehicleInfo';
import styles from './CesiumViewer.module.css';
import { Vehicles } from '../vehicles/Vehicles';

export function CesiumViewer() {

    const viewerRef = useRef(null),
        containerRef = useRef(null),
        dispatch = useDispatch(),
        selectedKey = useSelector(state => state.ports.selected),
        selectedVehicleKey = useSelector(state => state.vehicles.selected),
        searchParams = useSearchParams(),
        previousPort = searchParams.get('selectedPort');

    // check to see if there is a query param for the selected port
    if (!selectedKey && previousPort) {
        dispatch(selectPort(previousPort));
    }

    // get the current list of ports
    useEffect(() => void (dispatch(retrievePorts())), [dispatch]);

    // check to see if we need to reset the zoom when nothing is selected
    useEffect(() => {
        if (!selectedKey && !selectedVehicleKey) {
            const viewer = getViewerFromRef(viewerRef);

            if (viewer) {
                viewer.camera.flyHome();
            }
        }
    }, [selectedKey, selectedVehicleKey]);

    /**
     * Disables the selected entity code in cesium so that
     * we can perform our own actions
     */
    const onSelectedEntityChanged = useCallback((entity) => {
        const viewer = getViewerFromRef(viewerRef);

        // make sure the viewer exists
        if (viewer) {
            // disable existing selection code
            viewer.selectedEntity = null;
        }
    }, [viewerRef]);

    /**
     * Mouse move handler that detects when the mouse is
     * moved over top an entity and adjusts the mouse
     * icon.
     */
    const mouseMoveHandler = useCallback(movement => {
        const viewer = getViewerFromRef(viewerRef) || {},
            { current } = containerRef,
            { scene } = viewer;

        if (scene && current) {
            const hovered = scene.pick(movement.endPosition);

            if (hovered) {
                current.style.cursor = 'pointer';
            } else {
                current.style.cursor = 'default';
            }
        }
    }, [viewerRef, containerRef]);

    const [time, setTime] = useState(Date.now());
    useEffect(() => 
        void(setInterval(() => setTime(Date.now()), 1000)), []);

    const formattedTime = useMemo(() => moment(time).format('MM-DD-yyyy HH:mm:ss'), [time]);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.querySelector('.cesium-viewer .cesium-viewer-animationContainer').style.display = 'none';
            containerRef.current.querySelector('.cesium-viewer .cesium-timeline-main').style.display = 'none';
        }
    }, [containerRef]);

    return (
        <div className={styles.CesiumViewer} ref={containerRef}>
            { selectedKey ? <PortInfo /> : null }
            { selectedVehicleKey ? <VehicleInfo time={time} /> : null }

            <div className={styles.CurrentTime} suppressHydrationWarning>{formattedTime}</div>

            <DevConsole />
            <Viewer full
                selectionIndicator={false}
                onSelectedEntityChange={onSelectedEntityChanged}
                ref={viewerRef}>

                <Scene mode={SceneMode.SCENE2D} debugShowFramesPerSecond={true}/>

                <ScreenSpaceEventHandler>
                    <ScreenSpaceEvent action={mouseMoveHandler} type={ScreenSpaceEventType.MOUSE_MOVE} />
                </ScreenSpaceEventHandler>

                <Ports viewerRef={viewerRef} />
                <Vehicles time={time} viewerRef={viewerRef} />
            </Viewer>
        </div>
    );
}