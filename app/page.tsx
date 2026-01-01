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
import { projects } from '@/lib/data/projects/projects'
import { servicesData } from '@/lib/data/services/service.data'
import React, { useState } from 'react'

export default function page() {
  const [open, setOpen] = useState(false);

  const featuredProjects = projects
    .filter((p) => p.featured)
    .slice(0, 3)
    .map((p) => ({
      id: p.id,
      title: p.title,
      slug:p.slug,
      subtitle: p.category,
      description: p.shortDescription,
      image: p.coverImage,
    }));

    const designSolutions = servicesData.map((service) => ({
      id: service.id,
      title: service.title,
      slug: service.slug,
      description: service.shortDescription,
      image: service.coverImage,
    }));

  return (
    <>
     <HeroSection/>
     <ThirdPartyReviews/>
     <ShortAboutSection/>
     <FeaturedProjectsSection projects={featuredProjects} />
     <DesignSolutionsSection services={designSolutions} />
     <WhyChooseUsSection/>
     <DesignProcessSection/>
     <ReviewSection/>
     <ContactSection/>
     <FAQSection/>
      <WhatsAppFAB
          phoneNumber="918740990990"
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
