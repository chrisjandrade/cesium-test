'use client';

import { useSelector } from "react-redux";
import { PointPrimitiveCollection } from "resium";
import { VehiclePrimitive } from "../vehicle-primitive/VehiclePrimitive";

export function Vehicles({ viewerRef, time }) {

    const vehicles = useSelector(state => state.vehicles.data),
        selectedVehicleId = useSelector(state => state.vehicles.selected);

    return <PointPrimitiveCollection>
        { vehicles.map(vehicle => 
            <VehiclePrimitive 
                key={vehicle.id} 
                selected={selectedVehicleId === vehicle.id} 
                viewerRef={viewerRef} 
                time={time} 
                vehicle={vehicle} />)}
    </PointPrimitiveCollection>
};
