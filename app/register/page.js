'use client'

import React from "react";
import { useState , useEffect} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

const Page = () => {

  const router = useRouter()
  const [data, setData] = useState({name: '' , email: '' , password: ''})
  const {data : session} = useSession();

   useEffect(() => {
      document.title = "Register | Vaultify";
      if (session) {
        router.push(`/password-manager`);
      }
    }, [session,router]);
  

  const registerUser = async (e)=>{
    e.preventDefault();

    const response = await fetch('/api/register',{
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({data})
    })

    const userInfo = await response.json()
    
    setData({name: '' , email: '' , password: ''})
    router.push('/login')
  }

  return (
    <div>
      <section className="poppins">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto mt-20 lg:py-0">
          <div className="w-full backdrop-blur-md rounded-4xl shadow-md dark:border md:mt-0 sm:max-w-md xl:p-0  dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
                Create an account
              </h1>
              <form className="space-y-4 md:space-y-6" action="#">
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={data.name}
                    onChange={(e)=>{setData({...data,name: e.target.value})}}
                    placeholder="Your Name"
                    className="bg-gray-50 border-2 border-neutral-600 hover:border-blue-400 text-gray-900 text-sm rounded-lg  block w-full p-2.5 transition-all duration-400 ease-in-out"
                    required=""
                  />
                </div>
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
                    onChange={(e)=>{setData({...data,email: e.target.value})}}
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
                    onChange={(e)=>{setData({...data,password: e.target.value})}}
                    placeholder="••••••••"
                    className="bg-gray-50 border-2 border-neutral-600 hover:border-blue-400 text-gray-900 text-sm rounded-lg block w-full p-2.5 transition-all duration-400 ease-in-out"
                    required=""
                  />
                </div>

                <button
                  type="submit"
                  onClick={registerUser}
                  className="w-full bg-blue-400 hover:bg-blue-500 transition-all duration-300 ease-in-out font-medium rounded-lg text-lg px-5 py-2.5 text-center cursor-pointer "
                >
                  Create an account
                </button>
                <p className="text-sm font-light text-neutral-500 ">
                  Already have an account ? {" "}
                  <Link
                    href={"/login"}
                    className="font-medium text-blue-500 hover:underline"
                  >
                    Login here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
