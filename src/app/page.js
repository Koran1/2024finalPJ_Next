import Link from "next/link";
import Main from "./main/main";

export default function Home() {
  return (
    <>
      <Link href={"/book/write"}>예약 화면 임시</Link>
      <Main />
    </>
  );
}
