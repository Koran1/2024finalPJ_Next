"use client"
import { useEffect } from 'react';

function Page(props) {
    useEffect(() => {
        // Kakao Maps API 스크립트 동적 로드
        const script = document.createElement("script");
        script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=92fc7272bc08200be416bcdb7ef66d32&autoload=false";
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            window.kakao.maps.load(() => {
                const kakao = window.kakao;
                const container = document.getElementById("map");
                const options = {
                    center: new kakao.maps.LatLng(33.450701, 126.570667),
                    level: 3,
                };
                var map = new kakao.maps.Map(container, options);
                // 마커가 표시될 위치입니다 
                var markerPosition = new kakao.maps.LatLng(33.450701, 126.570667);
                // 마커를 생성합니다
                var marker = new kakao.maps.Marker({
                    position: markerPosition
                });

                // 마커가 지도 위에 표시되도록 설정합니다
                marker.setMap(map);

                var iwContent = '<div style="padding:5px;">춘천 더숲 캠핑장 <br>' +
                    '<a href="https://map.kakao.com/link/map/Hello World!,33.450701,126.570667" style="color:blue" target="_blank">큰지도보기</a> ' +
                    '<a href="https://map.kakao.com/link/to/Hello World!,33.450701,126.570667" style="color:blue" target="_blank">길찾기</a></div>',
                    // // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
                    iwPosition = new kakao.maps.LatLng(33.450701, 126.570667); //인포윈도우 표시 위치입니다

                // 인포윈도우를 생성합니다
                var infowindow = new kakao.maps.InfoWindow({
                    position: iwPosition,
                    content: iwContent
                });

                // 마커 위에 인포윈도우를 표시합니다. 두번째 파라미터인 marker를 넣어주지 않으면 지도 위에 표시됩니다
                infowindow.open(map, marker);

            });
        };


        // cleanup 함수로 스크립트 제거
        return () => {
            document.head.removeChild(script);
        };
    }, []);
    return (

        <div
            id="map"
            style={{
                width: "800px",
                height: "400px",
            }}
        >


        </div>
    );
}

export default Page;