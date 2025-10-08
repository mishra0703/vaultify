"use client";

import React from "react";
import { useState , useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";

const Page = () => {
  const router = useRouter();
  const [data, setData] = useState({ email: "", password: "" });
  const {data: session} = useSession();

  useEffect(() => {
    document.title = "Login | Vaultify";
    if (session) {
      router.push(`/password-manager`);
    }
  }, [session,router]);

  const loginUser = async (e) => {
    e.preventDefault();

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });


      if (result?.error) {
      } else if (result?.ok) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        router.push("/password-manager");
        router.refresh();
      }
    } catch (err) {
      console.error("Login Error:", err);
    }
  };

  

  return (
    <div>
      <section className="poppins">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto mt-20 lg:py-0">
          <div className="w-full backdrop-blur-md rounded-4xl shadow-md dark:border md:mt-0 sm:max-w-md xl:p-0  dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
                Login
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={loginUser}>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={data.email}
                    onChange={(e) => {
                      setData({ ...data, email: e.target.value });
                    }}
                    className="bg-gray-50 border-2 border-neutral-600 hover:border-blue-400 text-gray-900 text-sm rounded-lg block w-full p-2.5 transition-all duration-400 ease-in-out"
                    placeholder="xyz@email.com"
                    required=""
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={data.password}
                    onChange={(e) => {
                      setData({ ...data, password: e.target.value });
                    }}
                    placeholder="••••••••"
                    className="bg-gray-50 border-2 border-neutral-600 hover:border-blue-400 text-gray-900 text-sm rounded-lg block w-full p-2.5 transition-all duration-400 ease-in-out"
                    required=""
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-400 hover:bg-blue-500 transition-all duration-300 ease-in-out font-medium rounded-lg text-lg px-5 py-2.5 text-center cursor-pointer "
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
