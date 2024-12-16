import Link from 'next/link';
import './dealMain.css';

const Page = () => {
  return (
    <div>
      <h1>나의거래 Main</h1>
      <Link href="/deal/write">상품등록</Link>
      <br />
      <Link href="/deal/detail">상품상세</Link>
    </div>
  );
};

export default Page;