"use client";
// import { dbConnect } from "@/db/dbConnect";
import React, { useEffect } from "react";
import { FaBell } from "react-icons/fa";

//@ts-expect-error arguments
const Header = ({ setLivePriceData, setUpdatedAt }) => {
  // const [liveData, setLiveData] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const eventSource = new EventSource("/api/nats");

    eventSource.onmessage = (event) => {
      // setLiveData(event.data);
      setLivePriceData(JSON.parse(event.data));
      setUpdatedAt(new Date().toLocaleString());
      console.log("type event data : ", typeof event.data);
    };

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <header className="py-6 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 shadow-lg">
      <div className="container mx-auto text-center">
        <div className="flex items-center gap-6 justify-center">
          <h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Crypto Price Alert</h1>
          <FaBell className="text-blue-400 mb-2 text-4xl animate-pulse" />
        </div>
        <p className="text-lg text-gray-300">Stay updated with real-time cryptocurrency prices and set alerts for your favorite tokens.</p>
        {/* {liveData && <p>Live price updated</p>} */}
        {/* {liveData && <p>Live price updated</p>} */}
        {/* {liveData && (
          <div className="mt-4 text-white">
            <h2 className="text-2xl font-bold">Latest Data:</h2>
            <pre className="mt-2 bg-gray-800 p-4 rounded-lg overflow-x-auto">{JSON.stringify(JSON.parse(liveData), null, 2)}</pre>
          </div>
        )} */}
      </div>
    </header>
  );
};

export default Header;




// "use client";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FaBell } from "react-icons/fa";

// const Header = () => {
//   useEffect(() => {
//     async function getLiveData() {
//       const response = await axios.get("/api/nats");
//       console.log('header response : ',response.data);
//     }
//     getLiveData();
//   }, []);

//   return (
//     <header className="py-6 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 shadow-lg">
//       <div className="container mx-auto text-center">
//         <div className="flex items-center gap-6 justify-center">
//           <h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Crypto Price Alert</h1>
//           <FaBell className="text-blue-400 mb-2 text-4xl animate-pulse" />
//         </div>
//         <p className="text-lg text-gray-300">Stay updated with real-time cryptocurrency prices and set alerts for your favorite tokens.</p>
//       </div>
//     </header>
//   );
// };

// export default Header;
