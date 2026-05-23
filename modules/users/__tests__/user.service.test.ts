/***************************************************
 * File: modules/users/__tests__/user.service.test.ts
 * Layer: Service Test
 *
 * Purpose:
 * - Tests business logic of user.service.ts
 *
 * Restrictions:
 * - No real DB
 * - Repository must be mocked
 ***************************************************/

import { describe, it, expect, vi, beforeEach } from "vitest";
import * as userService from "../user.service";
import { userRepository } from "../user.repository";
import { Types } from "mongoose";
import { UserRecord } from "../user.typs";

// 🔴 MOCK DB CONNECT
vi.mock("@/lib/db", () => ({
  default: vi.fn(),
}));

// 🔴 MOCK REPOSITORY
vi.mock("../user.repository", () => ({
  userRepository: {
    findByEmail: vi.fn(),
    create: vi.fn(),
    updateById: vi.fn(),
    updateStatus: vi.fn(),
    deleteById: vi.fn(),
    findAll: vi.fn(),
    count: vi.fn(),
    findById: vi.fn(),
  },
}));

const mockUser: UserRecord = {
  _id: new Types.ObjectId(),
  name: "Rohit",
  email: "rohit@test.com",
  role: "admin",
  status: "active",
  createdAt: new Date(),
  updatedAt: new Date(),
};



beforeEach(() => {
  vi.clearAllMocks();
});

describe("User Service", () => {
  /* ---------------- CREATE USER ---------------- */

  it("should create user when actor is super_admin", async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(null);
    vi.mocked(userRepository.create).mockResolvedValue(mockUser);

    const result = await userService.createUser("super_admin", {
      name: "Rohit",
      email: "rohit@test.com",
      password: "123456",
      role: "admin",
      status: "active"
    });

    expect(result.email).toBe("rohit@test.com");
    expect(userRepository.create).toHaveBeenCalled();
  });

  it("should throw if email already exists", async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(mockUser);

    await expect(
      userService.createUser("super_admin", {
        name: "Rohit",
        email: "rohit@test.com",
        password: "123",
        role: "admin",
        status: "active"
      })
    ).rejects.toThrow("Email already exists");
  });

  it("should deny non-super-admin user creation", async () => {
    await expect(
      userService.createUser("admin", {
        name: "Test",
        email: "test@test.com",
        password: "123",
        role: "admin",
        status: "active"
      })
    ).rejects.toThrow("Only super_admin is allowed to perform this action");
  });

  /* ---------------- UPDATE USER ---------------- */

  it("should update user by id", async () => {
    vi.mocked(userRepository.updateById).mockResolvedValue(mockUser);

    const result = await userService.updateUserBySuperAdmin(
      "super_admin",
      "user123",
      { name: "Updated" }
    );

    expect(result.name).toBe("Rohit");
  });

  it("should throw if user not found on update", async () => {
    vi.mocked(userRepository.updateById).mockResolvedValue(null);

    await expect(
      userService.updateUserBySuperAdmin("super_admin", "badid", {})
    ).rejects.toThrow("User not found");
  });


  /* ---------------- DELETE USER ---------------- */

  it("should allow delete only for super_admin", async () => {
    vi.mocked(userRepository.deleteById).mockResolvedValue(true);

    await expect(
      userService.deleteUser("super_admin", "user123")
    ).resolves.not.toThrow();
  });

  it("should block delete for admin", async () => {
    await expect(
      userService.deleteUser("admin", "user123")
    ).rejects.toThrow("Only super_admin is allowed to perform this action");
  });

  /* ---------------- GET USER ---------------- */

  it("should get user by id", async () => {
    vi.mocked(userRepository.findById).mockResolvedValue(mockUser);

    const result = await userService.getUserById(
      "admin",
      "user123"
    );

    expect(result.email).toBe("rohit@test.com");
  });

  /* ---------------- SUPER ADMIN Authorization ---------------- */

  it("should throw on missing required fields", async () => {
    await expect(
        userService.createUser("super_admin", {
        name: "",
        email: "",
        password: "",
        role: "admin",
        status: "active"
        })
    ).rejects.toThrow("Missing required fields");
  });

});
