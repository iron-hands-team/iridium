"use client";

import { Toaster, ToastBar, toast } from "react-hot-toast";
import { FaCheckCircle } from "react-icons/fa";

function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      containerClassName="mr-10 mt-5"
      toastOptions={{
        className:
          "bg-zinc-100! dark:bg-zinc-900! border-1 border-zinc-800 rounded-none! px-4! py-2! text-zinc-700! dark:text-zinc-300! hover:scale-105 hover:-translate-y-1 transition-transform! cursor-pointer",
        duration: 4000,
        success: {
          icon: <FaCheckCircle size={17} />,
        },
      }}
    >
      {(t) => (
        <div onClick={() => toast.dismiss(t.id)}>
          <ToastBar toast={t} />
        </div>
      )}
    </Toaster>
  );
}

export default ToastProvider;
