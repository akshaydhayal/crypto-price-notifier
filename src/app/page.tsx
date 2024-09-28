"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "@/components/Header";

const tokenIds = {
  AKT: "akash-network",
  ATOM: "cosmos",
  ETH: "ethereum",
  INJ: "injective-protocol",
  OSMO: "osmosis",
  PICA: "pica",
  TIA: "tia",
  USDC: "usd-coin",
  USDT: "tether",
  WBTC: "wrapped-bitcoin",
  axlUSDC: "axlusdc",
  stATOM: "stride-staked-atom",
};

export default function Home() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isStale, setIsStale] = useState(true);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const ids = Object.values(tokenIds).join(",");
        const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
          params: {
            vs_currency: "usd",
            ids: ids,
            order: "market_cap_desc",
            per_page: 50,
            page: 1,
            sparkline: false,
          },
        });
        setTokens(response.data);
        setLoading(false);
        setIsStale(true);  // Assume data is stale for this API
      } catch (error) {
        console.error("Error fetching token data:", error);
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);

  const handleSetAlert = (token) => {
    alert(`Set up an alert for ${token.name} at $${token.current_price}`);
  };

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex justify-center items-center text-white">
        <p className="animate-pulse">Loading tokens...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white w-screen">
      <Header />

      <div className="container mx-auto px-4 py-4 w-4/5">
        <div className="overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">Token Prices (Stale Data)</h1>
            {isStale && (
              <div className="flex items-center text-yellow-400 text-sm">
                <span className="mr-2">Getting Live Data</span>
                <svg className="animate-spin h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                {/* <span className="ml-2">Please refresh for live data.</span> */}
              </div>
            )}
          </div>

          <table className="w-full bg-gray-800 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900">
                <th className="py-3 px-6 text-left text-lg font-semibold">#</th>
                <th className="py-3 px-6 text-left text-lg font-semibold">Token</th>
                <th className="py-3 px-6 text-left text-lg font-semibold">Price (USD)</th>
                <th className="py-3 px-6 text-left text-lg font-semibold">Market Cap</th>
                <th className="py-3 px-6 text-left text-lg font-semibold">Alert</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token, index) => (
                <tr key={token.id} className="border-b border-gray-700 hover:bg-gray-700 transition duration-200">
                  <td className="py-4 px-6 text-base font-medium">{index + 1}</td>
                  <td className="py-4 px-6 flex items-center">
                    <img src={token.image} alt={token.name} className="w-8 h-8 mr-3 rounded-full shadow-md" />
                    <span className="text-base font-medium">{token.name}</span>
                  </td>
                  <td className="py-4 px-6 text-base font-medium">${token.current_price.toLocaleString()}</td>
                  <td className="py-4 px-6 text-base font-medium">${token.market_cap.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleSetAlert(token)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow-md transition duration-200"
                    >
                      Set Alert
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}



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

//   useEffect(() => {
//     const fetchTokens = async () => {
//       try {
//         const ids = Object.values(tokenIds).join(",");
//         const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
//           params: {
//             vs_currency: "usd",
//             ids: ids,
//             order: "market_cap_desc",
//             per_page: 50,
//             page: 1,
//             sparkline: false,
//           },
//         });
//         setTokens(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching token data:", error);
//         setLoading(false);
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
//         <p className="animate-pulse">Loading stale data...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-900 min-h-screen text-white w-screen">
//       <Header />

//       <div className="container mx-auto px-4 py-4 w-4/5">
//         <div className="flex justify-between items-center mb-4">
//           <h1 className="text-2xl font-bold">Token Prices (Stale Data)</h1>
//           <p className="text-yellow-400">Note: These are not live prices. Refresh for updated data.</p>
//         </div>

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
//                 <tr key={token.id} className="border-b border-gray-700 hover:bg-gray-700 transition duration-200">
//                   <td className="py-4 px-6 text-base font-medium">{index + 1}</td>
//                   <td className="py-4 px-6 flex items-center">
//                     <img src={token.image} alt={token.name} className="w-8 h-8 mr-3 rounded-full shadow-md" />
//                     <span className="text-base font-medium">{token.name}</span>
//                   </td>
//                   <td className="py-4 px-6 text-base font-medium">${token.current_price.toLocaleString()}</td>
//                   <td className="py-4 px-6 text-base font-medium">${token.market_cap.toLocaleString()}</td>
//                   <td className="py-4 px-6">
//                     <button onClick={() => handleSetAlert(token)} className="bg-gray-500 text-gray-300 font-semibold py-2 px-4 rounded shadow-md" disabled>
//                       Stale Data
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
