import Service from "./service.model";
import {
  CreateServiceDTO,
  UpdateServiceDTO,
} from "./dto/service.input.dto";
import {
  mapToServiceListItemDTO,
  mapToServiceDetailDTO,
  mapToAdminServiceDTO,
} from "./mapper/service.mapper";
import db from "@/lib/db";

/* -------------------------------------
   CREATE SERVICE (Admin only)
------------------------------------- */
export async function createService(data: CreateServiceDTO) {
    await db();
  /*
    1️⃣ Slug generation
    - derived from title
    - UI never sends slug
  */
  const slug = data.title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  /*
    2️⃣ Slug uniqueness check
    - Business rule
  */
  const existing = await Service.findOne({ slug });
  if (existing) {
    throw new Error("Service with this title already exists");
  }

  /*
    3️⃣ Create service
  */
  const service = await Service.create({
    ...data,
    slug,
  });

  /*
    4️⃣ Map document → DTO
  */
  const serviceDTO = mapToAdminServiceDTO(service);
  return { service: serviceDTO };
}

/* -------------------------------------
   GET ALL SERVICES (PUBLIC)
------------------------------------- */
export async function getPublicServices() {
  /*
    Only active services
  */
  const services = await Service.find({ isActive: true })
    .sort({ featured: -1, createdAt: -1 });

  const serviceDTOs = services.map(mapToServiceListItemDTO);

  return { services: serviceDTOs };
}

/* -------------------------------------
   GET SINGLE SERVICE (PUBLIC)
------------------------------------- */
export async function getPublicServiceBySlug(slug: string) {
  const service = await Service.findOne({
    slug,
    isActive: true,
  });

  if (!service) {
    throw new Error("Service not found");
  }

  const serviceDTO = mapToServiceDetailDTO(service);
  return { service: serviceDTO };
}

/* -------------------------------------
   GET ALL SERVICES (ADMIN)
------------------------------------- */
export async function getAdminServices() {
  const services = await Service.find().sort({ createdAt: -1 });

  const serviceDTOs = services.map(mapToAdminServiceDTO);

  return { services: serviceDTOs };
}

/* -------------------------------------
   GET SINGLE SERVICE (ADMIN)
------------------------------------- */
export async function getAdminServiceById(serviceId: string) {
  const service = await Service.findById(serviceId);

  if (!service) {
    throw new Error("Service not found");
  }

  const serviceDTO = mapToAdminServiceDTO(service);
  return { service: serviceDTO };
}

/* -------------------------------------
   UPDATE SERVICE (Admin only)
------------------------------------- */
export async function updateService(
  serviceId: string,
  data: UpdateServiceDTO
) {
  /*
    1️⃣ Update
    - slug is NOT editable
  */
  const service = await Service.findByIdAndUpdate(
    serviceId,
    { ...data },
    { new: true }
  );

  if (!service) {
    throw new Error("Service not found");
  }

  /*
    2️⃣ Map → DTO
  */
  const serviceDTO = mapToAdminServiceDTO(service);
  return { service: serviceDTO };
}

/* -------------------------------------
   DELETE SERVICE (Admin only)
------------------------------------- */
export async function deleteService(serviceId: string) {
  const service = await Service.findById(serviceId);

  if (!service) {
    throw new Error("Service not found");
  }

  /*
    Hard delete
    (soft delete chahiye ho to isActive=false kar do)
  */
  await service.deleteOne();

  return { success: true };
}
