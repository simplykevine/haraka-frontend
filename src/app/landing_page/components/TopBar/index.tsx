
'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlayCircle } from "lucide-react";

export default function DashboardTopBar() {
  const router = useRouter();
  const [openVideo, setOpenVideo] = useState(false);

  return (
    <>
      <div className="fixed top-0 left-0 w-full flex flex-row items-center justify-between px-2 sm:px-4 md:px-8 py-3 z-50">
        <div className="flex-1 flex items-center">
          <button
            className="flex items-center text-cyan-500 hover:text-cyan-400 transition-colors text-sm md:text-base font-medium whitespace-nowrap"
            onClick={() => setOpenVideo(true)}
          >
            <PlayCircle className="mr-2" size={20} />
            User Guide
          </button>
        </div>

        <div className="flex items-center gap-x-2 md:gap-x-4">
          <button
            className="bg-cyan-500 text-[#0B182F] font-semibold px-3 md:px-5 py-2 rounded-full border border-cyan-900 hover:bg-cyan-800 hover:text-white transition-colors text-xs md:text-sm whitespace-nowrap cursor-pointer"
            onClick={() => router.push("/signin")}
          >
            Sign in
          </button>

           <button
            className="bg-cyan-500 text-[#0B182F] font-semibold px-3 md:px-5 py-2 rounded-full border border-cyan-900 hover:bg-cyan-800 hover:text-white transition-colors text-xs md:text-sm whitespace-nowrap cursor-pointer"
            onClick={() => router.push("/signup")}
          >
            Sign up
          </button>
        </div>
      </div>

      {/* Video Modal */}
      {openVideo && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[9999] p-4">
          <div className="relative bg-[#0B182F] rounded-xl p-4 w-full max-w-3xl shadow-xl">
            <button
              className="absolute top-2 right-2 text-white text-xl hover:text-gray-300"
              onClick={() => setOpenVideo(false)}
            >
              ×
            </button>

            <video
              className="w-full rounded-lg"
              controls
              autoPlay
            >
              <source src="images/zenos.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </>
  );
}
