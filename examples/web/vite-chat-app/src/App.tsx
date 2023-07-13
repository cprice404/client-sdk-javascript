import { useState } from "react";
import { clearCurrentClient } from "./utils/momento-web";
import ChatRoom from "./components/chat-room";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [username, setUsername] = useState("");
  const [chatRoomSelected, setChatRoomSelected] = useState(false);
  const [usernameSelected, setUsernameSelected] = useState(false);

  const leaveChatRoom = () => {
    clearCurrentClient();
    setChatRoomSelected(false);
    setUsernameSelected(false);
    setTopic("");
    setUsername("");
  };

  if (!import.meta.env.VITE_MOMENTO_CACHE_NAME) {
    throw new Error("missing required env var VITE_MOMENTO_CACHE_NAME")
  }
  if (!import.meta.env.VITE_TOKEN_VENDING_MACHINE_URL) {
    throw new Error("missing required env var VITE_TOKEN_VENDING_MACHINE_URL")
  }

  if (!chatRoomSelected) {
    return (
      <div
        className={
          "flex h-full justify-center items-center flex-col bg-slate-300"
        }
      >
        <div>
          Select a chat room to join
        </div>
        <div className={"h-8"} />
        <div className={"w-48"}>
          <input
            className={"rounded-2xl w-full p-2"}
            placeholder={"chat room"}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        <div className={"h-8"} />
        <div className={"w-48"}>
          <button
            onClick={() => setChatRoomSelected(true)}
            disabled={!topic}
            className={
              "disabled:bg-slate-50 disabled:brightness-75 disabled:cursor-default rounded-2xl hover:cursor-pointer w-full bg-emerald-400 p-2 hover:brightness-75"
            }
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  if (!usernameSelected) {
    return (
      <div
        className={
          "flex h-full justify-center items-center flex-col bg-slate-300"
        }
      >
        <div className={"w-72 text-center"}>
          <div>
            Welcome to the <span className={"italic"}>{topic}</span> chat room!
          </div>
        </div>
        <div className={"h-4"} />
        <div className={"flex w-72 justify-center"}>
          <input
            className={"rounded-2xl p-2 w-60 items-center"}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={"username"}
          />
        </div>
        <div className={"h-4"} />
        <div className={"w-72 flex justify-center"}>
          <button
            onClick={() => setUsernameSelected(true)}
            disabled={!username}
            className={
              "disabled:bg-slate-50 disabled:brightness-75 disabled:cursor-default rounded-2xl hover:cursor-pointer w-24 bg-emerald-400 p-2 hover:brightness-75"
            }
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  return (
    <ChatRoom
      topicName={topic}
      cacheName={import.meta.env.MOMENTO_CACHE_NAME}
      username={username}
      onLeave={leaveChatRoom}
    />
  );
}