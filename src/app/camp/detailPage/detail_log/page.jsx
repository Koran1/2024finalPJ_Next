import React, { useEffect, useState } from 'react';

export default function Page({ posts }) {
    const ITEMS_PER_PAGE = 3; // 한 번에 불러올 아이템 수
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

    // 더보기 버튼 핸들러
    const loadMore = () => {
        setVisibleCount((prevCount) => prevCount + ITEMS_PER_PAGE);
    };

    // const examplePosts = [
    //     { image: '/images/campImageholder2.png', title: '#쉬는날 #화초', author: 'Thinkingcat', likes: 5 },
    //     { image: '/images/campImageholder2.png', title: '#반려동물인테리어', author: 'goldhand.sis', likes: 11 },
    //     { image: '/images/campImageholder2.png', title: '셀프 세탁실 꾸미기', author: 'Osol_home', likes: 25 },
    //     { image: '/images/campImageholder2.png', title: '중딩이 아늑한 방꾸미기', author: '뚜꾸레터', likes: 12 },
    //     { image: '/images/campImageholder2.png', title: '겨울맞이 준비', author: 'winterlover', likes: 8 },
    //     { image: '/images/campImageholder2.png', title: '내추럴 인테리어', author: 'cozy_home', likes: 20 },
    //     { image: '/images/campImageholder2.png', title: 'DIY 가구 만들기', author: 'diylover', likes: 18 },
    //     { image: '/images/campImageholder2.png', title: '홈 오피스 꾸미기', author: 'officespace', likes: 15 },
    //     { image: '/images/campImageholder2.png', title: 'DIY 가구 만들기', author: 'diylover', likes: 18 },
    //     { image: '/images/campImageholder2.png', title: 'DIY 가구 만들기', author: 'diylover', likes: 18 },
    //     { image: '/images/campImageholder2.png', title: 'DIY 가구 만들기', author: 'diylover', likes: 18 },
    // ];


    return (
        <div>
            {/* 포스트 리스트 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {posts
                    .filter((posts) => posts.logIsActive == 1) // logIsActive가 1인 경우만 필터링
                    .slice(0, visibleCount)
                    .map((post, index) => (
                        <div key={index} style={{ textAlign: 'center', padding: '10px', border: '1px solid #ddd' }}>
                            {/* 이미지 */}
                            <img src={post.logThumbnail ? post.logThumbnail : "/images/campImageholder2.png"} alt={post.logTitle} style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '8px' }} />
                            {/* 제목 */}
                            <h3 style={{ margin: '10px 0', fontSize: '16px' }}>{post.logTitle}</h3>
                            {/* 작성자 정보와 공감 수 */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', color: '#666' }}>
                                <p>{post.userIdx}</p>
                                <p style={{ fontWeight: 'bold', color: '#000' }}>❤️ {post.logRecommend}</p>
                            </div>
                        </div>
                    ))}
            </div>

            {/* 더보기 버튼 */}
            {visibleCount < posts.length && (
                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                    <button
                        onClick={loadMore}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#333',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        더보기
                    </button>
                </div>
            )}
        </div>
    );
}




