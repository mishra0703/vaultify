"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [searchText, setSearchText] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim().length > 0) {
      router.push(
        `/search-results?query=${encodeURIComponent(searchText.trim())}`
      );
    }
  };

  return (
    <nav className="bg-neutral-800 h-[10vh] lg:px-30 max-lg:px-5 sticky z-10 mx-auto">
      <ul className="flex justify-between items-center h-full font-sans text-white">
        <li className="text-3xl font-bold">
          <Link href={"/"}>Vaultify</Link>
        </li>
        {session ? (
          <li className="flex items-center gap-6">
            <div className="search-panels poppins">
              <form className="search-group" onSubmit={handleSearch}>
                <input
                  type="text"
                  name="text"
                  required
                  className="input"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <label className="enter-label">Search</label>

                <div className="btn-box">
                  <button type="submit" className="btn-search">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="1em"
                      viewBox="0 0 512 512"
                    >
                      <path
                        d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 
                12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 
                40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 
                416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
                      ></path>
                    </svg>
                  </button>
                </div>

                <div className="btn-box-x">
                  <button
                    type="button"
                    onClick={() => setSearchText("")}
                    className="btn-cleare"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="1em"
                      viewBox="0 0 384 512"
                    >
                      <path
                        d="M342.6 150.6c12.5-12.5 12.5-32.8 
                        0-45.3s-32.8-12.5-45.3 0L192 
                        210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 
                        0s-12.5 32.8 0 45.3L146.7 256 41.4 
                        361.4c-12.5 12.5-12.5 32.8 0 
                        45.3s32.8 12.5 45.3 0L192 301.3 
                        297.4 406.6c12.5 12.5 32.8 12.5 
                        45.3 0s12.5-32.8 0-45.3L237.3 
                        256 342.6 150.6z"
                        id="cleare-line"
                      ></path>
                    </svg>
                  </button>
                </div>
              </form>
            </div>

            <button
              className="px-3 py-2 duration-300 ease-in-out transition-all font-bold rounded-lg hover:bg-neutral-500 bg-neutral-600 poppins cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        ) : (
          <li className="flex gap-5">
            <Link
              className="px-3 py-2 duration-300 ease-in-out transition-all font-bold rounded-lg hover:bg-emerald-500 bg-emerald-400 poppins text-black "
              href={"/login"}
            >
              Login
            </Link>
            <Link
              className="px-3 py-2 duration-300 ease-in-out transition-all font-bold rounded-lg hover:bg-neutral-400 bg-neutral-600 poppins "
              href={"/register"}
            >
              Sign Up
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
