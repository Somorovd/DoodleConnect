"use client";

import { useLobby } from "@/hooks/use-lobby";
import {
  TrackReference,
  TrackReferenceOrPlaceholder,
  useTracks,
  VideoTrack,
} from "@livekit/components-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Track } from "livekit-client";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { LobbyUser } from "@/models/user";
import { MicOff } from "lucide-react";

type UserTracksMap = {
  [id: string]: {
    user: LobbyUser;
    camera: TrackReferenceOrPlaceholder | null;
    microphone: TrackReferenceOrPlaceholder | null;
  };
};

const LobbyVideoConference = () => {
  const { user: self } = useUser();
  const [isHost, setIsHost] = useState(false);
  const [userTracks, setUserTracks] = useState<UserTracksMap>({});
  const users = useLobby((state) => state.users);
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.Microphone, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  useEffect(() => {
    if (!self?.id) return;

    const user = users[self.id];

    if (user) {
      setIsHost(user.isHost);
    } else {
      setIsHost(false);
    }
  }, [users, self]);

  useEffect(() => {
    const userTracksMap: UserTracksMap = {};

    tracks.forEach((track) => {
      const user = track.participant.identity;

      if (!userTracksMap[user]) {
        userTracksMap[user] = {
          user: users[user],
          camera: null,
          microphone: null,
        };
      }

      if (track.source === Track.Source.Camera) {
        userTracksMap[user].camera = track;
      } else if (track.source === Track.Source.Microphone) {
        userTracksMap[user].microphone = track;
      }
    });

    setUserTracks(userTracksMap);
  }, [tracks.length]);

  const kickUser = (user: LobbyUser) => {
    alert("Feature Coming Soon");
  };
  const makeHost = (user: LobbyUser) => {
    alert("Feature Coming Soon");
  };
  const leaveLobby = () => {
    alert("Feature Coming Soon");
  };

  return (
    <>
      {Object.values(userTracks).map(
        ({ user: trackUser, camera, microphone }, i) => {
          if (!trackUser) {
            return null;
          }
          return (
            <ContextMenu key={`track-${i}`}>
              <ContextMenuTrigger>
                <div className={i % 2 == 0 ? "col-start-1" : "col-start-3"}>
                  <div className="relative">
                    {camera?.publication?.track?.isMuted ? (
                      <div className="w-[200px] aspect-video border-2 border-black flex justify-center items-center">
                        <Image
                          src={trackUser.imgUrl}
                          alt={trackUser.username}
                          width={70}
                          height={70}
                          className="rounded-full"
                        />
                      </div>
                    ) : (
                      <VideoTrack
                        trackRef={camera as TrackReference}
                        width={200}
                        className="aspect-video -scale-x-100"
                      />
                    )}
                    {microphone?.publication?.track?.isMuted ? (
                      <div className="absolute bottom-2 right-2 bg-red-400 w-[30px] aspect-square flex justify-center items-center rounded-full">
                        <MicOff width={15} />
                      </div>
                    ) : null}
                  </div>
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                {isHost && trackUser.id !== self?.id && (
                  <>
                    <ContextMenuItem onSelect={() => kickUser(trackUser)}>
                      Kick User
                    </ContextMenuItem>
                    <ContextMenuItem onSelect={() => makeHost(trackUser)}>
                      Make Host
                    </ContextMenuItem>
                  </>
                )}
                <ContextMenuItem onSelect={leaveLobby}>
                  Leave Lobby
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          );
        }
      )}
    </>
  );
};

export default LobbyVideoConference;
