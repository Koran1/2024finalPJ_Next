import './main.css';

function Main() {
  return (
    <>
      {/* <header data-bs-theme="dark">
        <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark" style={{height: '80px'}}>
          <div className="container-fluid">
            <a className="navbar-brand" href="#">CAMPERS</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
              <ul className="navbar-nav me-auto mb-2 mb-md-0">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#">캠핑장검색</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#">캠핑로그</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#">나의거래</a>
                </li>
              </ul>
              <div style={{color: 'lightgray', display: 'flex', alignItems: 'center'}}>
                <Avatar src="/images/kitten-3.jpg" />
                <div style={{marginLeft: '10px'}}>냐옹이님 환영합니다</div>
              </div>
              {/* <form className="d-flex" role="search">
                <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                <button className="btn btn-outline-success" type="submit">Search</button>
              </form>
            </div>
          </div>
        </nav>
      </header> */}

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
                  <p><a className="btn btn-lg btn-primary" href="#">Review more</a></p>
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
          {/* <div className="row">
            <div className="col-lg-4">
              <svg className="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder" preserveAspectRatio="xMidYMid slice" focusable="false">
                <title>Placeholder</title>
                <rect width="100%" height="100%" fill="var(--bs-secondary-color)" />
              </svg>
              <h2 className="fw-normal">Heading</h2>
              <p>Some representative placeholder content for the three columns of text below the carousel. This is the first column.</p>
              <p><a className="btn btn-secondary" href="#">View details &raquo;</a></p>
            </div>
            <div className="col-lg-4">
              <svg className="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder" preserveAspectRatio="xMidYMid slice" focusable="false">
                <title>Placeholder</title>
                <rect width="100%" height="100%" fill="var(--bs-secondary-color)" />
              </svg>
              <h2 className="fw-normal">Heading</h2>
              <p>Another exciting bit of representative placeholder content. This time, we've moved on to the second column.</p>
              <p><a className="btn btn-secondary" href="#">View details &raquo;</a></p>
            </div>
            <div className="col-lg-4">
              <svg className="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder" preserveAspectRatio="xMidYMid slice" focusable="false">
                <title>Placeholder</title>
                <rect width="100%" height="100%" fill="var(--bs-secondary-color)" />
              </svg>
              <h2 className="fw-normal">Heading</h2>
              <p>And lastly this, the third column of representative placeholder content.</p>
              <p><a className="btn btn-secondary" href="#">View details &raquo;</a></p>
            </div>
          </div> 

          <hr className="featurette-divider" /> */}
          <div className="row featurette">
            <div className="col-md-7">
              <h2 className="featurette-heading fw-normal lh-1">양평 캠핑장 <p><span className="text-body-secondary">집밖으로 캠핑장 솔직후기!</span></p></h2>
              <p className="lead">캠핑이 처음이라도 무사히 해낼 수 있는 곳!을 찾다가 캠핑과 백팽킹을 사랑하는 지인이 직접 캠핑장을 차렸다는 소식을 듣고 바로 달려갔어요</p>
            </div>
            <div className="col-md-5">
              <img src="/images/reviewImage03.png" alt="Review Image" className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" style={{width: '500px', height: '500px'}} />
                <title>Placeholder</title>
                <rect width="100%" height="100%" fill="var(--bs-secondary-bg)" />
                <text x="50%" y="50%" fill="var(--bs-secondary-color)" dy=".3em">Image01</text>
            </div>
          </div>

          <hr className="featurette-divider" />
          <div className="row featurette">
            <div className="col-md-7 order-md-2">
              <h2 className="featurette-heading fw-normal lh-1">서해안 여행계획 <p><span className="text-body-secondary">맛있는 먹거리와 함께</span></p></h2>
              <p className="lead">테이블이랑 의자 그리고 간단하게 먹을 거리만 좀 챙겨서 나가도 충분해요. 이렇게 세팅하고 아이들은 바다에 발 담그러 가고 저희는 음악 들으며 보내는 시간이 참 좋더라구요. 여기에 컵라면까지 먹으면 천국이 따로 없어요.</p>
            </div>
            <div className="col-md-5 order-md-1">
            <img src="/images/reviewImage02.png" alt="Review Image" className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" style={{width: '500px', height: '500px'}} />
            <title>Placeholder</title>
                <rect width="100%" height="100%" fill="var(--bs-secondary-bg)" />
                <text x="50%" y="50%" fill="var(--bs-secondary-color)" dy=".3em">Image02</text>
            </div>
          </div>

          <hr className="featurette-divider" />
          <div className="row featurette">
            <div className="col-md-7">
              <h2 className="featurette-heading fw-normal lh-1">나만의 아이템 <p><span className="text-body-secondary">귀염뽀짝 나의 최애템들</span></p></h2>
              <p className="lead">필수품까지는 아니고 추천템이지만 있으면 너무 좋은 아이템. 바로 우리 가족만의 캠핑 간판! 캠핑을 본격적으로 시작하고 난 후부터 제작해서 들고 다니고 있는데 애들이 너무 좋아해요. 왠지 모를 단결심도 생기는 것 같구요.^^ 소소한 아이템이지만 아이와의 캠핑을 더욱 재미있고 보람차게 만들어주는 아이템이라 적극적으로 추천해봅니다!</p>
            </div>
            <div className="col-md-5">
            <img src="/images/reviewImage01.png" alt="Review Image" className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" style={{width: '500px', height: '500px'}} />
                <title>Placeholder</title>
                <rect width="100%" height="100%" fill="var(--bs-secondary-bg)" />
                <text x="50%" y="50%" fill="var(--bs-secondary-color)" dy=".3em">Image03</text>
            </div>
          </div>

          <hr className="featurette-divider" />
        </div>

        {/* <footer className="container">
          <p className="float-end"><a href="#">Back to top</a></p>
          <p>&copy; 2024-2025 ICT Company, Inc. &middot; <a href="#">Privacy</a> &middot; <a href="#">Terms</a></p>
        </footer> */}
      </main>
    </>
  );
}

export default Main;
