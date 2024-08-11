import { RiMicFill, RiMicOffFill } from "react-icons/ri";
import { FaVideo, FaVideoSlash } from "react-icons/fa";
import { IoExitOutline } from "react-icons/io5";

const Controls = ({ muted, playing, toggleAudio, toggleVideo, leaveRoom }) => {
  return (
    <div className="absolute flex justify-between bottom-5 left-0 right-0 mx-auto w-[300px]">
      <button
        className={`p-4 rounded-full text-white cursor-pointer ${
          muted ? "bg-blue-800" : "bg-white"
        }`}
        onClick={toggleAudio}
      >
        {muted ? (
          <RiMicOffFill size={20} />
        ) : (
          <RiMicFill size={20} fill="rgb(30 64 175 / var(--tw-bg-opacity))" />
        )}
      </button>
      <button
        className={`p-4 rounded-full text-white cursor-pointer ${
          playing ? "bg-white" : "bg-blue-800"
        }`}
        onClick={toggleVideo}
      >
        {playing ? (
          <FaVideo size={20} fill="rgb(30 64 175 / var(--tw-bg-opacity))" />
        ) : (
          <FaVideoSlash size={20} />
        )}
      </button>
      <button
        className="p-4 rounded-full text-white cursor-pointer bg-red-800 hover:opacity-70"
        onClick={leaveRoom}
      >
        <IoExitOutline size={20} />
      </button>
    </div>
  );
};

export default Controls;
