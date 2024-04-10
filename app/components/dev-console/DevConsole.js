'use client';

import { mockPorts } from "@/app/reducers/portsSlice";
import { useCallback, useRef, useState } from "react";
import Draggable from "react-draggable";
import { useDispatch, useSelector } from "react-redux";
import styles from './DevConsole.module.css';
import { mockVehicles } from "@/app/reducers/vehiclesSlice";
import { createSelector } from "@reduxjs/toolkit";

const MAX_BATCH_SIZE = 1000;

const selectNumPorts = createSelector(state => 
    state.ports.data, portsMap => Object.keys(portsMap).length);

export function DevConsole() {

    const dispatch = useDispatch(), 
        draggableRef = useRef(),
        numPortsRef = useRef(),
        numPorts = useSelector(selectNumPorts),
        numVehiclesRef = useRef(),
        numVehicles = useSelector(state => state.vehicles.data.length),
        [batchMode, setBatchMode] = useState(true),
        [loading, setLoading] = useState(false),
        [responsivenessMs, setResponsivenessMs] = useState(),
        [isResponsivenessTesting, setIsResponsivenessTesting] = useState(false),
        [intervalId, setIntervalId] = useState();

    const stats = [
        { label: 'Number of Ports', value: numPorts },
        { label: 'Number of Vehicles', value: numVehicles },
        { label: 'Total', value: numPorts + numVehicles },
        { label: 'Responsiveness (ms)', value: responsivenessMs }
    ];

    const batchMockPorts = useCallback((remaining, batch) => {
        if (remaining > 0) {
            dispatch(mockPorts(Math.min(remaining, batch)));
        } else {
            setLoading(false);
        }

        if (remaining > 0) {
            setTimeout(() => batchMockPorts(remaining - batch, batch), 1000);
        }
    },[dispatch]);

    const onMockPorts = useCallback(() => {
        const { value } = numPortsRef.current,
            numPorts = parseFloat(value);


        if (!Number.isNaN(numPorts)) {
            if (!batchMode) {
                dispatch(mockPorts(parseFloat(numPorts)));
            } else {
                setLoading(true);
                batchMockPorts(numPorts, Math.min(Math.floor(numPorts / 10), MAX_BATCH_SIZE));
            }

        }
    }, [numPortsRef, batchMockPorts, dispatch, batchMode]);

    const batchMockVehicles = useCallback((remaining, batch) => {
        if (remaining > 0) {
            dispatch(mockVehicles(Math.min(remaining, batch)));
        } else {
            setLoading(false);
        }

        if (remaining > 0) {
            setTimeout(() => batchMockVehicles(remaining - batch, batch), 1000);
        }
    }, [dispatch]);

    const onMockVehicles = useCallback(() => {
        const { value } = numVehiclesRef.current,
            numVehicles = parseFloat(value);

        if (!Number.isNaN(numVehicles)) {
            if (!batchMode) {
                dispatch(mockVehicles(numVehicles));
            } else {
                setLoading(true);
                batchMockVehicles(numVehicles, Math.min(Math.floor(numVehicles / 10), MAX_BATCH_SIZE));
            }
        }
    }, [numVehiclesRef, dispatch, batchMockVehicles, batchMode]);

    const runResponsiveness = useCallback(() => {
        if (!isResponsivenessTesting) {
            let last = Date.now(),
                delay = 100,
                worstResponsiveness = 0;

            setIsResponsivenessTesting(true);

            setIntervalId(setInterval(() => {
                worstResponsiveness = Math.max(Date.now() - (last + delay), 0, worstResponsiveness);
                setResponsivenessMs(worstResponsiveness);
                last = Date.now();
            }, delay));
        } else {
            setIsResponsivenessTesting(false);
            setResponsivenessMs(undefined);
            clearInterval(intervalId);
        }
    }, [intervalId, isResponsivenessTesting]);

    const onBatchModeChange = useCallback(() =>
        setBatchMode(!batchMode), [batchMode]);

    return (
        <Draggable nodeRef={draggableRef}>
            <div className={styles.DevConsole} ref={draggableRef}>
                { loading ? <div className={styles.Loading}>Please wait...</div> : null }
                <div className={styles.Container}>
                    <strong>Statistics</strong><br />
                    {stats.map(({ label, value }) =>
                        <div key={label}>{label}: <strong>{value}</strong></div>
                    )}
                </div>
                <div className={styles.Container}>
                    <strong>Dev Controls</strong><br />
                    <div><input type="checkbox" id="batchOperation" defaultChecked={batchMode} onClick={onBatchModeChange}/><label htmlFor="batchOperation">Batch Mode</label></div>
                    <div>Mock Ports <input type="text" maxLength="9" size="4" ref={numPortsRef} defaultValue="100"/> <button onClick={onMockPorts}>GO</button></div>
                    <div>Mock Vehicles <input type="text" maxLength="9" size="4" ref={numVehiclesRef} defaultValue="100"/> <button onClick={onMockVehicles}>GO</button></div>
                    <div><button onClick={runResponsiveness}>{isResponsivenessTesting ? 'Stop Responsiveness Test' : 'Run Responsiveness Test'}</button></div>
                </div>
            </div>
        </Draggable>
    );

}