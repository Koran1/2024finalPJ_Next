import Image from 'next/image';

function Page(props) {
  return (
    <>
      <h2>Children Page</h2> 
      <p><Image src="/images/tree-2.jpg" width={100} height={100} alt="" /></p>
    </>
  );
}

export default Page;