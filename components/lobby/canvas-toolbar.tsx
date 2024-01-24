import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
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
];

const CanvasToolbar = () => {
  const canvas = useCanvas();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button>⚙</button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          className="w-56 rounded-sm bg-white border-[1px] border-slate-400 py-4"
        >
          <DropdownMenu.Label className="font-bold px-4">
            Settings
          </DropdownMenu.Label>
          <DropdownMenu.Group className="px-4">
            <div className="grid grid-cols-5 gap-2">
              {colors.map((c) => (
                <DropdownMenu.Item key={c}>
                  <div
                    onClick={() => canvas.setColor(c)}
                    className="aspect-square border-[1px] hover:border-[3px] border-black"
                    style={{ background: c }}
                  ></div>
                </DropdownMenu.Item>
              ))}
            </div>
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default CanvasToolbar;
