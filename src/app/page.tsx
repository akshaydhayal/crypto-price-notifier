"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "@/components/Header";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { Input } from "@/components/ui/input";
// import { dbConnect } from "@/db/dbConnect";

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
  const [livePriceData, setLivePriceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<null | {
    id: string;
    name: string;
    image: string;
    symbol: string;
    current_price: number;
    market_cap: number;
  }>(null);
  const [alertPrice, setAlertPrice] = useState("");
  const [alertEmail, setAlertEmail] = useState("");
  const [updatedAt,setUpdatedAt]=useState(null);

  
  useEffect(() => {
    // dbConnect();
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
        console.log("setotken bfore stting",response.data);
        setTokens(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching token data:", error);
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);

  //@ts-expect-error argument
  const handleSetAlert = (token) => {
    setSelectedToken(token);
    setIsAlertModalOpen(true);
  };

  const handleCloseAlertModal = () => {
    setIsAlertModalOpen(false);
    setSelectedToken(null);
    setAlertPrice("");
    setAlertEmail("");
  };

  const handleSubmitAlert = async () => {
    try {
      await axios.post("/api/mailalerts",{
      // await axios.post("http://ec2-13-61-2-185.eu-north-1.compute.amazonaws.com:3000/alerts", {
        token: selectedToken?.id,
        symbol: selectedToken?.symbol.toUpperCase(),
        targetPrice: parseFloat(alertPrice),
        email: alertEmail,
      });
        
      alert(`Alert set for ${selectedToken?.name} at $${alertPrice}. You'll be notified at ${alertEmail}`);
      handleCloseAlertModal();
    } catch (error) {
      console.error("Error setting alert:", error);
      alert("Failed to set alert. Please try again.");
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white w-screen">
      <Header setLivePriceData={setLivePriceData} setUpdatedAt={setUpdatedAt} />

      <div className="container mx-auto px-4 py-4 w-4/5">
        <div className="overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            {/* <h1 className="text-2xl font-semibold">Token Prices ${livePriceData?"(Live Data)":"(Stale Data)"}(Stale Data)</h1> */}
            <h1 className="text-2xl font-semibold">Token Prices {livePriceData ? "(Live Data)" : "(Stale Data)"}</h1>
            {!livePriceData ? (
              <div className="flex items-center text-yellow-400 text-sm">
                <span className="mr-2">Getting Live Data from Synternet Data Stream</span>
                <svg className="animate-spin h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
              </div>
            ) : (
              <p className="text-green-400">Live prices last updated at {updatedAt}</p>
            )}
          </div>
          {loading ? (
            <div className="bg-gray-900 min-h-[55vh] flex justify-center items-center text-white">
              <p className="animate-pulse">Loading tokens...</p>
            </div>
          ) : (
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
                {tokens.length > 0 &&
                  tokens.map((token: { id: string; name: string; image: string; symbol: string; current_price: number; market_cap: number }, index) => (
                    <tr key={token.id} className="border-b border-gray-700 hover:bg-gray-700 transition duration-200">
                      <td className="py-4 px-6 text-base font-medium">{index + 1}</td>
                      <td className="py-4 px-6 flex items-center">
                        <img src={token.image} alt={token.name} className="w-8 h-8 mr-3 rounded-full shadow-md" />
                        <span className="text-base font-medium">{token.name}</span>
                      </td>
                      {livePriceData && livePriceData[token.symbol.toUpperCase()] ? (
                        //@ts-expect-error ignore
                        <td className="py-4 px-6 text-base font-medium text-green-400">${livePriceData[token.symbol.toUpperCase()].price.toFixed(2)}</td>
                      ) : (
                        <td className="py-4 px-6 text-base font-medium">${token.current_price.toLocaleString()}</td>
                      )}
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
          )}
        </div>
      </div>

      <AlertDialog open={isAlertModalOpen} onOpenChange={setIsAlertModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Set Price Alert</AlertDialogTitle>
            <AlertDialogDescription>
              Set an alert for {selectedToken?.name}. Current price: $
              {/* Set an alert for {selectedToken?.name}. Current price: ${selectedToken?.current_price.toLocaleString()} $ */}
              {/* @ts-expect-error ignore */}
              {selectedToken && livePriceData?livePriceData[selectedToken.symbol.toUpperCase()].price.toFixed(2): selectedToken?.current_price.toLocaleString()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="price" className="text-right">
                Alert Price
              </label>
              <Input id="price" type="number" step="0.01" value={alertPrice} onChange={(e) => setAlertPrice(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right">
                Email
              </label>
              <Input id="email" type="email" value={alertEmail} onChange={(e) => setAlertEmail(e.target.value)} className="col-span-3" />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseAlertModal}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmitAlert}>Set Alert</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}