"use client"
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Select, SelectItem } from "@nextui-org/react"

const CartMap = ({ dataProps, setDataProps }) => {
    const [dataDis, setDataDis] = useState([]);
    const [selectDis, setSelectDis] = React.useState(new Set());
    const [totalProps, setTotalProps] = useState(0)
    const regex = /(\d+)(?=(?:\d{3})+(?!\d))/g

    useEffect(() => {
        const fetchData = async () => {
            const discountsResponse = await fetch('http://localhost:8000/discounts');
            const discountsData = await discountsResponse.json();
            setDataDis(discountsData);
        }
        fetchData();
    }, [])

    const handleDel = (id) => {
        const updatedDataProps = dataProps.map(item => {
            if (item.id === id) {
                return { ...item, count: item.count - 1 };
            }
            return item;
        });
        setDataProps(updatedDataProps);
    }

    const handleAdd = (id) => {
        const updatedDataProps = dataProps.map(item => {
            if (item.id === id) {
                return { ...item, count: item.count + 1 };
            }
            return item;
        });
        setDataProps(updatedDataProps);
    }

    const handleDis = (index) => {
        return dataProps[index]?.count === 1;
    }

    const calculateTotal = () => {
        let total = 0;
        dataProps.forEach(item => {
            total += item.count * item.price;
        });
        return total.toString().replace(regex, '$1,')
    };

    const calculateDiscount = () => {
        const filteredData = dataDis.filter(item => Array.from(selectDis).includes(item.code));
        let discountTotal = 0;

        filteredData.forEach(item => {
            if (item.type === "percentage" && totalProps != 0) {
                discountTotal += totalProps * (item.discount / 100);

            } else if (item.type === "amount") {
                discountTotal += item.discount;
            }
        });
        return discountTotal.toString().replace(regex, '$1,')
    };

    const calculateGrandTotal = () => {
        const total = parseInt(calculateTotal().replace(",", ""));
        setTotalProps(total)
        const discount = parseInt(calculateDiscount().replace(",", ""));
        return (total - discount).toString().replace(regex, '$1,');
    };

    const CartMaps = () => {
        return (
            <>
                <Card className="w-[50vh]">
                    <CardHeader className="pb-0">
                        <p className="w-full text-center text-[23px]">
                            Cart
                        </p>
                    </CardHeader>
                    <CardBody>
                        <Divider />
                        {dataProps?.map((item, index) => (
                            <>
                                <div className="grid grid-cols-5 w-full items-center p-4 gap-4" key={index}>
                                    <Image
                                        className="grid rounded-xl h-[5vh] border-1"
                                        src={`/assets${item.src}`}
                                        width={150} height={150} alt="img"
                                    />
                                    <div className="grid col-span-2">
                                        <span>
                                            <p>{item.title}</p>
                                            <p>{item.price.toString().replace(regex, '$1,')} THB</p>
                                        </span>
                                    </div>
                                    <div className="grid  col-span-2 items-center">
                                        <span className="flex gap-4 items-center">
                                            <Button
                                                disabled={handleDis(index)}
                                                onClick={() => { handleDel(item.id), handleDis(index) }}
                                            >-</Button>
                                            <p className="text-center w-1">{item.count}</p>
                                            <Button onClick={() => handleAdd(item.id)}>+</Button>
                                        </span>
                                    </div>
                                </div>
                                <Divider />
                            </>
                        ))}
                    </CardBody>
                    <CardFooter>
                        <div className="grid grid-rows-4 grid-cols-3 w-full text-[23px] gap-2">
                            <Divider className="grid row-span-1 col-span-3 self-center h-[2px]" />
                            <div className="grid col-span-2">
                                <p>Total</p>
                            </div>
                            <p className="grid col-span-1 text-end">{calculateTotal()} THB</p>

                            <p className="grid col-span-1">Discount</p>
                            <Select
                                placeholder="Select Discount"
                                selectedKeys={selectDis}
                                onSelectionChange={setSelectDis}
                            >
                                {dataDis.map((item) => (
                                    <SelectItem
                                        className="text-black"
                                        key={item.code}
                                        value={item.code}
                                    >
                                        {item.code}
                                    </SelectItem>
                                ))}
                            </Select>
                            <p className="grid col-span-1 text-end text-[#e12c2c]">{calculateDiscount()} THB</p>

                            <div className="grid col-span-2">
                                <p>Grand Total</p>
                            </div>
                            <p className="grid col-span-1 text-end">{calculateGrandTotal()} THB</p>
                        </div>
                    </CardFooter>
                </Card>
            </>
        )
    }

    return (
        <CartMaps />
    )
}

export default CartMap;