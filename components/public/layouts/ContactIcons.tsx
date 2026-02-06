"use client"
import ContactFAB from '../ContactFAB'
import EnquiryStickyTab from '../EnquiryStickyTab'
import EnquiryModal from '../EnquiryModal'
import ContactSection from '../landing-page/ContactSection'
import { useState } from 'react'

export default function ContactIcons() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <ContactFAB/>
        <EnquiryStickyTab onClick={() => setOpen(true)} />
        {/* Modal */}
      <EnquiryModal open={open} onClose={() => setOpen(false)}>
        <ContactSection />
      </EnquiryModal>
    </div>
  )
}
