"use client";

import {
  TrackReference,
  useTracks,
  VideoTrack,
} from "@livekit/components-react";
import { Track } from "livekit-client";

const LobbyVideoConference = () => {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  return (
    <div className="flex flex-col space-y-1">
      {tracks.map((track, i) => (
        <VideoTrack
          key={`track-${i}`}
          trackRef={track as TrackReference}
          width={200}
          className="aspect-video -scale-x-100"
        />
      ))}
    </div>
  );
};

export default LobbyVideoConference;
