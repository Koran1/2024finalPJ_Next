"use client"
import { useEffect, useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

function Page({ item }) {
    const [position, setPosition] = useState([]);

    useEffect(() => {
        if (!item.mapY || !item.mapX) return;
        setPosition([item.mapY, item.mapX]);
    }, [item]);

    return (
        <>
            {item.mapY && item.mapX &&
                <Map
                    id="map"
                    center={{ lat: position[0], lng: position[1] }}
                    style={{ width: "800px", height: "360px" }}
                    level={3}
                >
                    <MapMarker position={{ lat: position[0], lng: position[1] }}>
                        <div style={{ padding: '5px', textAlign: 'center', width: "150px" }}>
                            <b>{item.facltNm}</b> <br />
                            <div style={{ display: "flex", justifyContent: "space-around" }}>
                                <a href={`https://map.kakao.com/link/map/${item.facltNm},${item.mapY},${item.mapX}`} style={{ color: 'blue' }} target="_blank">
                                    큰지도보기
                                </a>
                                <a href={`https://map.kakao.com/link/to/${item.facltNm},${item.mapY},${item.mapX}`} style={{ color: 'blue' }} target="_blank">
                                    길찾기
                                </a>
                            </div>
                        </div>
                    </MapMarker>
                </Map>
            }
        </>
    );

    // useEffect(() => {
    //     if (!item?.facltNm) return;

    //     const KAKAO_KEY = process.env.NEXT_PUBLIC_KAKAO_KEY;
    //     // Kakao Maps API 스크립트 동적 로드
    //     const script = document.createElement("script");
    //     script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&autoload=false`;
    //     script.async = true;
    //     document.head.appendChild(script);

    //     script.onload = () => {
    //         window.kakao.maps.load(() => {
    //             const kakao = window.kakao;
    //             const container = document.getElementById("map");
    //             const options = {
    //                 center: new kakao.maps.LatLng(item.mapY, item.mapX),
    //                 level: 3,
    //             };
    //             var map = new kakao.maps.Map(container, options);
    //             // 마커가 표시될 위치입니다 
    //             var markerPosition = new kakao.maps.LatLng(item.mapY, item.mapX);
    //             // 마커를 생성합니다
    //             var marker = new kakao.maps.Marker({
    //                 position: markerPosition
    //             });

    //             // 마커가 지도 위에 표시되도록 설정합니다
    //             marker.setMap(map);

    //             var iwContent = `<div style="padding:5px;">${item.facltNm} <br>` +
    //                 `<a href="https://map.kakao.com/link/map/${item.facltNm},${item.mapY},${item.mapX}" style="color:blue" target="_blank">큰지도보기</a> ` +
    //                 `<a href="https://map.kakao.com/link/to/${item.facltNm},${item.mapY},${item.mapX}" style="color:blue" target="_blank">길찾기</a></div>`,
    //                 // // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
    //                 iwPosition = new kakao.maps.LatLng(33.450701, 126.570667); //인포윈도우 표시 위치입니다

    //             // 인포윈도우를 생성합니다
    //             var infowindow = new kakao.maps.InfoWindow({
    //                 position: iwPosition,
    //                 content: iwContent
    //             });

    //             // 마커 위에 인포윈도우를 표시합니다. 두번째 파라미터인 marker를 넣어주지 않으면 지도 위에 표시됩니다
    //             infowindow.open(map, marker);

    //         });
    //     };


    //     // cleanup 함수로 스크립트 제거
    //     return () => {
    //         document.head.removeChild(script);
    //     };
    // }, [item]);
    // return (

    //     <div
    //         id="map"
    //         style={{
    //             width: "800px",
    //             height: "400px",
    //         }}
    //     >


    //     </div>
    // );
}

export default Page;