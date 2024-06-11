import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useCates from "../../hooks/useCates";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import authSlice from "../../slices/authSlice";
import { useSelector } from "react-redux";
import url from "../../config/url";

const View = () => {
  const cate1 = useCates();
  // useCates의 두번째 값
  console.log("cate값:" + cate1[1]);
  const { cate, no } = useParams();
  const [board, setBoard] = useState(null);
  const navigate = useNavigate();
  const authSlice = useSelector((state) => state.authSlice);
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleReport = async () => {
    try {
      const response = await axios.post(
        `${url.backendUrl}/board/report`,
        {
          no: no, // 게시글 ID (게시글 번호)
          reason: reason, // 신고 사유
          uid: authSlice.username, // 신고한 사용자 ID
        },
        {
          headers: {
            Authorization: `Bearer ${authSlice.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("토큰: ", authSlice.accessToken);
      console.log("신고 사유:", reason);
      console.log("서버 응답:", response.data);
      alert("신고가 접수되었습니다.");
    } catch (error) {
      console.error("신고 중 오류 발생:", error);
      alert("신고에 실패하였습니다. 다시 시도해 주세요.");
    } finally {
      // 모달 닫기
      closeModal();
    }
  };

  useEffect(() => {
    console.log(url.backendUrl);

    console.log(`cate: ${cate}, no: ${no}`);

    axios
      .get(url.backendUrl + `/board/view/${cate}/${no}`, {
        headers: { Authorization: `Bearer ${authSlice.accessToken}` },
      })

      .then((response) => {
        console.log("response data:", response.data);
        setBoard(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [cate, no, authSlice.accessToken]);

  // 게시글 삭제
  const deleteHandler = async () => {
    const confirmed = window.confirm("정말 삭제하시겠습니까?");
    if (confirmed) {
      try {
        await axios.post(`${url.backendUrl}/board/delete/${cate}/${no}`, {
          headers: { Authorization: `Bearer ${authSlice.accessToken}` },
        });
        alert("게시글이 삭제되었습니다.");
        navigate(`/board/list?cate=${cate}`);
      } catch (error) {
        console.error("Failed to delete board:", error);
        alert("게시글 삭제에 실패하였습니다.");
      }
    }
  };

  if (!board) {
    return <div>Loading...</div>;
  }

  return (
    <div className="Board">
      <h2>
        {/*카테고리 값에 따라 게시판 제목 변경 */}
        <span>
          {" "}
          {cate === "notice"
            ? "📌 공지사항"
            : cate === "daily"
            ? "🌞 일상"
            : cate === "report"
            ? "🚨 신고합니다"
            : "커뮤니티 글보기"}
        </span>{" "}
      </h2>
      <div className="view">
        <div className="vTitle">
          <h3>{board.title}</h3>
          <div>
            <img src="/images/testAccount_50.png"></img>
            <div className="text">
              <p>{board.nick}</p>
              <p>{board.rdate ? board.rdate.substring(0, 10) : ""}</p>
            </div>
          </div>
        </div>
        {/*vTitle end */}
        <div className="vContent">
          <ReactQuill value={board.content} readOnly={true} theme={"bubble"} />
          <button className="reportBtn" onClick={openModal}>
            🚨신고
          </button>
          {/* 모달 */}
          {showModal && (
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={closeModal}>
                  X
                </span>
                <h2>게시글 신고하기</h2>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="신고 사유를 입력하세요."
                />
                <button className="rSubmit" onClick={handleReport}>
                  신고
                </button>
              </div>
            </div>
          )}
          {/*모달 end */}
        </div>
        {/*vContent end */}

        {/*🎈comment */}
        <form name="commentForm" className="commentForm">
          <input type="hidden" name="no" value={board.no} />
          <input type="hidden" name="cate" value={board.cate} />
          <h4>댓글</h4>
          <div className="comment">
            <span>{board.nick}</span>
            <br />
            <textarea placeholder="댓글을 남겨주세요."></textarea>
          </div>
          <div className="commentBtn">
            <input type="submit" name="submit" value="등록" />
            <button type="button">취소</button>
          </div>
        </form>
      </div>
      {/*view end */}

      <div className="vBtn">
        <div>
          <Link to={`/board/write?cate=${cate}`} className="writeBtn2">
            글쓰기
          </Link>
          <Link to={`/board/modify/${cate}/${no}`}>수정</Link>
          <input
            type="submit"
            value="삭제"
            onClick={deleteHandler}
            className="delBtn"
          ></input>
        </div>
        <div>
          <Link to={`/board/list?cate=${cate}`}>목록</Link>
          <Link to="#" className="topBtn">
            Top
          </Link>
        </div>
      </div>
    </div>
  );
};

export default View;
