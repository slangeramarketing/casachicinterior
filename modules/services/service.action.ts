"use server";

import { getAuthUser } from "@/lib/auth-server";

import {
  createService,
  updateService,
  deleteService,
  getAdminServices,
  getAdminServiceById,
} from "./service.service";

import {
  CreateServiceDTO,
  UpdateServiceDTO,
} from "./dto/service.input.dto";
import { uploadImage } from "@/lib/uploadImage";



/* -------------------------------------
   Role Guard
------------------------------------- */
function assertAdmin(authUser: Awaited<ReturnType<typeof getAuthUser>>) {
  if (!authUser) throw new Error("Unauthorized");
  if (authUser.role !== "admin" && authUser.role !== "super_admin") {
    throw new Error("Forbidden");
  }
}

/* -------------------------------------
   CREATE SERVICE (WITH FILES)
------------------------------------- */
export async function createServiceAction(
  formData: FormData
) {
  const authUser = await getAuthUser();
  assertAdmin(authUser);

  try {
    /* ----------------------------
       1️⃣ BASIC FIELDS
    ---------------------------- */
    const title = formData.get("title") as string;
    const shortDescription = formData.get("shortDescription") as string;
    const overview = formData.get("overview") as string;
    const featured = formData.get("featured") === "true";

    /* ----------------------------
       2️⃣ COVER IMAGE
    ---------------------------- */
    const coverFile = formData.get("coverImage") as File;
    const coverImage = await uploadImage(coverFile, "services");

    /* ----------------------------
       3️⃣ GALLERY
    ---------------------------- */
    const galleryFiles = formData.getAll("galleryImages") as File[];
    const galleryImages = await Promise.all(
      galleryFiles.map((file) =>
        uploadImage(file, "services")
      )
    );

    /* ----------------------------
       4️⃣ INCLUDES
    ---------------------------- */
    // Includes text
    const includesText = JSON.parse(
      formData.get("includes") as string
    );

    // Includes images
    const includeImages = formData.getAll("includeImages") as File[];

    const includes = await Promise.all(
      includesText.map(async (item: any, index: number) => ({
        title: item.title,
        image: await uploadImage(includeImages[index], "services"),
      }))
    );


    /* ----------------------------
       5️⃣ PROCESS STEPS
    ---------------------------- */
    // Process text
    const processSteps = JSON.parse(
      formData.get("processSteps") as string
    );



    /* ----------------------------
       6️⃣ DTO BUILD
    ---------------------------- */
    const dto: CreateServiceDTO = {
      title,
      shortDescription,
      overview,
      coverImage,
      galleryImages,
      includes,
      processSteps,
      featured,
    };

    return await createService(dto);
  } catch (error: any) {
    throw new Error(error.message || "Service creation failed");
  }
}




/* -------------------------------------
   UPDATE SERVICE (ADMIN)
------------------------------------- */
export async function updateServiceAction(
  serviceId: string,
  data: UpdateServiceDTO
) {
  const authUser = await getAuthUser();
  assertAdmin(authUser);

  return await updateService(serviceId, data);
}

/* -------------------------------------
   DELETE SERVICE (ADMIN)
------------------------------------- */
export async function deleteServiceAction(
  serviceId: string
) {
  const authUser = await getAuthUser();
  assertAdmin(authUser);

  return await deleteService(serviceId);
}

/* -------------------------------------
   GET ALL SERVICES (ADMIN)
------------------------------------- */
export async function getAdminServicesAction() {
  const authUser = await getAuthUser();
  assertAdmin(authUser);

  return await getAdminServices();
}

/* -------------------------------------
   GET SINGLE SERVICE (ADMIN)
------------------------------------- */
export async function getAdminServiceByIdAction(
  serviceId: string
) {
  const authUser = await getAuthUser();
  assertAdmin(authUser);

  return await getAdminServiceById(serviceId);
}
