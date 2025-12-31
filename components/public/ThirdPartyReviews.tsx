import Image from "next/image";

type ReviewPlatform = {
  name: string;
  image: string;
  alt: string;
};

const reviewPlatforms: ReviewPlatform[] = [
  {
    name: "Google Reviews",
    image: "/media/static/googleReview.png",
    alt: "Google Reviews rating",
  },
  {
    name: "GoodFirms",
    image: "/media/static/goodFirms.png",
    alt: "GoodFirms rating",
  },
  {
    name: "Trustpilot",
    image: "/media/static/Trustpilot.png",
    alt: "Trustpilot rating",
  },
  {
    name: "Houzz",
    image: "/media/static/hauzzReview.png",
    alt: "Houzz rating",
  },
];

export default function ThirdPartyReviews() {
  return (
    <section className="w-full bg-[#f7f7f7] py-10">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 items-center">
          {reviewPlatforms.map((platform) => (
            <div
              key={platform.name}
              className="flex justify-center items-center grayscale hover:grayscale-0 transition"
            >
              <Image
                src={platform.image}
                alt={platform.alt}
                width={90}
                height={30}
                className="object-contain"
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
