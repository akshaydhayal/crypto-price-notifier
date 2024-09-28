"use client";
import { useEffect, useState } from "react";
import { NatsService } from "../pubsub/nats";
import { createAppJwt } from "../pubsub/userJwt";
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

    useEffect(() => {
      const fetchTokens = async () => {
        try {
          // Construct the token IDs as a comma-separated string
          const ids = Object.values(tokenIds).join(",");

          // Make the request to the CoinGecko API to get the specific tokens with market cap and images
          const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
            params: {
              vs_currency: "usd",
              ids: ids, // Only fetch the tokens we need
              order: "market_cap_desc", // Sort by market cap
              per_page: 50,
              page: 1,
              sparkline: false,
            },
          });
          console.log(response.data);
          setTokens(response.data);
          
          setLoading(false);
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
          <p>Loading tokens...</p>
        </div>
      );
    }


  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <Header/>

      {/* Token List */}
      <div className="container mx-auto px-4 py-8">
        <div className="overflow-x-auto">
          <table className="w-full bg-gray-800 rounded-lg">
            <thead>
              <tr>
                <th className="py-3 px-6 bg-gray-700 text-left">#</th>
                <th className="py-3 px-6 bg-gray-700 text-left">Token</th>
                <th className="py-3 px-6 bg-gray-700 text-left">Price (USD)</th>
                <th className="py-3 px-6 bg-gray-700 text-left">Market Cap</th>
                <th className="py-3 px-6 bg-gray-700 text-left">Alert</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token, index) => (
                <tr key={token.id} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="py-4 px-6">{index + 1}</td>
                  <td className="py-4 px-6 flex items-center">
                    <img src={token.image} alt={token.name} className="w-6 h-6 mr-2" />
                    <span>{token.name}</span>
                  </td>
                  <td className="py-4 px-6">${token.current_price.toLocaleString()}</td>
                  <td className="py-4 px-6">${token.market_cap.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <button onClick={() => handleSetAlert(token)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
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
