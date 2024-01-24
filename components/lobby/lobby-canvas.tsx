import React, { useEffect, useRef, useState } from "react";
import CanvasToolbar from "./canvas-toolbar";
import { useCanvas } from "@/hooks/use-canvas";

const LobbyCanvas = () => {
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { color, size, menuOpen } = useCanvas();

  let isDrawing = false;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (context) {
      context.lineCap = "round";
      setContext(context);
    }
  }, []);

  useEffect(() => {
    if (context) {
      context.strokeStyle = color;
      context.fillStyle = color;
      context.lineWidth = size;
    }
  }, [context, color, size]);

  const startDrawing = ({
    nativeEvent,
  }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!context || menuOpen) return;
    const { offsetX: x, offsetY: y } = nativeEvent;
    context.beginPath();
    context.moveTo(x, y);
    context.ellipse(x, y, 0, 0, 0, 0, 2 * Math.PI);
    context.stroke();
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
