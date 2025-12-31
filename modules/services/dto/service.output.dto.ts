/*----------------------------------
        API → UI (SERVICE)

----------------------------------
👉 Rule yaad rakho:
        Output DTO me wahi fields honi chahiye
        jo UI ko render karni hain
        ❌ Mongo _id, __v
----------------------------------*/

/* ----------------------------------
   SUB TYPES (OUTPUT)
---------------------------------- */

/*
  Service Includes (UI render)
*/
export interface ServiceIncludeOutput {
  image: string;
  title: string;
}

/*
  Service Process Step (UI render)
*/
export interface ServiceProcessStepOutput {
  icon: string;
  step: number;
  title: string;
  description: string;
}

/* ----------------------------------
   SERVICE LIST ITEM (All Services Page)
---------------------------------- */
export interface ServiceListItemDTO {
  id: string; // mapped from _id
  title: string;
  slug: string;
  shortDescription: string;
  coverImage: string;
  featured: boolean;
}

/* ----------------------------------
   SERVICE DETAIL (Single Service Page)
---------------------------------- */
export interface ServiceDetailDTO {
  id: string;

  title: string;
  slug: string;

  shortDescription: string;
  overview: string;

  coverImage: string;
  galleryImages: string[];

  includes: ServiceIncludeOutput[];
  processSteps: ServiceProcessStepOutput[];

  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

/* ----------------------------------
   ADMIN SERVICE ITEM (Dashboard)
---------------------------------- */
export interface AdminServiceDTO {
  id: string;

  title: string;
  slug: string;

  featured: boolean;
  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}
