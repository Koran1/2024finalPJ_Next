import './header.css';
import { Avatar } from '@mui/material';

function header() {
  return (
    <>
      <header data-bs-theme="dark">
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
              </form> */}
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

export default header;