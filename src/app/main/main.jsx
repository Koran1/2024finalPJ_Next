"use client"
import './main.css';
import { useEffect } from 'react';

function Main() {
  useEffect(() => {
    import('bootstrap').then(bootstrap => {
      const myCarousel = document.querySelector('#myCarousel');
      new bootstrap.Carousel(myCarousel, {
        interval: 4000,
        wrap: true,
        ride: 'carousel'
      });
    });
  }, []);

  return (
    <>
      <main>
        <div id="myCarousel" className="carousel slide mb-6" data-bs-ride="carousel" data-bs-interval="5000">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="/images/reviewImage03.png" alt="Review Image" className="bd-placeholder-img" width="80%" height="80%" style={{objectFit: 'cover', display: 'block', margin: '0 auto', maxHeight: '500px'}} />
              <div className="container">
                <div className="carousel-caption text-start">
                  <h1 className='main-title'>낭만 글램핑</h1>
                  <p className="main-content">캠핑이 처음이라도 무사히 해낼 수 있는 곳을 찾다가 캠핑과 백패킹을 사랑하는 지인과 함께 바로 예약했어요</p>
                  <p><a className="btn btn-lg btn-primary" href="/camp">캠핑장 검색하기</a></p>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <img src="/images/reviewImage02.png" alt="Review Image" className="bd-placeholder-img" width="100%" height="100%" style={{objectFit: 'cover', display: 'block', margin: '0 auto'}} />
              <div className="container">
                <div className="carousel-caption">
                  <h1 className='main-title'>맛있는 먹을거리와 함께하는 캠핑 후기</h1>
                  <p className="main-content">테이블이랑 의자 그리고 푸짐한 먹을 거리가 있다면 캠핑의 맛을 충분히 즐길 수 있어요.</p>
                  <p><a className="btn btn-lg btn-primary" href="/camplog/list">캠핑로그 바로가기</a></p>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <img src="/images/reviewImage01.png" alt="Review Image" className="bd-placeholder-img" width="100%" height="100%" style={{objectFit: 'cover', display: 'block', margin: '0 auto'}} />
              <div className="container">
                <div className="carousel-caption text-end">
                  <h1 className='main-title'>나만의 아이템</h1>
                  <p className="main-content">우리 가족만의 캠핑 간판! 캠핑을 본격적으로 시작하고 난 후부터 제작해서 들고 다니고 있는데 애들이 너무 좋아해요.</p>
                  <p><a className="btn btn-lg btn-primary" href="/deal/dealMain">캠핑마켓 바로가기</a></p>
                </div>
              </div>
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>

        <div className="container marketing">
          <div className="row featurette">
            <div className="col-md-7">
              <h2 className="featurette-heading fw-normal lh-1">낭만 글램핑 <p><span className="text-body-secondary">캠핑장 예약하기!</span></p></h2>
              <span className="lead">캠핑이 처음이라도 무사히 해낼 수 있는 곳을 찾다가 캠핑과 백팽킹을 사랑하는 지인과 함께 바로 예약했어요.
광주 도심속에 위치해서 도심속으로 떠나는 감성글램핑(자차,배달,대리5분이내 가능)
인접한 풍영정천 수변공원 산책로를 따라 라이딩도 하고, 자연생태체험도 가능해요.
운남대교의 야경은 해외에 온듯한 여행지의 분위기를 만끼하며 지친 일상에 멀리떠나지 않고도 쉬어갈수있는 도심속 휴식공간이에요.
AI서비스로봇도 있어서 로봇이 배송해주는 캠핑장으로 아이들이 엄청 좋아해요</span>
            <p><a className="btn btn-lg btn-primary" href="/camp">캠핑장 검색하기</a></p>
            </div>
            <div className="col-md-5">
              <a href="/camp" className="featurette-image-link">
                <img
                  src="/images/campingPlace.jpg"
                  alt="Review Image"
                  className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto"
                  style={{ width: '500px', height: '500px', borderRadius: '10px' }}
                />
              </a>
            </div>
          </div>

          <hr className="featurette-divider" />
          <div className="row featurette">
            <div className="col-md-7 order-md-2">
              <h2 className="featurette-heading fw-normal lh-1">서해안 캠핑 후기 <p><span className="text-body-secondary">맛있는 먹을거리와 함께하는 캠핑 후기</span></p></h2>
              <p className="lead">테이블이랑 의자 그리고 간단하게 먹을 거리만 좀 챙겨서 나가도 충분해요. 이렇게 세팅하고 아이들은 바다에 발 담그러 가고 저희는 음악 들으며 보내는 시간이 참 좋더라구요. 여기에 고기까지 구워 먹으면 천국이 따로 없어요.</p>
              <p><a className="btn btn-lg btn-primary" href="/camplog/list">캠핑로그 바로가기</a></p>
              </div>
            <div className="col-md-5 order-md-1">
              <a href="/camplog/list" className="featurette-image-link">
                <img
                  src="/images/camplog031.avif"
                  alt="Review Image"
                  className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto"
                  style={{ width: '500px', height: '500px', borderRadius: '10px' }}
                />
              </a>
            </div>
          </div>

          <hr className="featurette-divider" />
          <div className="row featurette">
            <div className="col-md-7">
              <h2 className="featurette-heading fw-normal lh-1">나만의 아이템 <p><span className="text-body-secondary">귀염뽀짝 나의 최애템들</span></p></h2>
              <p className="lead">필수품까지는 아니고 추천템이지만 있으면 너무 좋은 아이템. 캠핑을 본격적으로 시작하고 난 후부터 여러 아이템을 만들어서 들고 다니고 있는데 애들이 너무 좋아해요. 왠지 모를 단결심도 생기는 것 같구요.^^ 소소한 아이템이지만 아이와의 캠핑을 더욱 재미있고 보람차게 만들어주는 아이템이라 적극적으로 추천해봅니다!</p>
              <p><a className="btn btn-lg btn-primary" href="/deal/dealMain">캠핑마켓 바로가기</a></p>
              </div>
            <div className="col-md-5">
              <a href="/deal/dealMain" className="featurette-image-link">
                <img
                  src="/images/reviewImage01.png"
                  alt="Review Image"
                  className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto"
                  style={{ width: '500px', height: '500px', borderRadius: '10px' }}
                />
              </a>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}

export default Main;
