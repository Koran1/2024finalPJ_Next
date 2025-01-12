import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function Page({ posts }) {
    const ITEMS_PER_PAGE = 3; // 한 번에 불러올 아이템 수
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
    const imgUrl = process.env.NEXT_PUBLIC_LOCAL_IMG_URL;

    // 더보기 버튼 핸들러
    const loadMore = () => {
        setVisibleCount((prevCount) => prevCount + ITEMS_PER_PAGE);
    };
    const router = useRouter();

    return (
        <div>
            {/* 포스트 리스트 */}
            {posts.filter((post) => post.logIsActive == 1).length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    {posts
                        .filter((post) => post.logIsActive == 1) // logIsActive가 1인 경우만 필터링
                        .slice(0, visibleCount)
                        .map((post, index) => (
                            <div key={index} style={{ textAlign: 'center', padding: '10px', border: '1px solid #ddd', cursor: "pointer" }}
                                onClick={() => router.push(`/camplog/detail/${post.logIdx}`)}>
                                {/* 이미지 */}
                                <img
                                    src={post.logThumbnail ? `${imgUrl}/${post.logThumbnail}` : "/images/campImageholder2.png"}
                                    alt={post.logTitle}
                                    onError={(e) => e.target.src = "/images/campImageholder2.png"}
                                    style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '8px' }}
                                />
                                {/* 제목 */}
                                <h3 style={{ margin: '10px 0', fontSize: '16px' }}>{post.logTitle}</h3>
                                {/* 작성자 정보와 공감 수 */}
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        fontSize: '14px',
                                        color: '#666',
                                    }}
                                >
                                    <p>{post.userNickname}</p>
                                    <p style={{ fontWeight: 'bold', color: '#000' }}>❤️ {post.logRecommend}</p>
                                </div>
                            </div>
                        ))}
                </div>
            ) : (
                <p style={{ textAlign: 'center', fontSize: '16px', color: '#666' }}>후기가 없습니다.</p>
            )}

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




