'use client';

import { createSelector } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { PointPrimitiveCollection } from "resium";
import { PortPrimitive } from "../port-primitive/PortPrimitive";

const selectPorts = createSelector(state => state.ports.data,
    portsMap => Object.values(portsMap).filter(port => port?.coordinates?.length > 0));

export function Ports({ viewerRef }) {

    const ports = useSelector(selectPorts),
        selectedPortKey = useSelector(state => state.ports.selected);

    return <PointPrimitiveCollection>
        {ports.map(port =>
            <PortPrimitive
                key={port.key}
                port={port}
                viewerRef={viewerRef}
                selected={port.key === selectedPortKey} />
        )}
    </PointPrimitiveCollection>;
}