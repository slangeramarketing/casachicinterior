
import { UserAdminDetailDTO, UserAuthDTO, UserListDTO, UserPublicDTO } from "../dto/user.output.dto";
import { IUser } from "../user.model";


/* -----------------------------
    Mapper Helpers
--------------------------------*

/* -------------
    Base Mapping (Internal Use)
-----------------*/
function mapBaseUser(user:IUser){
    return{
        id:user._id.toString(),
        name:user.name,
        email:user.email,
        role:user.role,
        status:user.status,
        createdAt:user.createdAt.toISOString(),
    }
}

/* ----------------------------------
   Output Mappers
----------------------------------- */

/*
  Use-case: Login / Me API
*/

export function mapToUserAuthDTO(user:IUser):UserAuthDTO{
    return {
        ...mapBaseUser(user),
    };
}

/*
  Use-case: Admin dashboard - user list
*/
export function mapTOUserListDTO(user:IUser):UserListDTO{
       return{
        id:user._id.toString(),
        name:user.name,
        email:user.email,
        role:user.role,
        status:user.status,
        createdAt:user.createdAt.toISOString(),
       };
}

/*
  Use-case: Admin - single user detail
*/
export function mapToUserAdminDetailDTO(user:IUser):UserAdminDetailDTO{
       return{
        ...mapBaseUser(user),
        isBlocked:user.isBlocked,
        updatedAt:user.updatedAt.toISOString(),
       };
}


/*
  Use-case: Public UI (comments, blogs, reviews)
*/
export function mapToUserPublicDTO(user:IUser):UserPublicDTO{
       return{
        id:user._id.toString(),
        name:user.name,
       };
}