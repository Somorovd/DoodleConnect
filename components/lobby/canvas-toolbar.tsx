import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCanvas } from "@/hooks/use-canvas";

const colors = [
  "#ff0000",
  "#ff7f00",
  "#ffff00",
  "#00ff00",
  "#00ffff",
  "#0000ff",
  "#8f00ff",
  "#ff00ff",
  "#000000",
  "#ffffff",
];

const sizes = [1, 3, 5, 10, 15, 30, 50];

const CanvasToolbar = () => {
  const canvas = useCanvas();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button>⚙</button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-56 rounded-sm bg-white border-[1px] border-slate-400 py-4"
      >
        <h2 className="font-bold px-4">Settings</h2>
        <div className="h-[1px] m-[5px] bg-slate-400" />
        <section className="px-4">
          <div className="grid grid-cols-5 gap-2">
            {colors.map((c) => (
              <div key={c}>
                <div
                  onClick={() => canvas.setColor(c)}
                  className="aspect-square border-[1px] hover:border-[3px] border-black"
                  style={{
                    background: c,
                    border: canvas.color === c ? "3px solid" : "",
                  }}
                ></div>
              </div>
            ))}
          </div>
        </section>
        <div className="h-[1px] m-[5px] bg-slate-400" />
        <section className="px-4">
          <div className="grid grid-cols-7 gap-2">
            {sizes.map((s) => (
              <div key={`size-${s}`}>
                <div
                  onClick={() => canvas.setSize(s)}
                  className="flex justify-center items-center border-white hover:border-black border-[1px] rounded-sm h-full"
                  style={{
                    border: canvas.size === s ? "1px solid" : "",
                  }}
                >
                  <div
                    className="bg-black rounded-full"
                    style={{
                      width: s,
                      height: s,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </PopoverContent>
    </Popover>
  );
};

export default CanvasToolbar;
