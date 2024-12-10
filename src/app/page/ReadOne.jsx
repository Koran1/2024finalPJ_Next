import Image from 'next/image';

function ReadOne(props) {
  return (
    <>
    <h2>Read-1</h2>
     <Image src="/images/tree-1.jpg" width={300} height={300} alt="tree" /> 
    </>
  );
}

export default ReadOne;