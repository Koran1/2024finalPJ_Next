'use client'

import { Box } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Map, MapMarker, useMap } from "react-kakao-maps-sdk";

function Page({ coordinates }) {
    const [mapInstance, setMapInstance] = useState(null); // mapInstance 지우면 오류남

    useEffect(() => {
        if (!coordinates) return;
    }, [coordinates]);

    const ResetMapBounds = () => {
        const map = useMap();

        const bounds = useMemo(() => {
            if (!coordinates || coordinates.length === 0) return null;

            const kakaoBounds = new kakao.maps.LatLngBounds();
            coordinates.forEach((point) => {
                kakaoBounds.extend(new kakao.maps.LatLng(point.mapY, point.mapX));
            });
            return kakaoBounds;
        }, [coordinates]);

        // Reset map bounds function
        const handleResetBounds = () => {
            if (!map || !bounds) return;
            map.setBounds(bounds);
        };

        handleResetBounds();
    }

    return (
        <Box height="100%">
            <Box>
                <h2 style={{ display: "inline-block", paddingRight: "10px" }}>지도</h2>
            </Box>
            {coordinates.length > 0 && (
                <Box overflow="hidden" height="80%">
                    <Map
                        id="map"
                        center={{ lat: coordinates[0].mapY, lng: coordinates[0].mapX }}
                        style={{
                            minWidth: "360px",
                            minHeight: "360px",
                            height: "100%",
                        }}
                        level={3}
                        isPanto={true}
                        onCreate={setMapInstance}
                    >
                        {coordinates.map((coord) => (
                            <MapMarker
                                key={coord.facltNm}
                                position={{ lat: coord.mapY, lng: coord.mapX }}
                            >
                                <div style={{ padding: "5px", textAlign: "center" }}>
                                    <a
                                        href={`https://map.kakao.com/link/map/${coord.facltNm},${coord.mapY},${coord.mapX}`}
                                        style={{ color: "blue" }}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <b>{coord.facltNm}</b>
                                    </a>
                                </div>
                            </MapMarker>
                        ))}

                        <ResetMapBounds />
                    </Map>
                </Box>
            )}
        </Box>
    );
}

export default Page;


