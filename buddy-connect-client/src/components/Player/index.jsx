import { FaUser } from "react-icons/fa";
import { RiMicFill, RiMicOffFill } from "react-icons/ri";
import ReactPlayer from "react-player";

const Player = ({ playerId, url, muted, playing, isActive }) => {
  return (
    <div
      className={`relative overflow-hidden mb-5 h-full w-fit ${
        isActive
          ? "rounded-lg"
          : "rounded-md h-min w-[200px] shadow-[0px_0px_11px_-1px_rgba(0,0,0,0.75)]"
      }`}
    >
      {playing ? (
        <ReactPlayer
          key={playerId}
          url={url}
          muted={muted}
          playing={playing}
          height="100%"
          width={"fit-content"}
        />
      ) : (
        <div
          className={`h-full bg-black ${
            isActive ? "w-[730px]" : "w-[200px]"
          } flex items-center justify-center`}
        >
          <FaUser fill="#5A5A5A" size={200} />
        </div>
      )}
      {!isActive ? (
        <button>
          {muted ? (
            <RiMicOffFill
              className={"text-white absolute right-2 bottom-2"}
              size={20}
            />
          ) : (
            <RiMicFill
              className={"text-white absolute right-2 bottom-2"}
              size={20}
            />
          )}
        </button>
      ) : undefined}
    </div>
  );
};

export default Player;
