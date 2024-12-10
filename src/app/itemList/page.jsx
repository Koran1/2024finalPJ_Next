"use client";
import { useEffect, useState } from "react";
import "./itemList.css";
import axios from "axios";
import { Divider, Grid2 } from "@mui/material";
import Link from "next/link";

export default function Page(props) {
  const MAKEUP_API_BASE_URL = process.env.NEXT_PUBLIC_MAKEUP_API_BASE_URL;
  const [list, setList] = useState([]);   // 배열을 받기 때문에 []
  // const API_URL = "https://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline";
  const API_URL = `${MAKEUP_API_BASE_URL}/v1/products.json?brand=maybelline`;
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null);     // 에러 상태

  // 데이터 가져오기
  const getData = async () => {
    try {
      setLoading(true)  // 로딩 시작
      const response = await axios.get(API_URL);
      setList(response.data.slice(0, 12));
    } catch (error) {
      console.error("Error fetching product data", error);
      setError("Failed to fetch product data.");
    } finally {
      setLoading(false);    // 로딩 종료
    }
  };

  // 처음 랜더링 끝난 후 최초 한번만 실행
  useEffect(() => {
    getData();
  }, []);

  // 로딩 중
  if (loading) {
    return <div style={{ textAlign: "center", padding: "20px" }}><strong>Loading...</strong></div>;
  }
  // 에러 발생 시
  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
        <h2>Error:</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ width: "80%", margin: "auto", padding: "20px" }}>
      <h2><b>BEST PRODUCTS</b></h2>
      <Divider />
      <Grid2 container spacing={2}>
        {list.map((k) => {
          // size={{ xs: 3 }}=>  전체 화면범위 12 에서 3개를 차지하자 (즉 한줄에 4개)
          return (
            <Grid2 key={k.id} size={{ xs: 3 }}>
              <Link href={'/view/' + k.id}>
                <img src={k.image_link} alt="product" className="img_item" />
                <strong>{k.name}</strong>
                <span className="text_info">
                  {k.category} &nbsp; &nbsp; {k.product_type}
                </span>
                <strong className="num_price">{k.price}</strong>
              </Link>
            </Grid2>
          );
        })}
      </Grid2>
    </div>
  );
}
