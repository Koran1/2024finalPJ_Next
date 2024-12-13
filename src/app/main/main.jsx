import './main.css';

function Main() {
  return (
    <>
      <main>
        <div id="myCarousel" className="carousel slide mb-6" data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="/images/reviewImage03.png" alt="Review Image" className="bd-placeholder-img" width="1920px" height="100%" style={{objectFit: 'cover', display: 'block', margin: '0 auto'}} />
              <div className="container">
                <div className="carousel-caption text-start">
                  <h1>양평 캠핑장</h1>
                  <p className="opacity-75">캠핑이 처음이라도 무사히 해낼 수 있는 곳!을 찾다가 캠핑과 백팽킹을 사랑하는 지인이 직접 캠핑장을 차렸다는 소식을 듣고</p>
                  <p><a className="btn btn-lg btn-primary" href="#">Review more</a></p>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <img src="/images/reviewImage02.png" alt="Review Image" className="bd-placeholder-img" width="1920px" height="100%" style={{objectFit: 'cover', display: 'block', margin: '0 auto'}} />
              <div className="container">
                <div className="carousel-caption">
                  <h1>서해안 여행계획</h1>
                  <p>테이블이랑 의자 그리고 간단하게 먹을 거리만 좀 챙겨서 나가도 충분</p>
                  <p><a className="btn btn-lg btn-primary" href="#">Review more</a></p>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <img src="/images/reviewImage01.png" alt="Review Image" className="bd-placeholder-img" width="1920px" height="100%" style={{objectFit: 'cover', display: 'block', margin: '0 auto'}} />
              <div className="container">
                <div className="carousel-caption text-end">
                  <h1>나만의 아이템</h1>
                  <p>우리 가족만의 캠핑 간판! 캠핑을 본격적으로 시작하고 난 후부터 제작해서 들고 다니고 있는데 애들이 너무 좋아해요.</p>
                  <p><a className="btn btn-lg btn-primary" href="/deal">Review more</a></p>
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
              <h2 className="featurette-heading fw-normal lh-1">양평 캠핑장 <p><span className="text-body-secondary">집밖으로 캠핑장 솔직후기!</span></p></h2>
              <p className="lead">캠핑이 처음이라도 무사히 해낼 수 있는 곳!을 찾다가 캠핑과 백팽킹을 사랑하는 지인이 직접 캠핑장을 차렸다는 소식을 듣고 바로 달려갔어요</p>
              <p><a className="btn btn-lg btn-secondary" href="#" style={{backgroundColor: '#f8f9fa', color: '#6c757d', borderColor: '#f8f9fa'}}>Review more</a></p>
            </div>
            <div className="col-md-5">
            <img
                src="/images/reviewImage03.png"
                alt="Review Image"
                className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto"
                style={{ width: '500px', height: '500px' }}
              />
            </div>
          </div>

          <hr className="featurette-divider" />
          <div className="row featurette">
            <div className="col-md-7 order-md-2">
              <h2 className="featurette-heading fw-normal lh-1">서해안 여행계획 <p><span className="text-body-secondary">맛있는 먹거리와 함께</span></p></h2>
              <p className="lead">테이블이랑 의자 그리고 간단하게 먹을 거리만 좀 챙겨서 나가도 충분해요. 이렇게 세팅하고 아이들은 바다에 발 담그러 가고 저희는 음악 들으며 보내는 시간이 참 좋더라구요. 여기에 컵라면까지 먹으면 천국이 따로 없어요.</p>
              <p><a className="btn btn-lg btn-secondary" href="#" style={{backgroundColor: '#f8f9fa', color: '#6c757d', borderColor: '#f8f9fa'}}>Review more</a></p>
            </div>
            <div className="col-md-5 order-md-1">
            <img
                src="/images/reviewImage02.png"
                alt="Review Image"
                className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto"
                style={{ width: '500px', height: '500px' }}
              />
            </div>
          </div>

          <hr className="featurette-divider" />
          <div className="row featurette">
            <div className="col-md-7">
              <h2 className="featurette-heading fw-normal lh-1">나만의 아이템 <p><span className="text-body-secondary">귀염뽀짝 나의 최애템들</span></p></h2>
              <p className="lead">필수품까지는 아니고 추천템이지만 있으면 너무 좋은 아이템. 바로 우리 가족만의 캠핑 간판! 캠핑을 본격적으로 시작하고 난 후부터 제작해서 들고 다니고 있는데 애들이 너무 좋아해요. 왠지 모를 단결심도 생기는 것 같구요.^^ 소소한 아이템이지만 아이와의 캠핑을 더욱 재미있고 보람차게 만들어주는 아이템이라 적극적으로 추천해봅니다!</p>
              <p><a className="btn btn-lg btn-secondary" href="/deal" style={{backgroundColor: '#f8f9fa', color: '#6c757d', borderColor: '#f8f9fa'}}>Review more</a></p>
            </div>
            <div className="col-md-5">
              <img
                src="/images/reviewImage01.png"
                alt="Review Image"
                className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto"
                style={{ width: '500px', height: '500px' }}
              />
            </div>
          </div>

        </div>
      </main>
    </>
  );
}

export default Main;
