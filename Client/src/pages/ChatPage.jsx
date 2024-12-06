import Sidebar from "../components/ChatSideBar/Sidebar";
import VideoLayout from "../components/VideoLayout/VideoLayout";
import "./style/ChatPage.css";

const ChatPage = () => {
  return (
    <div className="chatPage">
      <Sidebar />
      <VideoLayout />
    </div>
  );
};

export default ChatPage;
