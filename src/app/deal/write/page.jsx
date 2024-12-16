'use client'
import './write.css';
import React, { useState } from 'react';
import { Button } from '@mui/material';

function Page() {
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    place1: '',
    price: '0',
    count: 1,
    description: ''
  });

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('나눔');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [selectedDirect, setSelectedDirect] = useState('직거래 가능');
  const [selectedFree, setSelectedFree] = useState('');

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...imageUrls].slice(0, 5)); // 최대 5개까지만 허용
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const isFormComplete = () => {
    return (
      images.length > 0 && // 상품 이미지
      formData.name.trim() !== '' && // 상품명
      formData.description.trim() !== '' && // 상품설명
      selectedCategory && // 카테고리
      selectedState && // 상품상태
      selectedPackage && // 택배거래
      selectedDirect && // 직거래
      formData.count > 0 && // 수량
      (selectedFree === "나눔" || formData.price.trim() !== '') // 가격
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 등록 로직을 여기에 추가하세요
  };

  const handleCancel = () => {
    window.location.href = '/deal/list';
  };

  function insertImage(targetCellIndex, imageUrl) {
    const table = document.getElementById('imageTable');
    const rows = table.getElementsByTagName('tr');
    
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        if (targetCellIndex < cells.length) {
            const cell = cells[targetCellIndex];
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = 'Inserted Image';
            cell.appendChild(img);
        }
    }
  }

  return (
    <div className="pd-reg-container">
      <h2>상품정보</h2>
      <br />
      <div className="image-upload-section">
        <h4>상품 이미지</h4>
        <hr />
        <div className="image-preview-container">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="image-preview-box">
              {images[index] ? (
                <img src={images[index]} alt={`상품 이미지 ${index + 1}`} />
              ) : (
                <label htmlFor={`image-upload-${index}`}>
                  <input
                    type="file"
                    id={`image-upload-${index}`}
                    accept="image/*"
                    onChange={(e) => {
                      handleImageUpload(e);
                    }}
                    style={{ display: 'none' }}
                  />
                  <div className="upload-placeholder">+</div>
                </label>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <br />
        <h4>상품명</h4>
        <input
          type="text"
          placeholder="상품명을 입력해 주세요"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div className="category-section">
        <br />
        <h4>카테고리</h4>
        <hr />
        <div className="category-options">
          <p>
            <label>
              <input
                type="radio"
                name="category"
                value="텐트/타프"
                onChange={e => setSelectedCategory(e.target.value)}
                checked={selectedCategory === "텐트/타프"}
              />
              텐트/타프
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="침구류"
                onChange={e => setSelectedCategory(e.target.value)}
                checked={selectedCategory === "침구류"}
              />
              침구류
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="취사도구"
                onChange={e => setSelectedCategory(e.target.value)}
                checked={selectedCategory === "취사도구"}
              />
              취사도구
            </label>
          </p>
          <p>
            <label>
              <input
                type="radio"
                name="category"
                value="식품/음료"
                onChange={e => setSelectedCategory(e.target.value)}
                checked={selectedCategory === "식품/음료"}
              />
              식품/음료
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="의류/신발"
                onChange={e => setSelectedCategory(e.target.value)}
                checked={selectedCategory === "의류/신발"}
              />
              의류/신발
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="디지털기기"
                onChange={e => setSelectedCategory(e.target.value)}
                checked={selectedCategory === "디지털기기"}
              />
              디지털기기
            </label>
          </p>
          <p>
            <label>
              <input
                type="radio"
                name="category"
                value="휴대용품"
                onChange={e => setSelectedCategory(e.target.value)}
                checked={selectedCategory === "휴대용품"}
              />
              휴대용품
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="위생용품"
                onChange={e => setSelectedCategory(e.target.value)}
                checked={selectedCategory === "위생용품"}
              />
              위생용품
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="안전/보안"
                onChange={e => setSelectedCategory(e.target.value)}
                checked={selectedCategory === "안전/보안"}
              />
              안전/보안
            </label>
          </p>
          <p>
            <label>
              <input
                type="radio"
                name="category"
                value="가방/스토리지"
                onChange={e => setSelectedCategory(e.target.value)}
                checked={selectedCategory === "가방/스토리지"}
              />
              가방/스토리지
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="난방/화로"
                onChange={e => setSelectedCategory(e.target.value)}
                checked={selectedCategory === "난방/화로"}
              />
              난방/화로
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="뷰티/미용"
                onChange={e => setSelectedCategory(e.target.value)}
                checked={selectedCategory === "뷰티/미용" || !selectedCategory}
              />
              뷰티/미용
            </label>
          </p>
          <p>
            <label>
              <input
                type="radio"
                name="category"
                value="취미/게임"
                onChange={e => setSelectedCategory(e.target.value)}
                checked={selectedCategory === "취미/게임"}
              />
              취미/게임
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="반려동물용품"
                onChange={e => setSelectedCategory(e.target.value)}
                checked={selectedCategory === "반려동물용품"}
              />
              반려동물용품
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="기타 물품"
                onChange={e => setSelectedCategory(e.target.value)}
                checked={selectedCategory === "기타 물품" || !selectedCategory}
              />
              기타 물품
            </label>
          </p>
        </div>
        <p style={{ color: 'red' }}>선택한 카테고리 : <span style={{ color: 'black', fontStyle: 'italic' }}>{selectedCategory || "기타 물품"}</span></p>
      </div>

      <div className="state-section">
        <br />
        <h4>상품상태</h4>
        <hr />
        <div className="state-options">
          <p>
            <label>
              <input
                type="radio"
                name="state"
                value="미개봉(미사용)"
                onChange={e => setSelectedState(e.target.value)}
                checked={selectedState === "미개봉(미사용)" || !selectedState}
              />
              미개봉(미사용) <span style={{ fontSize: '14px', color: 'gray' }}>사용하지 않은 미개봉 상품</span>
            </label>
          </p>
          <p>
            <label>
              <input
                type="radio"
                name="state"
                value="사용감 없음"
                onChange={e => setSelectedState(e.target.value)}
                checked={selectedState === "사용감 없음"}
              />
              사용감 없음 <span style={{ fontSize: '14px', color: 'gray' }}>사용은 했지만 사용한 흔적이나 얼룩 없음</span>
            </label>
          </p>
          <p>
            <label>
              <input
                type="radio"
                name="state"
                value="사용감 적음"
                onChange={e => setSelectedState(e.target.value)}
                checked={selectedState === "사용감 적음"}
              />
              사용감 적음 <span style={{ fontSize: '14px', color: 'gray' }}>눈에 띄는 사용 흔적이나 얼룩이 약간 있음</span>
            </label>
          </p>
          <p>
            <label>
              <input
                type="radio"
                name="state"
                value="사용감 많음"
                onChange={e => setSelectedState(e.target.value)}
                checked={selectedState === "사용감 많음"}
              />
              사용감 많음 <span style={{ fontSize: '14px', color: 'gray' }}>눈에 띄는 사용 흔적이나 얼룩이 많음</span>
            </label>
          </p>
          <p>
            <label>
              <input
                type="radio"
                name="state"
                value="고장/파손 있음"
                onChange={e => setSelectedState(e.target.value)}
                checked={selectedState === "고장/파손 있음"}
              />
              수리/수선 필요 <span style={{ fontSize: '14px', color: 'gray' }}>일부 기능 이상이나 외관 손상이 있으나 수리/수선하면 쓸 수 있음</span>
            </label>
          </p>
        </div>
      </div>
      <br /><br />

      <div className="form-group">
        <h4>상품설명</h4>
        <textarea
          placeholder={`브랜드, 모델명, 구매 시기, 하자 유무 등 상품 설명을 최대한 자세히 적어주세요.
전화번호, SNS 계정 등 개인정보 기재 시 피해가 발생 할 수 있으니 주의해주세요.
욕설, 비방, 혐오 발언 등 부적절한 표현은 사전 통보 없이 삭제될 수 있습니다.
안전하고 건전한 거래 문화 조성을 위해 협조 해주시기 바랍니다.`}
          rows="5"
          name="description"
          value={formData.description}
          onChange={handleChange}
          style={{ height: '270px' }}
        ></textarea>
      </div>
      <br />

      <div className="price-section">
        <h4>가격</h4>
        <hr />
        <div className="price-options">
          <label>
            <input
              type="radio"
              name="price"
              value="가격 입력"
              onChange={e => {
                setSelectedPrice(e.target.value);
                if (e.target.value === "가격 입력") {
                  setFormData(prev => ({...prev, price: ''}));
                }
              }}
              checked={selectedPrice === "가격 입력"}
            />
            가격 입력
          </label>
          <div className="form-group">
            <input
              type="number"
              placeholder="상품 가격을 입력해 주세요"
              name="price"
              value={formData.price}
              onChange={handleChange}
              disabled={selectedPrice === "나눔"}
            />
          </div>
          <label>
            <input
              type="radio"
              name="price"
              value="나눔"
              onChange={e => {
                setSelectedPrice(e.target.value);
                setFormData(prev => ({...prev, price: '0'}));
              }}
              checked={selectedPrice === "나눔"}
            />
            나눔
          </label>
          <br />
        </div>
      </div>
      <br /><br />

      <div className="package-section">
        <h4>택배거래</h4>
        <hr />
        <div className="package-options">
          <label>
            <input
              type="radio"
              name="package"
              value="배송비 포함"
              onChange={e => setSelectedPackage(e.target.value)}
              checked={selectedPackage === "배송비 포함" || !selectedPackage}
            />
            배송비 포함
          </label>
          <label>
            <input
              type="radio"
              name="package"
              value="배송비 별도"
              onChange={e => setSelectedPackage(e.target.value)}
              checked={selectedPackage === "배송비 별도"}
            />
            배송비 별도
          </label>
        </div>
      </div>
      <br /><br /><br />

      <div className="direct-section">
        <h4>직거래</h4>
        <hr />
        <div className="direct-options">
          <label>
            <input
              type="radio"
              name="direct"
              value="직거래 가능"
              onChange={e => {
                setSelectedDirect(e.target.value);
                if (e.target.value === "직거래 가능") {
                  // 추가 로직이 필요할 경우 여기에 작성
                } else {
                  setFormData(prev => ({...prev, place1: ''}));
                }
              }}
              checked={selectedDirect === "직거래 가능"}
            />
            직거래 가능
          </label>
          <div className="form-group">
            <input
              type="text"
              placeholder="직거래 가능지역을 입력해 주세요"
              name="place1"
              value={formData.place1}
              onChange={handleChange}
              disabled={selectedDirect === "직거래 불가"}
            />
          </div>
          <label>
            <input
              type="radio"
              name="direct"
              value="직거래 불가"
              onChange={e => {
                setSelectedDirect(e.target.value);
                setFormData(prev => ({...prev, place1: ''}));
              }}
              checked={selectedDirect === "직거래 불가"}
            />
            직거래 불가
          </label>
          <br />
        </div>
      </div>
      <br /><br />

      <div className="form-group">
        <h4>수량</h4>
        <div className="input-wrapper">
          <input
            type="number"
            name="count"
            value={formData.count}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (value < 1) {
                alert("1개 이상을 입력해주세요.");
                setFormData(prev => ({...prev, count: 1}));
              } else {
                handleChange(e);
              }
            }}
            onFocus={(e) => {
              if (e.target.value === "1") {
                setFormData(prev => ({...prev, count: ""}));
              }
            }}
            min="1" 
            placeholder="수량을 입력해주세요"
            className="number-input"
          />
        </div>
      </div>

      <br />
      <h6 style={{ color: 'green', textAlign: 'center' }}>모든 항목이 입력되어야 상품등록이 가능합니다</h6>

      <div className="button-group">
        <Button
          className={`submit-btn ${isFormComplete() ? 'submit-btn-enabled' : 'submit-btn-disabled'}`}
          variant="contained"
          disabled={!isFormComplete()}
          onClick={handleSubmit}
        >
          등록
        </Button>
        &nbsp;&nbsp;&nbsp;
        <Button
          className="cancel-btn"
          variant="contained"
          onClick={handleCancel}
        >
          취소
        </Button>
      </div>
      <br /><br />
    </div>
  );
}

export default Page;