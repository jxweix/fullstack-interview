"use client"
import Image from "next/image";
import { Button, Card, CardBody, CardHeader, Divider } from "@nextui-org/react"
import { useEffect, useState } from "react";

const Table = ({ dataProps, setDataProps }) => {
    const [dataTicket, setDataTicket] = useState([]);
    const [dataClick, setDataClick] = useState([]);
    const regex = /(\d+)(?=(?:\d{3})+(?!\d))/g

    useEffect(() => {
        const fetchData = async () => {
            const ticketsResponse = await fetch('http://localhost:8000/tickets');
            const ticketsData = await ticketsResponse.json();
            setDataTicket(ticketsData);
        }
        fetchData();
        setDataProps(dataClick)
    }, [dataClick])

    const handleClickADD = (item) => {
        setDataClick(prevData => {
            const newData = prevData.map(data => {
                // หาก id ของข้อมูลเป็นเท่ากับ id ที่ส่งมา
                if (data.id === item.id) {
                    // เพิ่มค่า count ขึ้นทีละหนึ่ง
                    return { ...data, count: data.count + 1 };
                }
                return data;
            });
            // ถ้าไม่พบ id ในข้อมูลเดิม ให้เพิ่มข้อมูลใหม่ลงไป
            if (!newData.some(data => data.id === item.id)) {
                newData.push({ id: item.id, count: 1, price: item.price, src: item.img, title: item.title });
            }
            return newData;
        });
    };
    const [btDisabled, setBtDisabled] = useState([])
    const handleDis = (index) => {
        const newDisabledButtons = [...btDisabled];
        newDisabledButtons[index] = !newDisabledButtons[index];
        setBtDisabled(newDisabledButtons)
    }

    const Mapticket = () => {
        return (
            <>
                {dataTicket.map((item, index) => (
                    <>
                        <Divider />
                        <div className="grid grid-cols-6 grid-rows-1 items-center p-4 gap-4">
                            <Image
                                className="grid rounded-xl h-[100px] border-1"
                                src={`/assets${item.img}`}
                                width={150} height={150} alt="img"
                            />
                            <span className="grid col-span-2">
                                <p>{item.title}</p>
                                <div class="w-[30vh]">
                                    {item.detail.substring(0, 85 - 3) + '...'}
                                </div>
                            </span>
                            <div className="grid"> </div>
                            <p className="grid text-[20px]">{item.price.toString().replace(regex, '$1,')} THB</p>
                            <Button
                                disabled={btDisabled[index]}
                                onClick={() => { handleClickADD(item), handleDis(index) }}
                                className={`px-4 py-2 rounded-md ${btDisabled[index] ?
                                    'bg-gray-300 text-white cursor-not-allowed' :
                                    'bg-[#ffa318] text-white hover:bg-[#f6bc66] hover:shadow-md'}`}
                            >
                                ADD
                            </Button>
                        </div>
                    </>
                ))}
            </>
        )
    }

    return (
        <>
            <Card>
                <CardHeader className="pb-0">
                    <p className="w-full text-center text-[23px]">
                        Ticket
                    </p>
                </CardHeader>

                <CardBody>
                    <Mapticket />
                </CardBody>

            </Card >
        </>
    )
}

export default Table;

