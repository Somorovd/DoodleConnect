"use client";

import { useLobby } from "@/hooks/use-lobby";
import { useUser } from "@clerk/nextjs";
import {
  ControlBar,
  TrackReference,
  TrackToggle,
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
    <div className="flex flex-col space-y-1">
      {tracks.map((track, i) =>
        track.publication?.track?.isMuted ? (
          <div
            key={`track-${i}`}
            className="w-[200px] aspect-video border-4 border-black flex justify-center items-center"
          >
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
            key={`track-${i}`}
            trackRef={track as TrackReference}
            width={200}
            className="aspect-video -scale-x-100"
          />
        )
      )}
      <div className="flex space-x-6">
        <TrackToggle source={Track.Source.Microphone} showIcon={true} />
        <TrackToggle source={Track.Source.Camera} showIcon={true} />
      </div>
      {/* <ControlBar
        controls={{
          microphone: true,
          camera: true,
          leave: false,
          screenShare: false,
        }}
        variation="minimal"
      /> */}
    </div>
  );
};

export default LobbyVideoConference;
