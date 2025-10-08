"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DataTable from "@/components/DataTable";
import { motion } from "framer-motion";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("query")?.trim().toLowerCase() || "";

  const [passwordArray, setPasswordArray] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      router.replace("/password-manager");
    }
  }, [query, router]);

  
  useEffect(() => {
    const fetchPasswords = async () => {
      try {
        const response = await fetch("/api/passwords");
        const result = await response.json();

        if (result.success) {
          setPasswordArray(result.data);
        }
      } catch (error) {
        console.error("Error fetching passwords:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPasswords();
  }, []);

  
  useEffect(() => {
    if (passwordArray.length && query) {
      const matches = passwordArray.filter(
        (item) =>
          item.url.toLowerCase().includes(query) ||
          item.username.toLowerCase().includes(query) ||
          (item.remarks && item.remarks.toLowerCase().includes(query))
      );
      setFilteredData(matches);
    }
  }, [passwordArray, query]);

  return (
    <div className="min-h-screen flex flex-col items-center mt-[8vh] px-5">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-3xl font-bold poppins mb-8"
      >
        Search Results for “{query}”
      </motion.h1>

      {loading ? (
        <p className="text-lg opacity-70 poppins">Loading your vault...</p>
      ) : filteredData.length === 0 ? (
        <p className="text-lg opacity-60 poppins">
          No matching entries found in your passwords.
        </p>
      ) : (
        <div className="w-full">
          <DataTable
            passwordArray={filteredData}
            setPasswordArray={setPasswordArray}
            formData={{}}
            setFormData={() => {}}
            fetchPasswords={() => {}}
          />
        </div>
      )}

      <button
        onClick={() => router.push("/password-manager")}
        className="mt-10 px-5 py-3 bg-purple-400 rounded-full font-semibold hover:bg-purple-500 transition-all poppins cursor-pointer"
      >
        Back to Vault
      </button>
    </div>
  );
}
