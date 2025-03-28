'use client';

import { useState, useEffect } from "react";
import Navbar from "./navbar";
import CardProduct from "./card-product";
// import FilterProduct from "./filter-product";

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
    <div>
      <Navbar />
      <CardProduct />
    </div>
  );
}
