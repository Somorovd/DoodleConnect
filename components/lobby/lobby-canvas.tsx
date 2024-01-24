import React, { useEffect, useRef, useState } from "react";

type Position = { x: number; y: number };

const LobbyCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  let isDrawing = false;
  let ppos: Position = { x: 0, y: 0 };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (context) {
      context.lineCap = "round";
      context.strokeStyle = "black";
      context.lineWidth = 3;
      setContext(context);
    }
  }, []);

  const startDrawing = ({
    nativeEvent,
  }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!context) return;
    const { offsetX: x, offsetY: y } = nativeEvent;
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

  return (
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
  );
};

export default LobbyCanvas;
