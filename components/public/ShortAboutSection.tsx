import Image from "next/image";

export default function ShortAboutSection() {
  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* LEFT CONTENT */}
        <div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-snug">
            Designing Spaces
            <br />
            Where Luxury Meets{" "}
            <span className="text-orange-500">Comfort</span>
          </h2>

          <p className="mt-6 text-gray-600 text-sm md:text-base leading-relaxed max-w-lg">
            CasaChicInterior is a boutique-interior design studio dedicated
            to transforming your spaces into elegant, functional homes.
            With a passion for modern aesthetics and comfort, we craft
            living spaces that reflect your personality and lifestyle.
          </p>
        </div>

        {/* RIGHT IMAGES */}
        <div className="relative grid grid-cols-2 gap-6">

          {/* Large Image */}
          <div>
            <Image
              src="/media/static/short-about-img1.png"
              alt="Luxury living room interior"
              width={200}
              height={200}
              className="rounded-xl object-cover w-full"
            />
          </div>

          {/* Small Image 1 */}
          <div className="flex justify-items-end items-end">
            <Image
              src="/media/static/short-about-img2.png"
              alt="Modern sofa interior"
              width={300}
              height={220}
              className="rounded-xl object-cover w-full"
            />
          </div>

          {/* Small Image 2 */}
          <div className="col-span-2 lg:w-100">
            <Image
              src="/media/static/short-about-img3.png"
              alt="Minimal home interior"
              width={300}
              height={220}
              className="rounded-xl object-cover w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
