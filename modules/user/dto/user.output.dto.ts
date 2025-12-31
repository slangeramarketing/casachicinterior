/*----------------------------------
              API → UI
-----------------------------------*/

import { UserRole, UserStatus } from "../user.model";

/*
  Base User DTO
  (System → UI safe structure)
*/

export interface UserBaseDTO{
    id:string;
    name?:string;
    email:string;
    role:UserRole;
    status:UserStatus;
    createdAt:string;
}

/*
  Use-case: Auth / Login / Me API
*/
export interface UserAuthDTO extends UserBaseDTO{}


/*
  Use-case: Admin dashboard - user list
*/

export interface UserListDTO{
  id:string;
  name?:string;
  email:string;
  role:UserRole;
  status:UserStatus;
  createdAt:string;
}

/*
  Use-case: Admin - single user detail
*/
export interface UserAdminDetailDTO extends UserBaseDTO{
  isBlocked:boolean;
  updatedAt:string;
}

/*
  Use-case: Public UI (comments, blogs, reviews)
*/
export interface UserPublicDTO{
  id:string;
  name?:string;
}