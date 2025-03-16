"use client";

import Image from "next/image";
import React from "react";


function Background() {
    return ( <div className="h-full w-full -z-10 absolute bg-zinc-950 ">
        <Image className="opacity-60 relative" priority fill src={"/background.jpg"} alt="Background"></Image>
    </div> );
}

export default Background;