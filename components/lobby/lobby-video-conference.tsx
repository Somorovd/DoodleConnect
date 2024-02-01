"use client";

import { useLobby } from "@/hooks/use-lobby";
import {
  TrackReference,
  useTracks,
  VideoTrack,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import Image from "next/image";

const LobbyVideoConference = () => {
  const users = useLobby((state) => state.users);
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  return (
    <>
      {tracks.map((track, i) => (
        <div
          key={`track-${i}`}
          className={i % 2 == 0 ? "col-start-1" : "col-start-3"}
        >
          {track.publication?.track?.isMuted ? (
            <div className="w-[200px] aspect-video border-2 border-black flex justify-center items-center">
              <Image
                src={users[track.participant.identity].imgUrl}
                alt={track.participant.identity}
                width={70}
                height={70}
                className="rounded-full"
              />
            </div>
          ) : (
            <VideoTrack
              trackRef={track as TrackReference}
              width={200}
              className="aspect-video -scale-x-100"
            />
          )}
        </div>
      ))}
    </>
  );
};

export default LobbyVideoConference;
