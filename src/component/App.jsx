import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import ChatModal from './ChatModal';
function App() {
  //현재 연결 소켓 저장
  const [socket, setSocket] = useState(null);
  //유저이름
  const [userName, setUserName] = useState('');
  //현재 연결상태인지
  const [isConnected, setIsConnected] = useState(false);
  //유저의 채팅
  //채팅서버 접속 함수
  const [modal, setModal] = useState(false);
  const connectToChatServer = () => {
    if (!userName) return alert('유저이름을 입력해주세요');
    const _socket = io('ws://localhost:3000', {
      autoConnect: false,
      query: {
        userName: userName,
      },
    });
    _socket.connect();
    setSocket(_socket);
  };
  //채팅서버 연결 해재 함수

  //연결시 이벤트 함수
  const handleConnect = () => {
    console.log('프론트- 채팅서버 접속');
    setIsConnected(true);
  };
  //연결해제 시 이벤트 함수
  const handleDisconnect = () => {
    console.log('프론트- 채팅 연걸 해재');
    setIsConnected(false);
  };

  useEffect(() => {
    //랜더링시 이벤트리스너 부착
    console.log('이벤트리스너 부착');
    socket?.on('connect', handleConnect);
    socket?.on('disconnect', handleDisconnect);
    //클린업함수
    return () => {
      console.log('이벤트제거');
      socket?.off('connect', handleConnect);
      socket?.off('disconnect', handleDisconnect);
    };
    //소켓 변화시
  }, [socket]);

  return (
    <>
      {isConnected && <ChatModal socket={socket} userName={userName} />}
      <h1>미니 채팅방</h1>
      <h2>유저이름:{userName}</h2>

      <div>
        <input
          value={userName}
          onChange={(e) => {
            setUserName(e.target.value);
          }}
          placeholder="이름"
        />
        <button onClick={connectToChatServer}>채팅방 접속</button>
      </div>
    </>
  );
}

export default App;
