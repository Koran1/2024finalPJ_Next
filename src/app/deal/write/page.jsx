'use client'
import './write.css';
import React, { useState, useEffect } from 'react';
import { Button, TextareaAutosize } from '@mui/material';
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

  const MAX_TOTAL_SIZE = 5 * 1024 * 1024; // 4MB
  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 이미지 파일 유효성 검사
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 개별 파일 크기 제한 검사
    if (file.size > MAX_FILE_SIZE) {
      alert('이미지 파일의 용량은 최대 1MB를 초과할 수 없습니다.');
      return;
    }

    // 현재 이미지 크기 합계 계산
    const currentTotalSize = images.reduce((total, img) => {
      return total + (img ? img.file.size : 0);
    }, 0);

    // 새로운 파일 크기 합계 계산
    const newTotalSize = currentTotalSize + file.size;

    // 파일 크기 제한 검사
    if (newTotalSize > MAX_TOTAL_SIZE) {
      alert('이미지 파일 용량들의 합은 최대 5MB를 초과할 수 없습니다.');
      return;
    }

    // 이미지 미리보기 URL 생성
    const imageUrl = URL.createObjectURL(file);
    
    // input의 index 찾기
    const index = parseInt(e.target.id.split('-')[2]);
    
    // 이미지 배열 업데이트
    setImages(prev => {
      const newImages = [...prev];
      newImages[index] = {
        file: file,
        preview: imageUrl
      };
      return newImages;
    });

    // FormData 업데이트
    setFormData(prev => ({
      ...prev,
      file: file
    }));
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
      alert('모든 항목을 입력해주세요.');
      return;
    }

    const submitData = new FormData();
    
    // console.log(images);

    // // 이미지 경로들을 배열로 만들어서 전송
    // const imagePaths = images
    //   .filter(img => img !== null)
    //   .map(img => img.path);
    
    // submitData.append('imagePaths', JSON.stringify(imagePaths));

    // 나머지 폼 데이터 추가
    Object.keys(formData).filter(key => key !== 'file').forEach(key => {
      submitData.append(key, formData[key]);
    });

    // 실제 파일들도 추가
    // images.forEach((image, index) => {
    //   if (image && image.file) {
    //     submitData.append('file', image);
    //   }
    // });
    // submitData.append('file', images);

    images.forEach((image) => {
      console.log(image);
      submitData.append('file', image.file);
    });

    console.log(submitData);
    const response = await fetch(`${LOCAL_API_BASE_URL}/deal/write`, {
      method: 'POST',
      body: submitData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: '서버 응답 오류'
      }));
      throw new Error(errorData.message || '상품 등록에 실패했습니다.');
    }

    alert('상품이 성공적으로 등록되었습니다.');
    router.push('/deal/dealMain');
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
      dealPlace: value === "직거래 불가" ? '' : prev.dealPlace
    }));
  };

  const handleImageDelete = (index) => {
    // 해당 input의 value를 초기화
    const inputElement = document.getElementById(`image-upload-${index}`);
    if (inputElement) {
      inputElement.value = '';
    }
    
    // 이미지 상태 업데이트
    setImages(prev => {
      const newImages = [...prev];
      newImages[index] = null;
      return newImages;
    });
  };

  return (
    <div className="pd-reg-container">
      <h2 className="title">상품정보</h2>
      <br />
      <div className="image-upload-section">
        <h4>상품 이미지</h4>
        <hr />
        <div className="image-preview-container">
          {[...Array(5)].map((file, index) => (
            <div 
              key={index} 
              className="image-preview-box"
              style={{ cursor: 'pointer' }}
            >
              <div 
                onClick={() => document.getElementById(`image-upload-${index}`).click()}
                style={{ 
                  width: '100%', 
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                <input
                  id={`image-upload-${index}`}
                  type="file"
                  name="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                {images[index] ? (
                  <>
                    <img 
                      src={images[index].preview}
                      alt={`상품 이미지 ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <button
                      className="delete-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageDelete(index);
                      }}
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <div className="upload-placeholder">+</div>
                )}
              </div>
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
          name="dealTitle" 
          value={formData.dealTitle} 
          onChange={handleChange}
          onFocus={(e) => e.target.placeholder = ''}
          onBlur={(e) => e.target.placeholder = '상품명을 입력해 주세요'}
        />
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
              <input type="radio" name="category" value="식품/음료" onChange={e => setSelectedCategory(e.target.value)} checked={selectedCategory === "식품/음료"} />
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
              <input type="radio" name="category" value="테이블/의자" onChange={e => setSelectedCategory(e.target.value)} checked={selectedCategory === "테이블/의자"} />
              테이블/의자
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
              사용감 없음 <span style={{ fontSize: '14px', color: 'gray' }}>사용은 했지만 사용한 흔적이나 얼룩이 없음</span>
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
        <TextareaAutosize 
          className="description-textarea" 
          placeholder={`브랜드, 모델명, 구매 시기, 하자 유무 등 상품 설명을 최대한 자세히 적어주세요.
전화번호, SNS 계정 등 개인정보 기재 시 피해가 발생 할 수 있으니 주의해주세요.
욕설, 비방, 혐오 발언 등 부적절한 표현은 사전 통보 없이 삭제될 수 있습니다.
안전하고 건전한 거래 문화 조성을 위해 협조 해주시기 바랍니다.`}
          minRows={5}
          maxRows={5}
          name="dealDescription"
          value={formData.dealDescription}
          onChange={handleChange}
          onFocus={(e) => e.target.placeholder = ''}
          onBlur={(e) => e.target.placeholder = `브랜드, 모델명, 구매 시기, 하자 유무 등 상품 설명을 최대한 자세히 적어주세요.
전화번호, SNS 계정 등 개인정보 기재 시 피해가 발생 할 수 있으니 주의해주세요.
욕설, 비방, 혐오 발언 등 부적절한 표현은 사전 통보 없이 삭제될 수 있습니다.
안전하고 건전한 거래 문화 조성을 위해 협조 해주시기 바랍니다.`}
        />
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
              onFocus={(e) => {
                if (e.target.value === '0') {
                  setFormData(prev => ({
                    ...prev,
                    dealPrice: ''
                  }));
                }
              }}
              onBlur={(e) => {
                if (e.target.value === '') {
                  setFormData(prev => ({
                    ...prev,
                    dealPrice: '0'
                  }));
                }
              }}
              disabled={selectedPrice === "나눔"}
            />
          </div>
          <label>
            <input type="radio" name="price" value="나눔" onChange={e => { setSelectedPrice(e.target.value); setFormData(prev => ({ ...prev, price: '0' })); }} checked={selectedPrice === "나눔"} />
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
            <input 
              type="radio" 
              name="direct" 
              value="직거래 가능" 
              onChange={(e) => handleDirectChange(e.target.value)} 
              checked={selectedDirect === "직거래 가능"} 
            />
            직거래 가능
          </label>
          <div className="form-group">
            <input 
              type="text" 
              placeholder="직거래 가능지역을 입력해 주세요" 
              name="dealPlace"
              value={formData.dealPlace || ''}
              onChange={handleChange} 
              disabled={selectedDirect === "직거래 불가"} 
            />
          </div>
          <label>
            <input 
              type="radio" 
              name="direct" 
              value="직거래 불가" 
              onChange={(e) => handleDirectChange(e.target.value)} 
              checked={selectedDirect === "직거래 불가"} 
            />
            직거래 불가
          </label>
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
            onFocus={(e) => {
              if (e.target.value === '1') {
                setFormData(prev => ({
                  ...prev,
                  dealCount: ''
                }));
              }
            }}
            onBlur={(e) => {
              if (e.target.value === '') {
                setFormData(prev => ({
                  ...prev,
                  dealCount: '1'
                }));
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