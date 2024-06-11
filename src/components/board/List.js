import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import useCates from "../../hooks/useCates";
import { useSelector } from "react-redux";
import axios from "axios";
import Page from "./Page";
import { formatters } from "date-fns";
import url from "../../config/url";

const initState = {
  dtoList: [],
  cate: "",
  pg: 0,
  size: 0,
  total: 0,
  start: 0,
  end: 0,
  prev: false,
  next: false,
};

const List = () => {
  const [board, cate] = useCates();
  const authSlice = useSelector((state) => state.authSlice);
  const [searchParams] = useSearchParams();
  const pg = searchParams.get("pg") || 1;
  const [serverData, setServerData] = useState(initState);
  const isAdmin = authSlice.role === "admin"; // 사용자의 권한이 admin인지 확인

  useEffect(() => {
    axios
      .get(url.backendUrl + `/board/list?cate=${cate}&pg=${pg}`, {
        headers: { Authorization: `Bearer ${authSlice.accessToken}` },
      })
      .then((resp) => {
        console.log(resp.data);
        setServerData(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [cate, pg]); // pg값이나 cate값이 변경이 되면 useEffect가 실행

  useEffect(() => {
    console.log("board:", board);
    console.log("cate:", cate);
  }, [board, cate]);

  return (
    <>
      <div className="Board">
        <div className="freeBoard">
          <div className="commu_title">
            <div className="ctext">
              <h2>일름보 커뮤니티</h2>
              <p>일름보 사원들을 위한 커뮤니티 공간입니다.</p>
            </div>
            <div className="cimg">
              <img src="../images/community.png" alt="커뮤니티"></img>
            </div>
          </div>

          <div className="cate">
            <Link to="/board/list?cate=all">전체 ⩗</Link>
            <Link to="/board/list?cate=notice">공지사항</Link>
            <Link to="/board/list?cate=daily">일상</Link>
            <Link to="/board/list?cate=report">신고합니다</Link>
          </div>

          <div className="search">
            <div className="first_div">
              <strong>검색 키워드</strong>
              <div className="selectBox">
                <select>
                  <option>제목</option>
                  <option>내용</option>
                  <option>제목+내용</option>
                </select>
              </div>
              <input type="text" placeholder="검색어를 입력하세요."></input>
              <button className="btn">
                <img src="../images/search-40.png"></img>
              </button>
            </div>
          </div>

          <div className="table">
            <div className="thead">
              <div className="no">번호</div>
              <div className="Btitle">제목</div>
              <div className="writer">작성자</div>
              <div className="rdate">작성일</div>
              <div className="hit">조회</div>
            </div>

            {serverData.dtoList.map((board, index) => (
              <div key={index} className="tr">
                <div className="td no">{serverData.startNo - index}</div>
                <div className="td Btitle">
                  <Link to={`/board/view/${board.cate}/${board.no}`}>
                    {board.title}
                  </Link>
                </div>
                <div className="td writer">{board.writer}</div>
                <div className="td rdate">
                  {board.rdate ? board.rdate.substring(0, 10) : ""}
                </div>
                <div className="td hit">{board.hit}</div>
              </div>
            ))}
          </div>
        </div>
        {/*table end */}

        <div
          className="writeBtn"
          style={{
            display: cate === "notice" ? "none" : "block",
          }}
        >
          <Link to={`/board/write?cate=${cate}`} className="btn btnWrite">
            글쓰기
          </Link>
        </div>

        <Page serverData={serverData} cate={cate} />
        {/*freeboard end */}
      </div>
    </>
  );
};

export default List;
