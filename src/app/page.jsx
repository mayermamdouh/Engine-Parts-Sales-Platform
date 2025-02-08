
import Image from "next/image";
import Link from "next/link";
import { GiPayMoney, GiReturnArrow } from "react-icons/gi";
import { TbTruckDelivery } from "react-icons/tb";
import { RiCustomerService2Fill } from "react-icons/ri";
import Carousel from "./components/Carousel";
import InformationCar from "./components/FilterCar";

// Static image imports
import engine from "./assets/engine.webp";
import brake from "./assets/brakes.webp";
import tires from "./assets/kwatsh.webp";
import filtersAndOils from "./assets/oils.webp";
import ElectricalSysteam from "./assets/eelectrical.webp";
import suspension from "./assets/suspension.webp";
import lighting from "./assets/lights.webp";
import batteries from "./assets/batry.webp";
import Sparkplugs from "./assets/Sparkplugss.webp";
import accessories from "./assets/Accessories.webp";



export default function Home() {
  // Define sections inside the component
  const sections = [
    {
      image: engine,
      text: "قطع المحرك",
      link: "/products?category=Engine_Parts",
    },
    // {
    //   image: brake,
    //   text: "الفرامل",
    //   link: "/products?category=brakes",
    // },
    {
      image: tires,
      text: "الإطارات والعجلات",
      link: "/products?category=Tires",
    },
    {
      image: filtersAndOils,
      text: "الزيوت",
      link: "/products?category=Oils",
    },
    // {
    //   image: ElectricalSysteam,
    //   text: "النظام الكهربائي",
    //   link: "/products?category=electricals",
    // },
    // {
    //   image: suspension,
    //   text: "التعليق",
    //   link: "/products?category=suspensions",
    // },
    // {
    //   image: lighting,
    //   text: "الإضاءة",
    //   link: "/products?category=lighting",
    // },
    {
      image: batteries,
      text: "البطاريات",
      link: "/products?category=Batteries",
    },
    {
      image: Sparkplugs,
      text: "بوجيهات",
      link: "/products?category=Spark_Plugs",
    },
    {
      image: accessories,
      text: "الإكسسوارات",
      link: "/products?category=Accessories",
    },
  ];
  
  return (
    <>
      <div className="flex flex-col w-full bg-gray-100 ">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-3">
          <Carousel images={[engine, brake, tires]} />
          <InformationCar />
        </div>
        <div className="flex flex-col gap-3 mt-5 items-center justify-center p-3">
          <div className="text-2xl font-bold"> تسوق الأقسام</div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 ">
            {sections.map((section, index) => (
              <Link href={section.link} key={index}>
                <div className="h-64 w-full relative overflow-hidden cursor-pointer rounded-md">
                  <Image
                    src={section.image}
                    alt="section image"
                    priority
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    quality={75}
                    width={500} 
                    height={300}
                  />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl md:text-3xl font-bold text-center drop-shadow-xl">
                    {section.text}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="bg-gray-100 mt-5 flex flex-col py-10 sm:flex-row gap-6 h-auto items-center border-t ">
          <div className="flex flex-row basis-1/4 justify-center gap-2 items-center">
            <div> 01210567733 للتواصل </div>
            <RiCustomerService2Fill className="h-8 w-8 text-darkSlate" />
          </div>
          <div className="flex flex-row basis-1/4 justify-center gap-2 items-center">
            <div className="text-right"> يوم للمرتجع</div>
            <div className="font-bold">15</div>
            <GiReturnArrow className="h-8 w-8 text-darkSlate" />
          </div>
          <div className="flex flex-row basis-1/4 justify-center gap-2 items-center">
            <div>التوصيل السريع</div>
            <TbTruckDelivery className="h-8 w-8 text-darkSlate" />
          </div>
          <div className="flex flex-row basis-1/4 justify-center items-center gap-2">
            <div>الدفع عند الاستلام</div>
            <GiPayMoney className="w-8 h-8 text-darkSlate" />
          </div>
        </div>
      </div>
    </>
  );
}
