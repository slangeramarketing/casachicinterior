
import LandingPage from '@/components/public/landing-page/LandingPage';
import { reviewServer } from '@/modules/review/review.server'

export default async function page() {
    const reviewData = await reviewServer.getPublicFeaturedReviews();
    console.log("ReviewData: ",reviewData);
  
  return (
    <div>
      <LandingPage reviews={reviewData} />
    </div>
  );
}
