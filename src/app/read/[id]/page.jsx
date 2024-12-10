import ReadOne from '@/app/page/ReadOne';
import ReadThree from '@/app/page/ReadThree';
import ReadTwo from '@/app/page/ReadTwo';

async function Page({ params }) {
  const param = await params;       // async/await - JSON 데이터를 자동으로 변환
  const msg = param.id;
  console.log("msg : ", msg);
  let str = "";
  if(msg === '1'){
    str = "HTML 선택";
  } else if(msg === '2') {
    str = "CSS 선택";
  } else if(msg === '3') {
    str = "JAVASCRIPT 선택";
  }
  return (
    <>
      <h3>{str}</h3>
      <hr />
      <h3>{msg === '1' ? "html은 입문자용" : msg === '2' ? "css는 초급자용" : "js는 중급자용"}</h3>
      {msg === '1' ? <ReadOne /> : msg === '2' ? <ReadTwo /> : <ReadThree />}
    </>
  );
}

export default Page;