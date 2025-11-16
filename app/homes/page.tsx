import Head from "next/head";
import HeroSection from "../components/home/HeroSection";
import ServicesGrid from "../components/home/ServicesGrid";
import Promotions from "../components/home/Promotion";
import Destinations from "../components/home/DestinationSection";
import FeaturedTours from "../components/home/FeaturedTours";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Du lịch Thanh Hoá - Đặt tour, khách sạn, vé máy bay</title>
        <meta
          name="description"
          content="Đặt tour du lịch, khách sạn, vé máy bay, combo du lịch và hoạt động với giá tốt"
        />
      </Head>

      <main className="flex-grow">
        <HeroSection />
        <ServicesGrid />
        <FeaturedTours />
        {/* <Promotions /> */}
        <Destinations />
       
      </main>
    </div>
  );
}
