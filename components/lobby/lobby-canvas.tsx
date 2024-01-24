import React, { useEffect, useRef, useState } from "react";
import CanvasToolbar from "./canvas-toolbar";
import { useCanvas } from "@/hooks/use-canvas";

const LobbyCanvas = () => {
  const color = useCanvas((state) => state.color);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  let isDrawing = false;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (context) {
      context.lineCap = "round";
      context.strokeStyle = color;
      context.lineWidth = 3;
      setContext(context);
    }
  }, []);

  useEffect(() => {
    if (context) {
      context.strokeStyle = color;
    }
  }, [color]);

  const startDrawing = ({
    nativeEvent,
  }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!context) return;
    const { offsetX: x, offsetY: y } = nativeEvent;
    context.beginPath();
    context.moveTo(x, y);
    isDrawing = true;
  };

  const endDrawing = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawing = false;
  };

  const movePos = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!context) return;
    const { offsetX: x, offsetY: y } = nativeEvent;
    context.moveTo(x, y);
  };

  const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!context || !isDrawing) return;
    const { offsetX: x, offsetY: y } = nativeEvent;
    context.lineTo(x, y);
    context.stroke();
    context.moveTo(x, y);
  };

  const setColor = (c: string) => {
    if (!context) return;
    context.strokeStyle = c;
  };

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
          className="border-2 border-black"
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
