import React, { useEffect, useRef, useState } from "react";
import CanvasToolbar from "./canvas-toolbar";
import { useCanvas } from "@/hooks/use-canvas";
import { useLobbySocket } from "@/hooks/use-lobby-socket";
import { LobbyEvent, LobbyEventMessage } from "@/party/lobby";
import { Position } from "@/types";

const LobbyCanvas = () => {
  const { color, size, menuOpen } = useCanvas();
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socket = useLobbySocket();

  let ppos: Position = { x: 0, y: 0 };

  const sendDrawEvent = (from: Position, to: Position) => {
    const msg: LobbyEventMessage<LobbyEvent.DrawLine> = {
      event: LobbyEvent.DrawLine,
      data: {
        color,
        size,
        from,
        to,
      },
    };
    socket.send(JSON.stringify(msg));
  };

  const startDrawing = ({
    nativeEvent,
  }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!context || menuOpen) return;
    const { offsetX: x, offsetY: y } = nativeEvent;
    context.beginPath();
    context.ellipse(x, y, 0, 0, 0, 0, 2 * Math.PI);
    context.stroke();
    setIsDrawing(true);
    ppos = { x, y };
    context.moveTo(x, y);
    sendDrawEvent({ x, y }, { x, y });
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const movePos = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!context) return;
    const { offsetX: x, offsetY: y } = nativeEvent;
    ppos = { x, y };
  };

  const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!context || !isDrawing) return;
    const { offsetX: x, offsetY: y } = nativeEvent;
    context.lineTo(x, y);
    context.stroke();
    sendDrawEvent(ppos, { x, y });
    context.moveTo(x, y);
    ppos = { x, y };
  };

  useEffect(() => {
    if (!socket) return;

    const onMessage = (event: WebSocketEventMap["message"]) => {
      const msg: LobbyEventMessage<LobbyEvent.DrawLine> = JSON.parse(
        event.data
      );
      if (msg.event !== LobbyEvent.DrawLine || !context) return;

      // TODO: test how this works while in the middle of drawing
      // dont want message to interupt the current line

      context.strokeStyle = msg.data.color;
      context.lineWidth = msg.data.size;
      context.beginPath();
      context.moveTo(msg.data.from.x, msg.data.from.y);
      context.lineTo(msg.data.to.x, msg.data.to.y);
      context.stroke();

      context.strokeStyle = color;
      context.lineWidth = size;
      context.beginPath();
      context.moveTo(ppos.x, ppos.y);
    };

    socket.addEventListener("message", onMessage);
    return () => socket.removeEventListener("message", onMessage);
  }, [socket]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (context) {
      context.lineCap = "round";
      setContext(context);
    }

    const handleMouse = (event: MouseEvent) => {
      if (!canvas?.contains(event.target as Node)) {
        endDrawing();
      }
    };

    document.addEventListener("mousedown", handleMouse);
    document.addEventListener("mouseup", handleMouse);

    return () => {
      document.removeEventListener("mousedown", handleMouse);
      document.removeEventListener("mouseup", handleMouse);
    };
  }, []);

  useEffect(() => {
    if (context) {
      context.strokeStyle = color;
      context.fillStyle = color;
      context.lineWidth = size;
    }
  }, [context, color, size]);

  return (
    <>
      <div className="relative">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseEnter={movePos}
          onMouseOut={draw}
          className="border-2 border-black cursor-crosshair"
          width={600}
          height={600}
        />
        <div className="absolute top-[5px] right-[5px]">
          <CanvasToolbar />
        </div>
      </div>
    </>
  );
};

export default LobbyCanvas;
