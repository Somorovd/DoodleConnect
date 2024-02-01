import type { ToggleSource } from "@livekit/components-core";
import { TrackToggleProps, useTrackToggle } from "@livekit/components-react";
import { Track } from "livekit-client";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import React from "react";

export const getSourceIcon = (
  source: ToggleSource,
  enabled: boolean
): React.JSX.Element | null => {
  switch (source) {
    case Track.Source.Camera:
      return enabled ? <Video /> : <VideoOff />;
    case Track.Source.Microphone:
      return enabled ? <Mic /> : <MicOff />;
    default:
      return null;
  }
};

export function LobbyTrackToggle<T extends ToggleSource>({
  showIcon,
  ...props
}: TrackToggleProps<T>) {
  const { buttonProps, enabled } = useTrackToggle(props);
  return (
    <button
      {...buttonProps}
      className="flex gap-2 p-2 border-2 border-black rounded-full font-bold"
      style={{ background: enabled ? "#ffffff" : "#cc5555" }}
    >
      <span>
        {props.source.charAt(0).toUpperCase() + props.source.slice(1)}
      </span>
      {(showIcon ?? true) && getSourceIcon(props.source, enabled)}
    </button>
  );
}
