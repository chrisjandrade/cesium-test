'use client';

import { retrievePorts, selectPort } from '@/app/reducers/portsSlice';
import { getViewerFromRef } from '@/app/utils';
import { ScreenSpaceEventType } from '@/public/cesium';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Scene, ScreenSpaceEvent, ScreenSpaceEventHandler, Viewer } from 'resium';
import { Port } from '../port/Port';
import styles from './CesiumViewer.module.css';
import { SceneMode } from 'cesium';
import { PortInfo } from '../port-info/PortInfo';
import { useSearchParams } from 'next/navigation';
import { DevConsole } from '../dev-console/DevConsole';
import { Vehicle } from '../vehicle/Vehicle';
import { VehicleInfo } from '../vehicle-info/VehicleInfo';
import moment from 'moment';

export function CesiumViewer() {

    const viewerRef = useRef(null),
        containerRef = useRef(null),
        dispatch = useDispatch(),
        ports = Object.values(useSelector(state => state.ports.data)).filter(port => port?.coordinates?.length > 0),
        vehicles = useSelector(state => state.vehicles.data),
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
    const onSelectedEntityChanged = (entity) => {
        const viewer = getViewerFromRef(viewerRef);

        // make sure the viewer exists
        if (viewer) {
            // disable existing selection code
            viewer.selectedEntity = null;
        }
    };

    /**
     * Mouse move handler that detects when the mouse is
     * moved over top an entity and adjusts the mouse
     * icon.
     */
    const mouseMoveHandler = (movment) => {
        const viewer = getViewerFromRef(viewerRef) || {},
            { current } = containerRef,
            { scene } = viewer;

        if (scene && current) {
            const entity = scene.pick(movment.endPosition);

            if (entity) {
                current.style.cursor = 'pointer';
            } else {
                current.style.cursor = 'default';
            }
        }
    };

    const [time, setTime] = useState(Date.now());
    useEffect(() => 
        void(setInterval(() => setTime(Date.now()), 1000)), []);

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

            <div className={styles.CurrentTime} suppressHydrationWarning>{moment(time).format('MM-DD-yyyy HH:mm:ss')}</div>

            <DevConsole />
            <Viewer full
                selectionIndicator={false}
                onSelectedEntityChange={onSelectedEntityChanged}
                ref={viewerRef}>

                <Scene mode={SceneMode.SCENE2D}/>

                <ScreenSpaceEventHandler>
                    <ScreenSpaceEvent action={mouseMoveHandler} type={ScreenSpaceEventType.MOUSE_MOVE} />
                </ScreenSpaceEventHandler>

                {ports.map(port => 
                    <Port 
                        key={port.id} 
                        port={port} 
                        selected={selectedKey === port.key}
                        viewerRef={viewerRef} />)}

                {vehicles.map(vehicle => 
                    <Vehicle 
                        key={vehicle.id}
                        vehicle={vehicle} 
                        selected={selectedVehicleKey === vehicle.id}
                        viewerRef={viewerRef} 
                        time={time} />)}
            </Viewer>
        </div>
    );
}