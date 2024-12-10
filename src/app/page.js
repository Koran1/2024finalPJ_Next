import Image from "next/image";
import img01 from "/public/images/coffee-blue.jpg";
// page.js는 필수이다 (생략 불가)
// 각 경로(/, /about, /content 등) 할 때 마다 페이지를 랜더링 하려면
// 해당 경로의 page.js 파일이 반드시 필요하다

// 자식컴포넌트
import ItemList from '../app/itemList/page.jsx'; // 경로를 실제 파일 구조에 맞게 조정하세요

export default function Home() {
  return (
    <>
      <ItemList />
    </>
  );
}
