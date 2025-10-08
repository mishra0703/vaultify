'use client'

import Link from "next/link";
import { useSession } from "next-auth/react";

const features = [
  {
    title: "Strong Password Generator",
    desc: `Create complex, secure passwords instantly — because "1234" doesn't cut it anymore.`,
  },
  {
    title: "Add Notes for Context",
    desc: `Attach optional notes to remember account details, recovery hints, or usage info.`,
  },
  {
    title: "Smart Search",
    desc: `Find what you need in seconds, even in a mountain of saved credentials.`,
  },
  {
    title: "View, Edit & Delete Effortlessly",
    desc: `Your vault, your control. Manage your entries with one clean interface.`,
  },
  {
    title: "Client-Side Encryption",
    desc: `Your data never leaves your browser unencrypted. Even Vaultify can't peek.`,
  },
  {
    title: "Simple Authentication",
    desc: `A secure yet minimal login system that gets you inside — not in your way.`,
  },
];

export default function Page() {

  const {data: session} = useSession();
  
  return (
    <>
      <div className="w-full min-h-[90vh] flex flex-col items-center justify-center">
        <div className="title text-5xl max-sm:text-3xl text-center flex flex-col font-medium">
          <div>
            From <span className="font-black text-[#FF756A]">Forgetful</span> to{" "}
          </div>
          <div>
            <span className="font-black text-[#FF756A]">Fortified</span> in
            seconds
          </div>
        </div>
        <div className="sub-content poppins text-lg max-sm:text-xs max-sm:px-5 font-medium flex flex-col items-center my-8 tracking-wide">
          <span>
            Vaultify keeps your passwords safe, simple, and always within reach.
          </span>
          <span>
            Because remembering everything shouldn&apos;t be risky — it should be
            effortless.
          </span>
        </div>
        <div className="btns my-10 flex gap-8">
          <Link href={session ? "/password-manager" : "/register"}>
            <button className="try-btn poppins">Try Now</button>
          </Link>
          <Link href={'/about'}>
            <button className="try-btn poppins">Know More</button>
          </Link>
        </div>
        <div className="features-section w-full flex justify-center gap-5">
          {features.map((item, index) => (
            <div
              key={index}
              className="group [perspective:1000px] w-1/8 h-45 font-[Segoe_UI]"
            >
              <div className="relative w-full h-full text-center transition-transform duration-[600ms] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">

                <div className="absolute w-full h-full p-2 rounded-[2em] bg-[linear-gradient(45deg,rgba(122,90,248,0.75)_0%,rgba(213,197,255,0.85)_100%)] backdrop-blur-md shadow-md inset-0 [backface-visibility:hidden]">
                  <div className="flex items-center justify-center h-full text-2xl text-[#FF4079] text-shadow-xs font-bold poppins">
                    {item.title}
                  </div>
                </div>

                <div className="absolute w-full h-full p-[11px] rounded-[2em] bg-[linear-gradient(45deg,rgba(122,90,248,0.75)_0%,rgba(213,197,255,0.85)_100%)] backdrop-blur-md shadow-md inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  <div className="flex items-center justify-center h-full text-[14px] tracking-[1px] text-black poppins">
                    {item.desc}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
