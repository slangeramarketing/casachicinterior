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
import React, { useState } from 'react'

interface HeaderProps {
  featuredServiceList:ServiceResponseDTO[];
}

export default function LandingPage({featuredServiceList}:HeaderProps) {
  const [open, setOpen] = useState(false);
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
      <WhatsAppFAB
          phoneNumber="919876543210"
          message="Hi, I saw your portfolio and want to connect"
        />

        <EnquiryStickyTab onClick={() => setOpen(true)} />
        {/* Modal */}
      <EnquiryModal open={open} onClose={() => setOpen(false)}>
        <ContactSection />
      </EnquiryModal>
    </>
  )
}
