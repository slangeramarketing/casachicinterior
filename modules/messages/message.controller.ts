/***************************************************
 * File: modules/messages/message.controller.ts
 * Layer: Controller
 *
 * Purpose:
 * - Exposes public HTTP APIs for Message module
 *
 * Responsibilities:
 * - Handle request/response lifecycle
 * - Delegate business logic to service
 * - Apply mapper before responding
 *
 * Restrictions:
 * - Must NOT contain business logic
 ***************************************************/

import {
  createMessage,
  getMessageById,
} from "./message.service";

import { messageMapper } from "./message.mapper";

export const messageController = {
  /**
   * Purpose:
   * - Handle public contact form submission
   *
   * Used By:
   * - Public API / Mobile client
   */
  async submit(req: any, res: any) {
    const record = await createMessage(req.body);
    const response = messageMapper.toResponse(record);

    return res.status(201).json(response);
  },

  /**
   * Purpose:
   * - Fetch a single message thread
   *
   * Used By:
   * - Public / Mobile (if allowed)
   */
  async getById(req: any, res: any) {
    const record = await getMessageById(req.params.id);
    const response = messageMapper.toResponse(record);

    return res.json(response);
  },
};
