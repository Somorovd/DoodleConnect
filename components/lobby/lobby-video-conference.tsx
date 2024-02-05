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

    Object.keys(users).forEach((id) => {
      userTracksMap[id] = {
        user: users[id],
        camera: null,
        microphone: null,
      };
    });

    tracks.forEach((track) => {
      const user = track.participant.identity;
      if (!userTracksMap[user]) {
        console.warn(`User track present for missing user: ${user}`);
        return;
      }

      if (track.source === Track.Source.Camera) {
        userTracksMap[user].camera = track;
      } else if (track.source === Track.Source.Microphone) {
        userTracksMap[user].microphone = track;
      }
    });

    setUserTracks(userTracksMap);
  }, [users, tracks.length]);

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
      {Object.values(userTracks)
        .sort()
        .map(({ user: trackUser, camera, microphone }, i) => {
          if (!trackUser) {
            return null;
          }
          return (
            <div
              key={`track-${i}`}
              className={
                i % 2 == 0 ? "col-start-1 basis-1/2" : "col-start-3 basis-1/2"
              }
            >
              <ContextMenu>
                <ContextMenuTrigger>
                  <div className="relative">
                    {camera?.participant.isCameraEnabled ? (
                      <VideoTrack
                        trackRef={camera as TrackReference}
                        width={200}
                        className="aspect-video -scale-x-100"
                      />
                    ) : (
                      <div className="w-[200px] aspect-video border-2 border-black flex justify-center items-center">
                        <Image
                          src={trackUser.imgUrl}
                          alt={trackUser.username}
                          width={70}
                          height={70}
                          className="rounded-full"
                        />
                      </div>
                    )}
                    {microphone?.publication?.track?.isMuted ? (
                      <div className="absolute bottom-2 right-2 bg-red-400 w-[30px] aspect-square flex justify-center items-center rounded-full">
                        <MicOff width={15} />
                      </div>
                    ) : null}
                    <div className="absolute top-0 w-full min-h-full opacity-0 hover:opacity-100 flex flex-col justify-end overflow-hidden">
                      <div className="bg-white border-2 border-black text-sm px-[5px]">
                        {trackUser.username}
                      </div>
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
                  {trackUser.id === self?.id && (
                    <ContextMenuItem onSelect={leaveLobby}>
                      Leave Lobby
                    </ContextMenuItem>
                  )}
                </ContextMenuContent>
              </ContextMenu>
            </div>
          );
        })}
    </>
  );
};

export default LobbyVideoConference;
