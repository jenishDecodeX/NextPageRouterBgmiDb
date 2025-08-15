import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const games = [
    { title: "Andy", image: "/character/andy.jpeg", fee: "1200 UC" },
    { title: "Sophia", image: "/character/sophia.jpeg", fee: "900 UC" },
    { title: "Victor", image: "/character/victor.jpg", fee: "Free" },
    { title: "Emilia", image: "/character/emilia.jpg", fee: "600 UC" },
    { title: "Sara", image: "/character/sara.jpeg", fee: "600 UC" },
    { title: "Carlo", image: "/character/carlo.jpeg", fee: "1200 UC" },
    { title: "Anna", image: "/character/anna.jpeg", fee: "600 UC" },
    { title: "Laith", image: "/character/laith.jpeg", fee: "900 UC" },
    { title: "Lorenzo", image: "/character/lorenzo.jpeg", fee: "600 UC" },
    { title: "Raily", image: "/character/raily.jpeg", fee: "600 UC" },
];

export default function Character() {
    return (
        <section className="bg-[#0d0d0d] py-16 px-4 text-white text-center">
            <p className="text-green-500 text-sm font-medium mb-2">
                # Pubg Game Character
            </p>
            <h2 className="text-3xl font-bold mb-10">
                Game On, Power Up, Win Big!
            </h2>

            <Swiper
                slidesPerView={1}
                spaceBetween={20}
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                modules={[Pagination, Autoplay]}
                breakpoints={{
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 4 },
                }}
                className="w-full max-w-6xl mx-auto custom-swiper-pagination"
            >
                {games.map((game, index) => (
                    <SwiperSlide className="min-h-[350px]" key={index}>
                        <div className="bg-[#151515] rounded-xl p-3 border border-[#333] hover:shadow-lg transition-all duration-300 w-full max-w-[240px] mx-auto">
                            {/* Image */}
                            <div className="relative w-full h-50 mb-4 rounded-lg overflow-hidden">
                                <Image
                                    src={game.image}
                                    alt={game.title}
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-semibold mb-1">{game.title}</h3>

                            {/* Price */}
                            <p className="text-sm text-gray-400 flex items-center justify-center gap-1">
                                Price:{" "}
                                {game.fee.toLowerCase() === "free" ? (
                                    <span className="text-green-500">{game.fee}</span>
                                ) : (
                                    <>
                                        <span className="text-green-500">
                                            {game.fee.replace(" UC", "")}
                                        </span>
                                        <Image
                                            src="/uc.png"
                                            alt="UC"
                                            width={18}
                                            height={18}
                                        />
                                    </>
                                )}
                            </p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}
