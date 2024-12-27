

function Page({ coordinates }) {

    return (
        <div>
            <h2>지도</h2>
            <p>받은 좌표 데이터 :</p>
            <pre>{JSON.stringify(coordinates, null, 2)}</pre>
            {/* 실제 지도 렌더링 로직 추가 */}
            {/* 예: Google Maps API, Naver Maps API 등을 사용 */}

            <div style={{ height: '70%', backgroundColor: '#eee' }}>지도 표시 영역</div>
        </div>
    );
}

export default Page;