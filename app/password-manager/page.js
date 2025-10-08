"use client";

import { useState, useRef, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffIcon } from "@hugeicons/core-free-icons";
import { motion, AnimatePresence } from "framer-motion";
import DataTable from "@/components/DataTable";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";
import connectDB from "@/db/connectDb";
import User from "../models/User";

const Manager = () => {
  const [formData, setFormData] = useState({
    _id: "",
    url: "",
    username: "",
    password: "",
    remarks: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordArray, setPasswordArray] = useState([]);
  const addIconRef = useRef();
  const { data: session, status } = useSession();


  useEffect(() => {
    if (session) {
      fetchPasswords();
    }
    else{
      return notFound();
    }
  }, [session]);

  const fetchPasswords = async () => {
    try {
      const response = await fetch("/api/passwords");
      const result = await response.json();

      if (result.success) {
        setPasswordArray(result.data);
        setFormData({
          _id: "",
          url: "",
          username: "",
          password: "",
          remarks: "",
        });
      }
    } catch (error) {
      console.error("Error fetching passwords:", error);
    }
  };

  const addRefAnimation = () => {
    if (addIconRef.current && addIconRef.current.playerInstance) {
      addIconRef.current.playerInstance.stop();
      setTimeout(() => {
        addIconRef.current.playerInstance.play();
      }, 50);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const savePassword = async () => {
    if (
      formData.url.length > 3 &&
      formData.username.length > 3 &&
      formData.password.length > 3
    ) {
      try {
        const method = formData._id ? "PUT" : "POST";

        
        const payload =
          method === "PUT"
            ? {
                id: formData._id,
                url: formData.url,
                username: formData.username,
                password: formData.password,
                remarks: formData.remarks,
              }
            : {
                url: formData.url,
                username: formData.username,
                password: formData.password,
                remarks: formData.remarks,
              };

        const response = await fetch("/api/passwords", {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (result.success) {
          if (method === "PUT") {
            await fetchPasswords();
          } else {
            setPasswordArray([result.data, ...passwordArray]);
            setFormData({
              _id: "",
              url: "",
              username: "",
              password: "",
              remarks: "",
            });
          }
        } else {
          console.error("Error saving password:", result.message);
        }
      } catch (error) {
        console.error("Error saving password:", error);
      }
    }
  };

  const handleAddByEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      savePassword();
    }
  };


  return (
    <>
      <div className="main-content flex flex-col items-center mt-[8vh] gap-5">
        <div className="flex flex-col items-center gap-3">
          <div className="main-tittle text-4xl font-bold">Vaultify</div>
          <div className="sub-tittle text-lg font-[400]">
            Keeps your password safe
          </div>
        </div>
        <div className="inputs w-full max-sm:w-[90%] flex flex-col items-center gap-5">
          <div className="url-input w-full flex justify-center">
            <input
              name="url"
              value={formData.url}
              onChange={handleChange}
              onKeyDown={handleAddByEnter}
              type="text"
              placeholder="Website url/name"
              className=" w-1/2 max-sm:w-[90%] border-2 border-black rounded-xl px-3 py-[3px] focus-within:outline-none"
            />
          </div>
          <div className="main-input w-1/2 max-sm:w-full flex justify-center items-center gap-5 relative  z-5 max-sm:flex-wrap">
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              onKeyDown={handleAddByEnter}
              type="text"
              placeholder="Username/Id"
              className="w-3/5 max-sm:w-[90%] border-2 border-black rounded-xl px-3 py-[3px] focus-within:outline-none"
            />
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              onKeyDown={handleAddByEnter}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-2/5 max-sm:w-[90%] border-2 border-black rounded-xl px-3 pr-10 py-[3px] focus-within:outline-none"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 max-sm:right-8 max-sm:top-14.5  cursor-pointer"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={showPassword ? "view" : "viewoff"}
                  initial={{ rotateY: -90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: 90, opacity: 0 }}
                  transition={{ duration: 0.15, ease: "easeInOut" }}
                  style={{ transformPerspective: "1000px" }}
                >
                  <HugeiconsIcon
                    icon={showPassword ? ViewIcon : ViewOffIcon}
                    size={24}
                    color="#000000"
                    strokeWidth={1.5}
                  />
                </motion.span>
              </AnimatePresence>
            </span>
          </div>
          <div className="remarks-input w-full flex justify-center">
            <input
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              onKeyDown={handleAddByEnter}
              type="text"
              placeholder="Add notes or remarks (optional)"
              className=" w-1/2 max-sm:w-[90%] border-2 border-black rounded-xl px-3 py-[3px] focus-within:outline-none"
            />
          </div>
          <div className="submit-btn mt-5">
            <button
              onClick={() => {
                savePassword();
                addRefAnimation();
              }}
              className="bg-purple-400 px-3 py-1.5 rounded-full flex justify-center items-center gap-2.5 font-bold text-lg hover:cursor-pointer hover:bg-none"
            >
              <lord-icon
                ref={addIconRef}
                src="https://cdn.lordicon.com/efxgwrkc.json"
                trigger="hover"
                style={{ width: "25px", height: "25px" }}
                colors="primary:#000000"
              ></lord-icon>
              Save
            </button>
          </div>
        </div>
        <div className="passwordList w-full mx-auto my-8">
          {passwordArray.length === 0 && (
            <div className="font-bold text-3xl flex justify-center mt-5 opacity-50">
              No Passwords To Show
            </div>
          )}
          {passwordArray.length != 0 && (
            <DataTable
              passwordArray={passwordArray}
              setPasswordArray={setPasswordArray}
              formData={formData}
              setFormData={setFormData}
              fetchPasswords={fetchPasswords}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;
