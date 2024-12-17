'use client'
import './write.css';
import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

function Page() {
  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
  // const { isAuthenticated, token } = useAuthStore();
  // const router = useRouter();
  const router = useRouter();
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    dealTitle: '',
    dealCategory: '기타 물품',
    dealStatus: '미개봉(미사용)',
    dealDescription: '',
    dealPrice: '0',
    dealPackage: '배송비 포함',
    dealDirect: '직거래 불가',
    dealPlace: '',
    dealCount: '1',
    dealRegDate: new Date().toISOString()
  });
  const [isFormValid, setIsFormValid] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState('기타 물품');
  const [selectedState, setSelectedState] = useState('미개봉(미사용)');
  const [selectedPrice, setSelectedPrice] = useState('나눔');
  const [selectedPackage, setSelectedPackage] = useState('배송비 포함');
  const [selectedDirect, setSelectedDirect] = useState('직거래 불가');

  useEffect(() => {
    const checkFormValidity = () => {
      const { name, description, price, count } = formData;
      const isValid = name !== '' && description !== '' && price !== '' && count > 0;
      setIsFormValid(isValid);
    };

    checkFormValidity();
  }, [formData]);

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
      images.length > 0 &&
      formData.dealTitle.trim() !== '' &&
      formData.dealDescription.trim() !== ''
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormComplete()) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    const submitData = new FormData();
    
    images.forEach((image, index) => {
      submitData.append(`image${index}`, image);
    });

    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });

    try {
      const response = await fetch(`${LOCAL_API_BASE_URL}/write`, {
        method: 'POST',
        headers: {
          // 'Content-Type': 'application/json' 제거 (FormData 사용시)
          // 'Authorization': `Bearer ${token}`
        },
        body: submitData
      });

      if (response.ok) {
        alert('상품이 성공적으로 등록되었습니다.');
        router.push('/deal/dealMain');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || '상품 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  };

  const handleCancel = () => {
    window.location.href = '/deal/dealMain';
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

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setFormData(prev => ({
      ...prev,
      dealCategory: value
    }));
  };

  const handleStateChange = (value) => {
    setSelectedState(value);
    setFormData(prev => ({
      ...prev,
      dealStatus: value
    }));
  };

  const handlePriceChange = (value) => {
    setSelectedPrice(value);
    setFormData(prev => ({
      ...prev,
      dealPrice: value === "나눔" ? '0' : formData.dealPrice
    }));
  };

  const handlePackageChange = (value) => {
    setSelectedPackage(value);
    setFormData(prev => ({
      ...prev,
      dealPackage: value
    }));
  };

  const handleDirectChange = (value) => {
    setSelectedDirect(value);
    setFormData(prev => ({
      ...prev,
      dealDirect: value,
      dealPlace: value === "직거래 불가" ? '' : formData.dealPlace
    }));
  };

  return (
    <div className="pd-reg-container">
      <h2 className="title">상품정보</h2>
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
                  <input type="file" id={`image-upload-${index}`} accept="image/*" onChange={(e) => { handleImageUpload(e); }} style={{ display: 'none' }} />
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
        <input type="text" placeholder="상품명을 입력해 주세요" name="dealTitle" value={formData.dealTitle} onChange={handleChange} />
      </div>

      <div className="category-section">
        <br />
        <h4>카테고리</h4>
        <hr />
        <div className="category-options">
          <p>
            <label>
              <input type="radio" name="category" value="텐트/타프" onChange={e => setSelectedCategory(e.target.value)} checked={selectedCategory === "텐트/타프"} />
              텐트/타프
            </label>
            <label>
              <input type="radio" name="category" value="침구류" onChange={e => setSelectedCategory(e.target.value)} checked={selectedCategory === "침구류"} />
              침구류
            </label>
            <label>
              <input type="radio" name="category" value="취사도구" onChange={e => setSelectedCategory(e.target.value)} checked={selectedCategory === "취사도구"} />
              취사도구
            </label>
          </p>
          <p>
            <label>
              <input type="radio" name="category" value="식료품/음료" onChange={e => setSelectedCategory(e.target.value)} checked={selectedCategory === "식품/음료"} />
              식품/음료
            </label>
            <label>
              <input type="radio" name="category" value="의류/신발" onChange={e => setSelectedCategory(e.target.value)} checked={selectedCategory === "의류/신발"} />
              의류/신발
            </label>
            <label>
              <input type="radio" name="category" value="디지털기기" onChange={e => setSelectedCategory(e.target.value)} checked={selectedCategory === "디지털기기"} />
              디지털기기
            </label>
          </p>
          <p>
            <label>
              <input type="radio" name="category" value="휴대용품" onChange={e => setSelectedCategory(e.target.value)} checked={selectedCategory === "휴대용품"} />
              휴대용품
            </label>
            <label>
              <input type="radio" name="category" value="위생용품" onChange={e => setSelectedCategory(e.target.value)} checked={selectedCategory === "위생용품"} />
              위생용품
            </label>
            <label>
              <input type="radio" name="category" value="안전/보안" onChange={e => setSelectedCategory(e.target.value)} checked={selectedCategory === "안전/보안"} />
              안전/보안
            </label>
          </p>
          <p>
            <label>
              <input type="radio" name="category" value="가방/스토리지" onChange={e => setSelectedCategory(e.target.value)} checked={selectedCategory === "가방/스토리지"} />
              가방/스토리지
            </label>
            <label>
              <input type="radio" name="category" value="난방/화로" onChange={e => setSelectedCategory(e.target.value)} checked={selectedCategory === "난방/화로"} />
              난방/화로
            </label>
            <label>
              <input type="radio" name="category" value="뷰티/미용" onChange={e => setSelectedCategory(e.target.value)} checked={selectedCategory === "뷰티/미용" || !selectedCategory} />
              뷰티/미용
            </label>
          </p>
          <p>
            <label>
              <input type="radio" name="category" value="취미/게임" onChange={e => setSelectedCategory(e.target.value)} checked={selectedCategory === "취미/게임"} />
              취미/게임
            </label>
            <label>
              <input type="radio" name="category" value="반려동물용품" onChange={e => setSelectedCategory(e.target.value)} checked={selectedCategory === "반려동물용품"} />
              반려동물용품
            </label>
            <label>
              <input type="radio" name="category" value="휴대용 가구" onChange={e => setSelectedCategory(e.target.value)} checked={selectedCategory === "휴대용 가구"} />
              휴대용 가구
            </label>
          </p>
          <p>
            <label>
              <input type="radio" name="category" value="기타 물품" onChange={e => setSelectedCategory(e.target.value)} checked={selectedCategory === "기타 물품" || !selectedCategory} />
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
              <input type="radio" name="state" value="미개봉(미사용)" onChange={e => setSelectedState(e.target.value)} checked={selectedState === "미개봉(미사용)" || !selectedState} />
              미개봉(미사용) <span style={{ fontSize: '14px', color: 'gray' }}>사용하지 않은 미개봉 상품</span>
            </label>
          </p>
          <p>
            <label>
              <input type="radio" name="state" value="사용감 없음" onChange={e => setSelectedState(e.target.value)} checked={selectedState === "사용감 없음"} />
              사용감 없음 <span style={{ fontSize: '14px', color: 'gray' }}>사용은 했지만 사용한 흔적이나 얼룩 없음</span>
            </label>
          </p>
          <p>
            <label>
              <input type="radio" name="state" value="사용감 적음" onChange={e => setSelectedState(e.target.value)} checked={selectedState === "사용감 적음"} />
              사용감 적음 <span style={{ fontSize: '14px', color: 'gray' }}>눈에 띄는 사용 흔적이나 얼룩이 약간 있음</span>
            </label>
          </p>
          <p>
            <label>
              <input type="radio" name="state" value="사용감 많음" onChange={e => setSelectedState(e.target.value)} checked={selectedState === "사용감 많음"} />
              사용감 많음 <span style={{ fontSize: '14px', color: 'gray' }}>눈에 띄는 사용 흔적이나 얼룩이 많음</span>
            </label>
          </p>
          <p>
            <label>
              <input type="radio" name="state" value="고장/파손 있음" onChange={e => setSelectedState(e.target.value)} checked={selectedState === "고장/파손 있음"} />
              수리/수선 필요 <span style={{ fontSize: '14px', color: 'gray' }}>일부 기능 이상이나 외관 손상이 있으나 수리/수선하면 쓸 수 있음</span>
            </label>
          </p>
        </div>
      </div>
      <br /><br />

      <div className="form-group">
        <h4>상품설명</h4>
        <textarea className="description-textarea" placeholder={`브랜드, 모델명, 구매 시기, 하자 유무 등 상품 설명을 최대한 자세히 적어주세요.\n전화번호, SNS 계정 등 개인정보 기재 시 피해가 발생 할 수 있으니 주의해주세요.\n욕설, 비방, 혐오 발언 등 부적절한 표현은 사전 통보 없이 삭제될 수 있습니다.\n안전하고 건전한 거래 문화 조성을 위해 협조 해주시기 바랍니다.`} rows="5" name="dealDescription" value={formData.dealDescription} onChange={handleChange}></textarea>
      </div>
      <br />

      <div className="price-section">
        <h4>가격</h4>
        <hr />
        <div className="price-options">
          <label>
            <input 
              type="radio" 
              name="dealprice" 
              value="가격 입력" 
              onChange={e => handlePriceChange(e.target.value)} 
              checked={selectedPrice === "가격 입력"} 
            />
            가격 입력
          </label>
          <div className="form-group">
            <input 
              type="number" 
              placeholder="상품 가격을 입력해 주세요" 
              name="dealPrice" 
              value={formData.dealPrice} 
              onChange={handleChange} 
              disabled={selectedPrice === "나눔"} 
            />
          </div>
          <label>
            <input type="radio" name="price" value="나눔" onChange={e => { setSelectedPrice(e.target.value); setFormData(prev => ({...prev, price: '0'})); }} checked={selectedPrice === "나눔"} />
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
            <input type="radio" name="package" value="배송비 포함" onChange={e => setSelectedPackage(e.target.value)} checked={selectedPackage === "배송비 포함" || !selectedPackage} />
            배송비 포함
          </label>
          <label>
            <input type="radio" name="package" value="배송비 별도" onChange={e => setSelectedPackage(e.target.value)} checked={selectedPackage === "배송비 별도"} />
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
            <input type="radio" name="direct" value="직거래 가능" onChange={e => { setSelectedDirect(e.target.value); if (e.target.value === "직거래 가능") { } else { setFormData(prev => ({...prev, place: ''})); } }} checked={selectedDirect === "직거래 가능"} />
            직거래 가능
          </label>
          <div className="form-group">
            <input type="text" placeholder="직거래 가능지역을 입력해 주세요" name="place" value={formData.place} onChange={handleChange} disabled={selectedDirect === "직거래 불가"} />
          </div>
          <label>
            <input type="radio" name="direct" value="직거래 불가" onChange={e => { setSelectedDirect(e.target.value); setFormData(prev => ({...prev, place: ''})); }} checked={selectedDirect === "직거래 불가"} />
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
            name="dealCount" 
            value={formData.dealCount} 
            onChange={(e) => {
              const value = parseInt(e.target.value); 
              if (value < 1) { 
                alert("1개 이상을 입력해주세요."); 
                setFormData(prev => ({
                  ...prev, 
                  dealCount: '1'
                })); 
              } else {
                handleChange(e); 
              } 
            }} 
            min="1" 
            placeholder="수량을 입력해주세요" 
            className="number-input" 
          />
        </div>
      </div>

      <br />
      <h6 className={`form-completion-message ${isFormComplete() ? 'complete' : 'incomplete'}`}>
        {isFormComplete() ? "이제 상품을 등록해보세요." : "모든 항목이 입력되어야 상품등록이 가능합니다"}
      </h6>

      <div className="button-group">
        <Button className={`submit-btn ${isFormComplete() ? 'submit-btn-enabled' : 'submit-btn-disabled'}`} variant="contained" disabled={!isFormComplete()} onClick={handleSubmit} sx={{ mt: 2, width: '180px', fontSize: '20px', bgcolor: isFormComplete() ? 'primary.main' : 'action.disabledBackground', '&:hover': { bgcolor: isFormComplete() ? 'primary.dark' : 'action.disabledBackground' }, boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)' }}>등록</Button>
        &nbsp;&nbsp;&nbsp;
        <Button className="cancel-btn" variant="contained" onClick={handleCancel} sx={{ mt: 2, width: '180px', fontSize: '20px' }}>취소</Button>
      </div>
      <br /><br />
    </div>
  );
}

export default Page;