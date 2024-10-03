import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page

// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import Header from "@/components/Header";

// const tokenIds = {
//   AKT: "akash-network",
//   ATOM: "cosmos",
//   ETH: "ethereum",
//   INJ: "injective-protocol",
//   OSMO: "osmosis",
//   PICA: "pica",
//   TIA: "tia",
//   USDC: "usd-coin",
//   USDT: "tether",
//   WBTC: "wrapped-bitcoin",
//   axlUSDC: "axlusdc",
//   stATOM: "stride-staked-atom",
// };

// export default function Home() {
//   const [tokens, setTokens] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [fetchingLiveData, setFetchingLiveData] = useState(false);

//   useEffect(() => {
//     const fetchTokens = async () => {
//       try {
//         const ids = Object.values(tokenIds).join(",");
//         // Simulate initial stale data (1-second delay for demonstration)
//         setTimeout(async () => {
//           const staleResponse = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
//             params: {
//               vs_currency: "usd",
//               ids: ids,
//               order: "market_cap_desc",
//               per_page: 50,
//               page: 1,
//               sparkline: false,
//             },
//           });
//           setTokens(staleResponse.data);
//           setLoading(false);

//           // Fetch live data after showing stale data
//           setFetchingLiveData(false);
//           const liveResponse = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
//             params: {
//               vs_currency: "usd",
//               ids: ids,
//               order: "market_cap_desc",
//               per_page: 50,
//               page: 1,
//               sparkline: false,
//             },
//           });
//           setTokens(liveResponse.data);
//           setFetchingLiveData(false);
//         }, 1000);
//       } catch (error) {
//         console.error("Error fetching token data:", error);
//         setLoading(false);
//         setFetchingLiveData(false);
//       }
//     };

//     fetchTokens();
//   }, []);

//   const handleSetAlert = (token) => {
//     alert(`Set up an alert for ${token.name} at $${token.current_price}`);
//   };

//   if (loading) {
//     return (
//       <div className="bg-gray-900 min-h-screen flex justify-center items-center text-white">
//         <p className="animate-pulse">Loading tokens...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-900 min-h-screen text-white w-screen">
//       {/* <Header /> */}

//       {/* Live Data Fetching Indicator */}
//       <div className="container mx-auto text-center py-2">
//         {fetchingLiveData ? (
//           <p className="text-yellow-400 animate-pulse">Fetching live token prices...</p>
//         ) : (
//           <p className="text-green-400">Live prices updated</p>
//         )}
//       </div>

//       <div className="container mx-auto px-4 py-4 w-4/5">
//         <div className="overflow-x-auto">
//           <table className="w-full bg-gray-800 rounded-lg shadow-md">
//             <thead>
//               <tr className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900">
//                 <th className="py-3 px-6 text-left text-lg font-semibold">#</th>
//                 <th className="py-3 px-6 text-left text-lg font-semibold">Token</th>
//                 <th className="py-3 px-6 text-left text-lg font-semibold">Price (USD)</th>
//                 <th className="py-3 px-6 text-left text-lg font-semibold">Market Cap</th>
//                 <th className="py-3 px-6 text-left text-lg font-semibold">Alert</th>
//               </tr>
//             </thead>
//             <tbody>
//               {tokens.map((token, index) => (
//                 <tr
//                   key={token.id}
//                   className={`border-b border-gray-700 hover:bg-gray-700 transition duration-200 ${fetchingLiveData ? "text-gray-400" : "text-white"}`}
//                 >
//                   <td className="py-4 px-6 text-base font-medium">{index + 1}</td>
//                   <td className="py-4 px-6 flex items-center">
//                     <img src={token.image} alt={token.name} className="w-8 h-8 mr-3 rounded-full shadow-md" />
//                     <span className="text-base font-medium">{token.name}</span>
//                   </td>
//                   <td className={`py-4 px-6 text-base font-medium ${fetchingLiveData ? "animate-pulse" : "text-green-400"}`}>
//                     ${token.current_price.toLocaleString()}
//                   </td>
//                   <td className="py-4 px-6 text-base font-medium">${token.market_cap.toLocaleString()}</td>
//                   <td className="py-4 px-6">
//                     <button
//                       onClick={() => handleSetAlert(token)}
//                       className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow-md transition duration-200"
//                     >
//                       Set Alert
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }
