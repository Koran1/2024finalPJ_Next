import Image from 'next/image';

function layout({children}) {
  return (
    <>
      <h3>CREATE 부모 컴포넌트 시작</h3>
      {children}
      <h3>CREATE 부모 컴포넌트 끝</h3>
    </>
  );
}

export default layout;