"use client"
import ContactSection from '@/components/public/ContactSection'
import DesignProcessSection from '@/components/public/DesignProcessSection'
import DesignSolutionsSection from '@/components/public/DesignSolutionsSection'
import EnquiryModal from '@/components/public/EnquiryModal'
import EnquiryStickyTab from '@/components/public/EnquiryStickyTab'
import FAQSection from '@/components/public/FAQSection'
import FeaturedProjectsSection from '@/components/public/FeaturedProjectsSection'
import HeroSection from '@/components/public/HeroSection'
import ReviewSection from '@/components/public/ReviewSection'
import ShortAboutSection from '@/components/public/ShortAboutSection'
import ThirdPartyReviews from '@/components/public/ThirdPartyReviews'
import WhatsAppFAB from '@/components/public/WhatsAppFAB'
import WhyChooseUsSection from '@/components/public/WhyChooseUsSection'
import { ServiceResponseDTO } from '@/modules/services/service.dto'
import { useEffect, useState } from 'react'
import { getFeaturedServicesAction } from './actions/public.service.action'
import PhoneFAB from '@/components/public/PhoneFAB'
import InstagramFAB from '@/components/public/InstagramFAB'
import ContactFAB from '@/components/public/ContactFAB'

export default function LandingPage() {
  const [open, setOpen] = useState(false);
  const [featuredServiceList, setFeaturedServiceList]=useState<ServiceResponseDTO[]>([]);

  /* ===============================
     Fetched Featured Services
     ================================== */
  useEffect(()=>{
    async function loadService(){
      try{
        const services=await getFeaturedServicesAction();
        setFeaturedServiceList(services);
      }catch(err){
        console.error("Error fetching featured services:", err);
      }
    }

    loadService();
  },[]);
  
  return (
    <>
     <HeroSection/>
     <ThirdPartyReviews/>
     <ShortAboutSection/>
     <FeaturedProjectsSection/>
     <DesignSolutionsSection featuredServiceList={featuredServiceList} />
     <WhyChooseUsSection/>
     <DesignProcessSection/>
     <ReviewSection/>
     <ContactSection/>
     <FAQSection/>
     <ContactFAB/>
      {/* <WhatsAppFAB
          phoneNumber="919876543210"
          message="Hi, I saw your portfolio and want to connect"
        />
        <PhoneFAB phoneNumber="+919876543210" />

        <InstagramFAB profileUrl="https://instagram.com/casachicinterior" /> */}

        <EnquiryStickyTab onClick={() => setOpen(true)} />
        {/* Modal */}
      <EnquiryModal open={open} onClose={() => setOpen(false)}>
        <ContactSection />
      </EnquiryModal>
    </>
  )
}
