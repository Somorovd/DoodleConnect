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
  const [ppos, setPpos] = useState<Position>({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socket = useLobbySocket();

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
    const { offsetX: x, offsetY: y, button } = nativeEvent;
    if (!context || menuOpen || button !== 0) return;
    context.beginPath();
    context.ellipse(x, y, 0, 0, 0, 0, 2 * Math.PI);
    context.stroke();
    setPpos({ x, y });
    context.moveTo(x, y);
    sendDrawEvent({ x, y }, { x, y });
    setIsDrawing(true);
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const movePos = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!context) return;
    const { offsetX: x, offsetY: y } = nativeEvent;
    setPpos({ x, y });
    // context.moveTo(x, y);
  };

  const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!context || !isDrawing) return;
    const { offsetX: x, offsetY: y } = nativeEvent;
    context.lineTo(x, y);
    context.stroke();
    sendDrawEvent(ppos, { x, y });
    context.moveTo(x, y);
    setPpos({ x, y });
  };

  useEffect(() => {
    if (!socket) console.log("missing socket");
    if (!context) console.log("missing context");

    if (!socket || !context) return;

    const onSync = (msg: LobbyEventMessage<LobbyEvent.Sync>) => {
      for (let line of msg.data.lines) {
        onDrawLine({
          data: { ...line },
        } as LobbyEventMessage<LobbyEvent.DrawLine>);
      }
    };

    const onDrawLine = (msg: LobbyEventMessage<LobbyEvent.DrawLine>) => {
      console.log("Here -- drawing line. Context: ", context, "Message: ", msg);
      context.beginPath();
      context.strokeStyle = msg.data.color;
      context.lineWidth = msg.data.size;
      context.moveTo(msg.data.from.x, msg.data.from.y);
      context.lineTo(msg.data.to.x, msg.data.to.y);
      context.stroke();

      context.beginPath();
      context.strokeStyle = color;
      context.lineWidth = size;
      context.moveTo(ppos.x, ppos.y);
    };

    const onMessage = (event: WebSocketEventMap["message"]) => {
      const msg: LobbyEventMessage<any> = JSON.parse(event.data);
      console.log(`Canvas Recieved ${msg.event}`);
      switch (msg.event) {
        case LobbyEvent.DrawLine:
          onDrawLine(msg);
          break;
        case LobbyEvent.Sync:
          onSync(msg);
          break;
      }
    };

    console.log("adding event listener");
    socket.addEventListener("message", onMessage);
    return () => socket.removeEventListener("message", onMessage);
  }, [socket]);

  useEffect(() => {
    console.log("canvasRef", canvasRef);
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
  }, [canvasRef, canvasRef.current]);

  useEffect(() => {
    if (context) {
      context.strokeStyle = color;
      context.fillStyle = color;
      context.lineWidth = size;
    }
  }, [context, color, size]);

  return (
    <>
      <div className="relative h-fit w-fit">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          /*
          Problems on onMouseEnter because sometimes it will return the coordinated relative to the
          parent container sometimes, which causes streaks on the canvas. (when context.moveTo is uncommented in movePos)
          */
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
