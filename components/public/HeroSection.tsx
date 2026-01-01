import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center">

      <div className="w-full lg:h-[780px]">
        <Image
          src="/media/static/hero-wallpaper.png"
          alt="Luxury interior design"
          fill
          priority
          className="object-cover lg:object-fit object-bottom-left lg:object-center"     
        />
      </div>



      {/* Overlay (for text readability) */}
      <div className="absolute inset-0" >

      {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 flex justify-center items-center mt-32">
          <div className="max-w-[700px] bg-[#f9741616] lg:bg-[#f9741614] backdrop-blur-3xl  lg:backdrop-blur-sm p-8 md:p-10 rounded-md">

            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              <span>
                Beautiful Homes Made
              </span>
              <br />
              <span>
                For You
              </span>
            </h1>

            <h2 className="mt-4 text-lg md:text-xl font-semibold text-white">
              Where Luxury Meets Comfort
            </h2>

            <p className="mt-3 text-sm md:text-base text-white/90">
              India’s most trusted home interior design service with
              50,000+ happy homes delivered
            </p>

            <Link
              href="/contact"
              className="inline-block mt-6 bg-bg-primary hover:bg-white hover:text-black text-white px-6 py-3 rounded-full text-sm font-semibold transition"
            >
              Book Free Consultation
            </Link>
          </div>
      </div>
      </div>
    </section>
  );
}
