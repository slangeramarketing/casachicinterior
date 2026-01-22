  /***************************************************
   * File: modules/services/service.server.ts
   * Layer: Server Facade
   *
   * Purpose:
   * - Acts as Next.js–specific server adapter for Service module
   *
   * Responsibilities:
   * - Perform auth & role checks for WRITE operations
   * - Call service layer only
   * - Apply mapper before returning data
   *
   * Restrictions:
   * - Must NOT access repository directly
   * - Must NOT contain business logic
   * - Must NOT return raw DB records
   *
   * Notes:
   * - This file exports a stateless object with methods
   ***************************************************/
  /***************************************************
   * File: modules/services/service.server.ts
   * Layer: Server Facade (Adapter for Next.js)
   ***************************************************/
import { 
  createService, 
  deleteService, 
  getServiceById, 
  getServiceBySlug, 
  listServices, 
  updateService 
} from "./service.service";
import { serviceMapper } from "./service.mapper";
import { CreateServiceDTO, UpdateServiceDTO, ServiceResponseDTO } from "./service.dto";
import { getAuthUser } from "@/lib/auth";

/* -------------------------------------
   Server Facade Object
------------------------------------- */
export const serviceServer = {
  /* =============================
      READ OPERATIONS (Public & Admin)
  ============================= */

  /**
   * Get all services (Admin view)
   * Ab ye Populated Category ke saath aayega
   */
  async getAll(): Promise<ServiceResponseDTO[]> {
    const records = await listServices(); 
    // Mapper ab populated record ko handle karega
    return serviceMapper.toResponseList(records);
  },

  /**
   * Get FEATURED services (Public)
   */
  async getFeatured(limit = 5): Promise<ServiceResponseDTO[]> {
    const records = await listServices({
      publicOnly: true,
      featured: true,
      limit,
    });
    return serviceMapper.toResponseList(records);
  },

  /**
   * Get all published services
   */
  async getPublic(options?: { categoryId?: string; featured?: boolean }): Promise<ServiceResponseDTO[]> {
    const records = await listServices({
      publicOnly: true,
      categoryId: options?.categoryId,
      featured: options?.featured,
    });
    return serviceMapper.toResponseList(records);
  },

  /**
   * Get service by ID (For Admin View/Edit)
   */
  async getById(id: string): Promise<ServiceResponseDTO | null> {
    const record = await getServiceById(id);
    if (!record) return null;
    return serviceMapper.toResponse(record);
  },

  /**
   * Get service by slug (For Public Detail Page)
   */
  async getBySlug(slug: string): Promise<ServiceResponseDTO | null> {
    const record = await getServiceBySlug(slug);
    if (!record) return null;
    return serviceMapper.toResponse(record);
  },

  /* =============================
      WRITE OPERATIONS (Admin Only)
  ============================= */

  /**
   * Create a new Service
   */
  async create(data: CreateServiceDTO): Promise<ServiceResponseDTO> {
    const user = await getAuthUser();
    if (!user || !["admin", "super_admin"].includes(user.role)) {
      throw new Error("Unauthorized: Admin access required.");
    }

    const record = await createService(data as any);
    // Note: createService populated record return nahi karta (standard flow), 
    // isliye mapper populated check karke handle kar lega.
    return serviceMapper.toResponse(record as any);
  },

  /**
   * Update existing Service
   */
  async update(id: string, data: UpdateServiceDTO): Promise<ServiceResponseDTO | null> {
    const user = await getAuthUser();
    if (!user || !["admin", "super_admin"].includes(user.role)) {
      throw new Error("Unauthorized");
    }

    const record = await updateService(id, data as any);
    if (!record) return null;

    return serviceMapper.toResponse(record);
  },

  /**
   * Permanently delete a service
   */
  async remove(id: string): Promise<boolean> {
    const user = await getAuthUser();
    if (!user || !["admin", "super_admin"].includes(user.role)) {
      throw new Error("Unauthorized");
    }

    return deleteService(id);
  },
};