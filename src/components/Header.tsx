import React, { useEffect } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa";

const Header = () => {
  useEffect(() => {
    async function getLiveData() {
      const response = await axios.get("/api/nats");
      console.log(response.data);
    }
    getLiveData();
  }, []);

  return (
    <header className="py-6 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 shadow-lg">
      <div className="container mx-auto text-center">
        <div className="flex items-center gap-6 justify-center">
          <h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Crypto Price Alert</h1>
          <FaBell className="text-blue-400 mb-2 text-4xl animate-pulse" />
        </div>
        <p className="text-lg text-gray-300">Stay updated with real-time cryptocurrency prices and set alerts for your favorite tokens.</p>
      </div>
    </header>
  );
};

export default Header;

// // import { useSynternet } from '@/hooks/useSynternet';
// import axios from 'axios';
// import React, { useEffect } from 'react'

// const Header = () => {
//   useEffect(()=>{
//     async function getLiveData(){
//         const response = await axios.get("/api/nats");
//         console.log(response.data);
//     }
//     getLiveData();
//   },[])

//   return (
//     <header className="py-8 bg-gray-800 shadow-md">
//       <div className="container mx-auto text-center">
//         <h1 className="text-4xl font-bold mb-4">Crypto Price Alert</h1>
//         <p className="text-lg">Stay updated with real-time cryptocurrency prices and set alerts for your favorite tokens.</p>
//       </div>
//     </header>
//   );
// }

// export default Header
