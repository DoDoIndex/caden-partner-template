'use client';

import { useState, useEffect } from "react";

export default function Home() {
  const [sampleData, setSampleData] = useState('');
  
  const fetchData = async () => {
    try {
      const response = await fetch(`/api/sample-call`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const sampleData = await response.json();
      setSampleData(sampleData?.message);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Hello World</h1>
        <div className="text-2xl font-bold">{sampleData}</div>
      </div>
    </div>
  );
}
