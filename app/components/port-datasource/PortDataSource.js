import { Cartesian3, Color, EntityCluster } from "cesium";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CustomDataSource, EllipseGraphics, Entity, LabelGraphics, PointGraphics } from "resium";

const positionFromCoordinates = (coords) => {
    return Cartesian3.fromDegrees(coords[1], coords[0]); 
};

const pointProperties = (port, selected) => ({
    pixelSize: 5,
    color: port.key === selected ? Color.GOLD : Color.DARKRED
});

const ellipseProperties = (port, selected) => ({
    fill: false,
    outline: true,
    outlineWidth: port.key == selected ? 5 : 1,
    outlineColor: port.key === selected ? Color.GOLD : Color.DARKRED,
    semiMajorAxis: 100,
    semiMinorAxis: 100
});

const labelProperties = (port, selected) => ({
    text: port.name,
    scale: port.key === selected ? 0.5 : 0.35,
    fillColor: Color.GHOSTWHITE
});

const portsMapToValues = (portsMap = {}) => {
    return Object.values(portsMap).
        filter(({ coordinates }) => !!coordinates);
};

const CLUSTER_CONFIG = {
    enabled: true,
    pixelRange: 50,
    minimumClusterSize: 3,
    clusterPoints: true,
    clusterLabels: true
};

export function PortDataSource({ viewerRef, time }) {

    const dispatch = useDispatch(),
        entityRef = useRef(),
        ports = portsMapToValues(useSelector(state => state.ports.data)),
        selected = useSelector(state => state.ports.selected);

    const onSelectEntity = (mvt, target) => {
        console.log({ mvt, target});
    };

    return (
        <CustomDataSource name="port-datasource" clustering={new EntityCluster(CLUSTER_CONFIG)}>
            { ports.map(port => 
                <Entity id={port.key} key={port.key}
                    position={positionFromCoordinates(port.coordinates)}
                    onClick={onSelectEntity}
                    point={{ pixelSize: 10, color: Color.DARKRED }}
                    ref={entityRef}>
                        {/* <PointGraphics {...pointProperties(port, selected)} />
                        <EllipseGraphics {...ellipseProperties(port, selected)} />
                        <LabelGraphics {...labelProperties(port, selected)} /> */}
                </Entity>)}
        </CustomDataSource>
    )
}