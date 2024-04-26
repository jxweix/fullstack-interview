"use client"
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Table from "@/components/Table";
import CartMap from "@/components/Cart";

export default function Home() {
  const [dataProps, setDataProps] = useState([]);
  useEffect(() => {
    const storedDataProps = sessionStorage.getItem('dataProps');
    if (storedDataProps) {
      setDataProps(JSON.parse(storedDataProps));
    }
  }, []);

  useEffect(() => {
    if (dataProps.length != 0) {
      sessionStorage.setItem('dataProps', JSON.stringify(dataProps));
    }
  }, [dataProps]);
  
  return (
    <div className="App">
      <Header />
      <div className="grid grid-cols-3 w-full h-[84vh] bg-gray-200 justify-items-center py-[10vh]">
        <div className="grid col-span-2">
          <Table dataProps={dataProps} setDataProps={setDataProps} />
        </div>
        <div className="grid col-span-1">
          <CartMap dataProps={dataProps} setDataProps={setDataProps} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
