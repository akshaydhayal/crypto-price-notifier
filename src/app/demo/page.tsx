"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

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

const HomePage = () => {
  const [tokens, setTokens] = useState({});
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

        // Set token data into state
        const formattedData = response.data.reduce((acc, token) => {
          acc[token.symbol.toUpperCase()] = {
            price: token.current_price,
            price_percent_change_24h: token.price_change_percentage_24h,
            market_cap: token.market_cap,
            image: token.image,
          };
          return acc;
        }, {});
        console.log(formattedData);
        setTokens(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching token data:", error);
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <header className="py-8 bg-gray-800 shadow-md">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Crypto Price Alert</h1>
          <p className="text-lg">Stay updated with real-time cryptocurrency prices.</p>
        </div>
      </header>
      <main className="container mx-auto mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Object.keys(tokens).map((symbol) => (
            <div key={symbol} className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <div className="flex items-center">
                <img src={tokens[symbol].image} alt={symbol} className="w-10 h-10 mr-4" />
                <h2 className="text-xl font-bold">{symbol}</h2>
              </div>
              <p className="text-lg mt-2">Price: ${tokens[symbol].price.toFixed(2)}</p>
              <p className={`text-lg ${tokens[symbol].price_percent_change_24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                24h Change: {tokens[symbol].price_percent_change_24h?.toFixed(2)}%
              </p>
              <p className="text-lg">Market Cap: ${tokens[symbol].market_cap.toLocaleString()}</p>
              <button className="mt-4 px-4 py-2 bg-blue-500 rounded-lg">Set Price Alert</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
