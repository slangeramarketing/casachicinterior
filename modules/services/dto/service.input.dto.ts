/*----------------------------------
        UI → API (SERVICE)

----------------------------------
👉 Rule yaad rakho (important):
        Input DTO me sirf wahi fields hoti hain
        jo UI server ko bhejta hai
        ❌ _id, isActive, createdAt, updatedAt
        ❌ slug auto-generate ho sakta hai
----------------------------------*/

/* ----------------------------------
   SUB TYPES (UI INPUT)
---------------------------------- */

/*
  Service Includes (UI form)
*/
export interface ServiceIncludeInput {
  image: string;
  title: string;
}

/*
  Service Process Step (UI form)
*/
export interface ServiceProcessStepInput {
  icon: string;
  step: number;
  title: string;
  description: string;
}

/* ----------------------------------
   CREATE SERVICE (Admin Panel)
---------------------------------- */
export interface CreateServiceDTO {
  title: string;
  shortDescription: string;
  overview: string;

  coverImage: string;
  galleryImages?: string[];

  includes: ServiceIncludeInput[];
  processSteps: ServiceProcessStepInput[];

  featured?: boolean;

  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

/* ----------------------------------
   UPDATE SERVICE (Admin Panel)
---------------------------------- */
export interface UpdateServiceDTO {
  title?: string;
  shortDescription?: string;
  overview?: string;

  coverImage?: string;
  galleryImages?: string[];

  includes?: ServiceIncludeInput[];
  processSteps?: ServiceProcessStepInput[];

  featured?: boolean;

  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

/* ----------------------------------
   PUBLIC QUERY DTO (Optional)
---------------------------------- */
/*
  For filtering / listing services
  (query params → controller)
*/
export interface ServiceListQueryDTO {
  featured?: boolean;
  isActive?: boolean;
}
