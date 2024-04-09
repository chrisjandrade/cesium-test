import { deselectVehicle } from "@/app/reducers/vehiclesSlice";
import { findCurrentPosition } from "@/app/utils/animation"
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import styles from './VehicleInfo.module.css';
import { useCallback, useEffect, useState } from "react";
import { createSelector } from "@reduxjs/toolkit";

const selectSelectedVehicle = createSelector([
    state => state.vehicles.selected,
    state => state.vehicles.data
], (selectedKey, vehicles) => 
    vehicles.find(({ id }) => id === selectedKey));

export function VehicleInfo({ time }) {

    const { name, points } = useSelector(selectSelectedVehicle),
        dispatch = useDispatch(),
        [currentCoords, setCurrentCoords] = useState(findCurrentPosition(points, time));

    const onClose = useCallback(() => {
        dispatch(deselectVehicle());
    }, [dispatch]);

    useEffect(() => {
        setCurrentCoords(findCurrentPosition(points, time));
    }, [time, points]);

    return (
        <div className={styles.VehicleInfo}>
            <h2>
                {name}

                <Tooltip title="Deselect the vehicle">
                    <FontAwesomeIcon className={styles.closeIcon} icon={faTimes} onClick={onClose} />
                </Tooltip>
            </h2>
            <div>
                Location: <strong>{`${currentCoords[1].toFixed(3)}, ${currentCoords[0].toFixed(3)}`}</strong>
            </div>
        </div>
    )
}