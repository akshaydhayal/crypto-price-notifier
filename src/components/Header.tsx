// import { useSynternet } from '@/hooks/useSynternet';
import axios from 'axios';
import React, { useEffect } from 'react'

const Header = () => {
  useEffect(()=>{
    async function getLiveData(){
        const response = await axios.get("/api/nats");
        console.log(response.data);
    }
    getLiveData();
  },[])

  return (
    <header className="py-8 bg-gray-800 shadow-md">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Crypto Price Alert</h1>
        <p className="text-lg">Stay updated with real-time cryptocurrency prices and set alerts for your favorite tokens.</p>
      </div>
    </header>
  );
}

export default Header