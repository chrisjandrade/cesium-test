'use client';

import { deselectPort } from "@/app/reducers/portsSlice";
import { faWindowRestore } from "@fortawesome/free-regular-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "@mui/material";
import { useCallback, useMemo, useRef } from "react";
import Draggable from "react-draggable";
import { useDispatch, useSelector } from "react-redux";
import styles from './PortInfo.module.css';
import { openExternalWindow } from "@/app/utils";
import { createSelector } from "@reduxjs/toolkit";

const initFields = (port) => {
    const { name, coordinates,
        city, province,
        country, timezone } = port,
        lat = coordinates[1].toFixed(3),
        lon = coordinates[0].toFixed(3);

    return [
        { label: 'Name', value: name },
        { label: 'Location', value: `${lat}, ${lon}` },
        { label: 'City', value: city },
        { label: 'Province', value: province },
        { label: 'Country', value: country },
        { label: 'Timezone', value: timezone }
    ].filter(({ value }) => !!value);
};

const selectSelectedPort = createSelector([
    state => state.ports.selected,
    state => state.ports.data
], (selectedKey, portsMap) => portsMap[selectedKey]);

export function PortInfo() {

    const selectedPort = useSelector(selectSelectedPort),
        fields = useMemo(() => initFields(selectedPort), [selectedPort]),
        draggableRef = useRef(null),
        dispatch = useDispatch();

    const onClose = useCallback(() => {
        dispatch(deselectPort());
    }, [dispatch]);

    const openWindow = useCallback(() => {
        const params = new URLSearchParams();
            params.set('selectedPort', selectedPort.key);

        openExternalWindow(location.href, params);
    }, [selectedPort]);

    return (
        <Draggable nodeRef={draggableRef}>
            <div className={styles.PortInfo} ref={draggableRef}>
                <h2>
                    {selectedPort.name}

                    <Tooltip title="Deselect the port">
                        <FontAwesomeIcon className={styles.closeIcon} icon={faTimes} onClick={onClose} />
                    </Tooltip>
                </h2>

                <div>
                    {fields.map(({ label, value }) => (
                        <div key={label} className={styles.portProperty}>{label}: <strong>{value}</strong></div>
                    ))}
                </div>
                <Tooltip title="Open a new window focused on this port">
                    <div className={styles.openWindowContainer} onClick={openWindow} >
                        <FontAwesomeIcon className={styles.openWindowIcon} icon={faWindowRestore} /> Open in a new window
                    </div>
                </Tooltip>
            </div>
        </Draggable>
    );
}