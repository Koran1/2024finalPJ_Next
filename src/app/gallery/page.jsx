import Image from 'next/image';
import img01 from "/public/images/coffee-blue.jpg"
import img02 from "/public/file.svg"
import img03 from "/public/images/tree-3.jpg"
import './gallery.css'

function Page(props) {
  return (
    <>
      <tbody>
        <tr>
          <td><Image src={img01} alt="1"  width={100} height={100} /></td>
          <td><Image src={img02} alt="2"  width={100} height={100} /></td>
          <td><Image src={img03} alt="3"  width={100} height={100} /></td>
        </tr>
        <tr>
          <td><Image src="/images/tree-4.jpg" alt="4" width={100} height={100} /></td>
          <td><Image src="/images/tree-1.jpg" alt="5" width={100} height={100} /></td>
          <td><Image src="/images/tree-2.jpg" alt="6" width={100} height={100} /></td>
        </tr>
      </tbody>
    </>
  );
}

export default Page;