'use client'
import './write.css';
import React, { useState, useEffect } from 'react';
import { Button, TextareaAutosize } from '@mui/material';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import useAuthStore from '../../../../store/authStore';

function Page() {
  const LOCAL_API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
  const router = useRouter();
  const { isAuthenticated, token, user } = useAuthStore();
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    dealTitle: '',
    dealCategory: '기타 물품', //
    dealStatus: '미개봉(미사용)',
    dealDescription: '',
    dealPrice: '0',
    dealPackage: '배송비 포함',
    dealDirect: '직거래 불가',
    dealDirectContent: '',
    dealCount: '1',
    dealRegDate: new Date().toISOString(),
    priceOption: '나눔'
  });
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const checkFormValidity = () => {
      // 폼 유효성 검사
      const { dealTitle, dealDescription, dealPrice, dealCount, dealDirect, dealDirectContent } = formData;
      // 비어있는 항목이 있는지 확인
      let isValid = dealTitle.trim() !== '' && dealDescription.trim() !== '' && dealPrice !== '' && dealCount > 0;
      // 직거래 가능인 경우 직거래 가능지역 입력 확인
      if (dealDirect === "직거래 가능") {
        isValid = isValid && dealDirectContent.trim() !== '';
      }
      // 유효성 검사 결과 업데이트
      setIsFormValid(isValid);
    };
    //
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

    // 상품명 입력 길이 제한
    if (name === "dealTitle" && value.length > 40) {
      alert("상품명은 40자 이내로 입력 해주세요");
      return;
    }

    // 상품 설명 입력 길이 제한
    if (name === "dealDescription" && value.length > 200) {
      alert("상품설명은 200자 이내로 입력 해주세요");
      return;
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const isFormComplete = () => {
    return isFormValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated || !token) {
      alert('로그인이 필요합니다.');
      router.push('/user/login');
      return;
    }

    if (!isFormComplete()) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    const submitData = new FormData();

    // 판매자 정보 추가 (user 객체에서 정보 가져오기)
    if (user && user.userIdx && user.nickname) {
      submitData.append('dealSellerUserIdx', user.userIdx);
      submitData.append('dealSellerNick', user.nickname);
    } else {
      alert('사용자 정보를 찾을 수 없습니다.');
      return;
    }

    // 기본 데이터 추가
    Object.keys(formData).forEach(key => {
      if (key !== 'file' && key !== 'priceOption') {
        submitData.append(key, formData[key]);
      }
    });

    // 이미지 파일 추가
    let hasFiles = false;
    images.forEach((image, index) => {
      if (image && image.file) {
        submitData.append('file', image.file);
        hasFiles = true;
      }
    });

    if (!hasFiles) {
      alert('최소 1개 이상의 상품 이미지를 등록해주세요.');
      return;
    }

    try {
      const response = await axios.post(
        `${LOCAL_API_BASE_URL}/deal/write`,
        submitData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('서버 응답:', response.data);  // 응답 데이터 확인

      if (response.data.success) {
        const dealIdx = response.data.data;
        if (dealIdx) {
          alert('상품이 성공적으로 등록되었습니다.');
          router.push(`/deal/detail/${dealIdx}`);
        } else {
          alert('상품 등록은 완료되었으나, 상세 페이지로 이동할 수 없습니다.');
          router.push('/deal/dealMain');
        }
      } else {
        alert(response.data.message || '상품 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('상품 등록 중 오류 발생:', error);
      if (error.response) {
        if (error.response.status === 401) {
          useAuthStore.getState().logout();  // 401 에러 시 로그아웃 처리
          alert('로그인이 필요하거나 세션이 만료되었습니다.');
          router.push('/user/login');
          return;
        }
        console.log('에러 응답:', error.response.data);
        alert(`상품 등록 실패: ${error.response.data.message || '서버 오류가 발생했습니다.'}`);
      } else if (error.request) {
        alert('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
      } else {
        alert('요청 중 오류가 발생했습니다.');
      }
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
    setFormData(prev => ({
      ...prev,
      dealCategory: value
    }));
  };

  const handleStateChange = (value) => {
    setFormData(prev => ({
      ...prev,
      dealStatus: value
    }));
  };

  const handlePackageChange = (value) => {
    setFormData(prev => ({
      ...prev,
      dealPackage: value
    }));
  };

  const handleDirectChange = (value) => {
    setFormData(prev => ({
      ...prev,
      dealDirect: value,
      dealDirectContent: value === "직거래 불가" ? '' : prev.dealDirectContent
    }));
  };

  const handleDirectContentChange = (e) => {
    const { value } = e.target;

    // 직거래 가능지역 입력 길이 제한
    if (value.length > 40) {
      alert("직거래 가능지역은 40자 이내로 입력 해주세요");
      return;
    }

    setFormData(prev => ({
      ...prev,
      dealDirectContent: value
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

  const handlePriceOptionChange = (value) => {
    setFormData(prev => ({
      ...prev,
      priceOption: value,
      dealPrice: value === "나눔" ? '0' : prev.dealPrice
    }));
  };

  const handlePriceChange = (value) => {
    setFormData(prev => ({
      ...prev,
      dealPrice: value
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
                      X
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
              <input
                type="radio"
                name="category"
                value="텐트/타프"
                onChange={e => handleCategoryChange(e.target.value)}
                checked={formData.dealCategory === "텐트/타프"}
              />
              텐트/타프
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="침구류"
                onChange={e => handleCategoryChange(e.target.value)}
                checked={formData.dealCategory === "침구류"}
              />
              침구류
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="취사도구"
                onChange={e => handleCategoryChange(e.target.value)}
                checked={formData.dealCategory === "취사도구"}
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
                onChange={e => handleCategoryChange(e.target.value)}
                checked={formData.dealCategory === "식품/음료"}
              />
              식품/음료
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="의류/신발"
                onChange={e => handleCategoryChange(e.target.value)}
                checked={formData.dealCategory === "의류/신발"}
              />
              의류/신발
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="디지털기기"
                onChange={e => handleCategoryChange(e.target.value)}
                checked={formData.dealCategory === "디지털기기"}
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
                onChange={e => handleCategoryChange(e.target.value)}
                checked={formData.dealCategory === "휴대용품"}
              />
              휴대용품
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="위생용품"
                onChange={e => handleCategoryChange(e.target.value)}
                checked={formData.dealCategory === "위생용품"}
              />
              위생용품
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="안전/보안"
                onChange={e => handleCategoryChange(e.target.value)}
                checked={formData.dealCategory === "안전/보안"}
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
                onChange={e => handleCategoryChange(e.target.value)}
                checked={formData.dealCategory === "가방/스토리지"}
              />
              가방/스토리지
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="난방/화로"
                onChange={e => handleCategoryChange(e.target.value)}
                checked={formData.dealCategory === "난방/화로"}
              />
              난방/화로
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="뷰티/미용"
                onChange={e => handleCategoryChange(e.target.value)}
                checked={formData.dealCategory === "뷰티/미용" || !formData.dealCategory}
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
                onChange={e => handleCategoryChange(e.target.value)}
                checked={formData.dealCategory === "취미/게임"}
              />
              취미/게임
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="반려동물용품"
                onChange={e => handleCategoryChange(e.target.value)}
                checked={formData.dealCategory === "반려동물용품"}
              />
              반려동물용품
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="테이블/의자"
                onChange={e => handleCategoryChange(e.target.value)}
                checked={formData.dealCategory === "테이블/의자"}
              />
              테이블/의자
            </label>
          </p>
          <p>
            <label>
              <input
                type="radio"
                name="category"
                value="기타 물품"
                onChange={e => handleCategoryChange(e.target.value)}
                checked={formData.dealCategory === "기타 물품" || !formData.dealCategory}
              />
              기타 물품
            </label>
          </p>
        </div>
        <p style={{ color: 'red' }}>선택한 카테고리 : <span style={{ color: 'black', fontStyle: 'italic' }}>{formData.dealCategory || "기타 물품"}</span></p>
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
                onChange={e => handleStateChange(e.target.value)}
                checked={formData.dealStatus === "미개봉(미사용)" || !formData.dealStatus}
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
                onChange={e => handleStateChange(e.target.value)}
                checked={formData.dealStatus === "사용감 없음"}
              />
              사용감 없음 <span style={{ fontSize: '14px', color: 'gray' }}>사용은 했지만 사용한 흔적이나 얼룩이 없음</span>
            </label>
          </p>
          <p>
            <label>
              <input
                type="radio"
                name="state"
                value="사용감 적음"
                onChange={e => handleStateChange(e.target.value)}
                checked={formData.dealStatus === "사용감 적음"}
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
                onChange={e => handleStateChange(e.target.value)}
                checked={formData.dealStatus === "사용감 많음"}
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
                onChange={e => handleStateChange(e.target.value)}
                checked={formData.dealStatus === "고장/파손 있음"}
              />
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
          style={{ whiteSpace: 'pre-wrap' }}
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
              name="priceOption"
              value="가격 입력"
              onChange={e => handlePriceOptionChange(e.target.value)}
              checked={formData.priceOption === "가격 입력"}
            />
            가격 입력
          </label>
          <div className="form-group">
            <input
              type="number"
              placeholder="상품 가격을 입력해 주세요"
              name="dealPrice"
              value={formData.dealPrice}
              onChange={e => {
                // 소수점 제거 및 음수 입력 방지
                const value = Math.max(0, Math.floor(Number(e.target.value)));
                handlePriceChange(value.toString());
              }}
              onFocus={(e) => {
                if (e.target.value === '0') {
                  setFormData(prev => ({
                    ...prev,
                    dealPrice: ''
                  }));
                }
                handlePriceOptionChange("가격 입력");
              }}
              onBlur={(e) => {
                if (e.target.value === '') {
                  setFormData(prev => ({
                    ...prev,
                    dealPrice: '0'
                  }));
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.target.blur();
                }
              }}
              onWheel={(e) => e.target.blur()}
              min="0"
              step="1" // 정수 단위로만 입력 가능하도록 설정
              disabled={formData.priceOption === "나눔"}
            />
          </div>
          <label>
            <input
              type="radio"
              name="priceOption"
              value="나눔"
              onChange={e => handlePriceOptionChange(e.target.value)}
              checked={formData.priceOption === "나눔"}
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
              onChange={e => handlePackageChange(e.target.value)}
              checked={formData.dealPackage === "배송비 포함" || !formData.dealPackage}
            />
            배송비 포함
          </label>
          <label>
            <input
              type="radio"
              name="package"
              value="배송비 별도"
              onChange={e => handlePackageChange(e.target.value)}
              checked={formData.dealPackage === "배송비 별도"}
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
              onChange={(e) => handleDirectChange(e.target.value)}
              checked={formData.dealDirect === "직거래 가능"}
            />
            직거래 가능
          </label>
          <div className="form-group">
            <input
              type="text"
              placeholder="직거래 가능지역을 입력해 주세요"
              name="dealDirectContent"
              value={formData.dealDirectContent}
              onChange={handleDirectContentChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.target.blur();
                }
              }}
              disabled={formData.dealDirect === "직거래 불가"}
            />
          </div>
          <label>
            <input
              type="radio"
              name="direct"
              value="직거래 불가"
              onChange={e => handleDirectChange(e.target.value)}
              checked={formData.dealDirect === "직거래 불가"}
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
        <Button
          className={`submit-btn ${isFormComplete() ? 'submit-btn-enabled' : 'submit-btn-disabled'}`}
          variant="contained"
          disabled={!isFormComplete()}
          onClick={handleSubmit}
          sx={{
            mt: 2,
            width: '180px',
            fontSize: '20px',
            bgcolor: isFormComplete() ? 'primary.main' : 'action.disabledBackground',
            '&:hover': { bgcolor: isFormComplete() ? 'primary.dark' : 'action.disabledBackground' },
            boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'
          }}>등록</Button>
        &nbsp;&nbsp;&nbsp;
        <Button
          className="cancel-btn"
          variant="contained"
          onClick={handleCancel}
          sx={{
            mt: 2,
            width: '180px',
            fontSize: '20px',
            boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'
          }}>취소</Button>
      </div>
      <br /><br />
    </div>
  );
}

export default Page;