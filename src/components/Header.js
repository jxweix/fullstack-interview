import Image from "next/image";

const Header = () => {
  return (
    <>
      <div className="bg-[#ffa318] h-[8vh] p-[2vh] pl-[3vh] gap-4 text-white flex items-center text-[35px]">
        <Image src={"/assets/logo.webp"} width={130} height={80} alt="logo" />
        <p>Ticket2Attraction</p>
      </div>
    </>
  )
};

export default Header;
