import { useEffect, useRef, useState } from 'react';
import '../style/Modal.css';
export default function ChatModal({ socket, userName }) {
  //현재 유저의 메세지
  const [userInput, setUsetInput] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesRef = useRef(null);
  //현재 연결된 socket이 있을때 나가기 함수
  const disConnectToChatServer = () => {
    socket?.disconnect();
  };
  //esc키일때 모달 닫아주는 함수
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      disConnectToChatServer();
    }
  };
  //메세지 전송 함수
  const sendMessageToChatServer = () => {
    console.log(`프론트 메세지전송 input:${userInput}`);
    socket?.emit(
      'new message',
      { userInput: userInput, userName: userName },
      (res) => {
        console.log(res);
      }
    );
    setUsetInput('');
  };
  const onMessageReceived = (msg) => {
    console.log(msg);
    setMessages((previous) => [...previous, msg]);
  };
  //이벤트리스너 부착/해재
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    socket?.on('new message', onMessageReceived);
    return () => {
      socket?.off('new message', onMessageReceived);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [socket]);
  //스크롤이벤트
  useEffect(() => {
    const modalContent = messagesRef.current;
    modalContent.scrollTop = modalContent.scrollHeight;
  }, [messages]);
  //메세지생성

  return (
    <div className="modalBackGround">
      <div className="modal">
        <div className="modalHeader">
          <div>현재 접속 유저: {userName}</div>
          <button onClick={disConnectToChatServer} className="exitBtn">
            나가기
          </button>
        </div>
        <div className="messages" ref={messagesRef}>
          <ul>
            {messages.map((val, idx) => (
              <li key={idx}>
                {val.userName} : {val.message}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <input
            value={userInput}
            onChange={(e) => {
              setUsetInput(e.target.value);
            }}
            onKeyPress={(e) => {
              if (e.code === 'Enter') {
                sendMessageToChatServer();
              }
            }}
          />
          <button onClick={sendMessageToChatServer}>메세지 전송</button>
        </div>
      </div>
    </div>
  );
}
