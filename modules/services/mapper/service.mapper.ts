import {
  ServiceListItemDTO,
  ServiceDetailDTO,
  AdminServiceDTO,
} from "../dto/service.output.dto";
import { IService } from "../service.model";

/* -----------------------------
    Mapper Helpers
--------------------------------*/

/*
  Base Mapping (Internal Use)
  ❗ DB document → plain object
*/
function mapBaseService(service: IService) {
  return {
    id: service._id.toString(),
    title: service.title,
    slug: service.slug,
    featured: service.featured,
    isActive: service.isActive,
    createdAt: service.createdAt.toISOString(),
    updatedAt: service.updatedAt.toISOString(),
  };
}

/* ----------------------------------
   Output Mappers
----------------------------------- */

/*
  Use-case: Public UI
  (All Services Page)
*/
export function mapToServiceListItemDTO(
  service: IService
): ServiceListItemDTO {
  return {
    id: service._id.toString(),
    title: service.title,
    slug: service.slug,
    shortDescription: service.shortDescription,
    coverImage: service.coverImage,
    featured: service.featured,
  };
}

/*
  Use-case: Public UI
  (Single Service Detail Page)
*/
export function mapToServiceDetailDTO(
  service: IService
): ServiceDetailDTO {
  return {
    id: service._id.toString(),

    title: service.title,
    slug: service.slug,

    shortDescription: service.shortDescription,
    overview: service.overview,

    coverImage: service.coverImage,
    galleryImages: service.galleryImages || [],

    includes: service.includes.map((item) => ({
      image: item.image,
      title: item.title,
    })),

    processSteps: service.processSteps
      .sort((a, b) => a.step - b.step) // 🔥 important
      .map((step) => ({
        icon: step.icon,
        step: step.step,
        title: step.title,
        description: step.description,
      })),

    seo: service.seo,
  };
}

/*
  Use-case: Admin Dashboard
  (Service table / list)
*/
export function mapToAdminServiceDTO(
  service: IService
): AdminServiceDTO {
  return {
    ...mapBaseService(service),
  };
}
