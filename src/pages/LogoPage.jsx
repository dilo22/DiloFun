import React from "react";
import { Gamepad2 } from "lucide-react";

export default function LogoPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020617]">
      
      <div className="flex items-center gap-6">

        <div className="flex h-44 w-44 items-center justify-center rounded-[2.5rem] bg-gradient-to-br from-purple-600 to-cyan-500">
          <Gamepad2 className="h-20 w-20 text-white" />
        </div>

        <h1 className="text-8xl font-black tracking-tight text-white">
          DILO <span className="text-cyan-400">FUN</span>
        </h1>

      </div>

    </div>
  );
}