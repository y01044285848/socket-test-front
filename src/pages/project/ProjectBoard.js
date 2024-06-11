import { useEffect, useState } from "react";
import "../../styles/projectList.scss";
import Navbar from "../../components/project/kanban/Navbar";
import Board from "../../components/project/kanban/Board";
// import data from '../data'
import { DragDropContext } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import Editable from "../../components/project/kanban/Editable";
import useLocalStorage from "use-local-storage";

import DefaultLayout from '../../layouts/DefaultLayout'
import axios from "axios";

import url from '../../config/url';
import { useSelector } from "react-redux";



//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function ProjectBoard() {

  const authSlice = useSelector((state) => state.authSlice);
  
  const [data, setData] = useState(
    localStorage.getItem("kanban-board")
      ? JSON.parse(localStorage.getItem("kanban-board"))
      : []
  );

  const defaultDark = window.matchMedia(
    "(prefers-colors-scheme: dark)"
  ).matches;
  const [theme, setTheme] = useLocalStorage(
    "theme",
    defaultDark ? "dark" : "light"
  );

  const switchTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const setName = (title, bid) => {
    const index = data.findIndex((item) => item.id === bid);
    const tempData = [...data]; 
    tempData[index].boardName = title;
    setData(tempData);
  };

  const dragCardInBoard = (source, destination) => {
    let tempData = [...data];
    const destinationBoardIdx = tempData.findIndex(
      (item) => item.id.toString() === destination.droppableId
    );
    const sourceBoardIdx = tempData.findIndex(
      (item) => item.id.toString() === source.droppableId
    );
    tempData[destinationBoardIdx].card.splice(
      destination.index,
      0,
      tempData[sourceBoardIdx].card[source.index]
    );
    tempData[sourceBoardIdx].card.splice(source.index, 1);

    return tempData;
  };


  const addCard = (title, bid) => {

    /*
    console.log(title +"이거 확인~")
    const index = data.findIndex((item) => item.id === bid);
    const tempData = [...data];
  
    console.log(index +"here~~")
    console.log(tempData +"here~~")

    tempData[index].card.push({
      id: uuidv4(),
      title: title,
      tags: [],
      task: [],
    });
    setData(tempData);
    */

    //1. title 넣기 + board부터 들고오세요~ 
    /*  */
    const urlParams = new URLSearchParams(window.location.search);
    const projectNo = urlParams.get('projectNo');

    const insertCard = {titleName : title ,
      createUserId : authSlice.username , 
      projectNo : projectNo, 
      boardNo : 1, //나중에는 board를 select해 와서 꼭 해당하는 pk값으로 넣어주기~
    };
    axios.post(url.backendUrl+'/project/insertCard', insertCard).then((resp) =>{
      console.log(resp.data);
    })
    
  };

  const removeCard = (boardId, cardId) => {
    const index = data.findIndex((item) => item.id === boardId);
    const tempData = [...data];
    const cardIndex = data[index].card.findIndex((item) => item.id === cardId);

    tempData[index].card.splice(cardIndex, 1);
    setData(tempData);
  };

  //보드 포지션 / 보드 추가
  const lastBoardPosition = data.length > 0 ? Math.max(...data.map(board => board.boardPosition)) : 0;
  const addBoard = (title) => {

    const urlParams = new URLSearchParams(window.location.search);
    const projectNo = urlParams.get('projectNo');

    const newBoard = {
      boardNo: uuidv4(),
      projectNo : projectNo,
      boardTitle: title,
      createUserId: authSlice.username,
      boardPosition: lastBoardPosition,
    };
  
    // 새로운 보드를 tempData에 추가
    const tempData = [...data, newBoard];
  
    // Board 추가시 DB 저장
    axios.post(`${url.backendUrl}/project/boardinsert`, newBoard)
      .then(res => {
        console.log("프로젝트 등록");
        
        setData(prevData => [...prevData, res.data]);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const removeBoard = (bid) => {
    const tempData = [...data];
    const index = data.findIndex((item) => item.id === bid);
    tempData.splice(index, 1);
    setData(tempData);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId) return;

    setData(dragCardInBoard(source, destination));
  };

  const updateCard = (bid, cid, card) => {
    const index = data.findIndex((item) => item.id === bid);
    if (index < 0) return;

    const tempBoards = [...data];
    const cards = tempBoards[index].card;
    
    const cardIndex = cards.findIndex((item) => item.id === cid);
    if (cardIndex < 0) return;

    tempBoards[index].card[cardIndex] = card;
    console.log(tempBoards);
    setData(tempBoards);

    console.log("Index위치 확인 : " +cardIndex);
  };

  

  useEffect(() => {
    localStorage.setItem("kanban-board", JSON.stringify(data));
  }, [data]); //콘솔에 로컬 스토리지 저장된 데이터

  const storedData = JSON.parse(localStorage.getItem("kanban-board"));

  console.log("로컬데이터 확인 : ");
  console.log(storedData);


  return (
    <div>
      <DefaultLayout>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="KanBanBoard" data-theme={theme}>
            <Navbar switchTheme={switchTheme} />
            <div className="app_outer">
              <div className="app_boards">
                {data.map((item) => (
                  <Board
                    key={item.id}
                    id={item.id}
                    name={item.boardName}
                    card={item.card}
                    setName={setName}
                    addCard={addCard}
                    removeCard={removeCard}
                    removeBoard={removeBoard}
                    updateCard={updateCard}
                  />
                ))}
                <Editable
                  class={"add__board"}
                  name={"Add Board"}
                  btnName={"Add Board"}
                  onSubmit={addBoard}
                  placeholder={"Enter Board  Title"}
                />
              </div>
            </div>
          </div>
        </DragDropContext>
      </DefaultLayout>
    </div>
  );
}

export default ProjectBoard;
