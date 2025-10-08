"use client";

import { useEffect } from "react";
import Image from "next/image";

const Page = () => {
  useEffect(() => {
    document.title = "About | Vaultify";
  }, []);

  return (
    <div className="flex flex-col items-center w-full h-[90vh]">
      <Image
        src="/under-construction.png"
        alt="Under Construction"
        className="w-auto h-100"
      />
      <div className="marquee-container">
        <div className="marquee">
          <h1 className="text-4xl font-bold poppins text-center whitespace-nowrap">
            🚧 This page is under construction 🚧 This page is under
            construction 🚧 This page is under construction 🚧
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Page;
