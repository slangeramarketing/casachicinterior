/***************************************************
 * File: modules/design-process/design-process.types.ts
 * Layer: Types
 *
 * Purpose:
 * - Internal domain types for DesignProcess
 *
 * Used by:
 * - Repository
 * - Service layer
 *
 * Restrictions:
 * - Must reflect DB record shape
 ***************************************************/

import { Types } from "mongoose";

export interface DesignProcessRecord {
  _id: Types.ObjectId;

  serviceId: Types.ObjectId;

  title: string;
  description: string;

  icon?: string; // e.g. "fi:FiEdit3"

  stepOrder: number;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}
