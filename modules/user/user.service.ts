import User, {UserRole } from "./user.model";
import { signToken } from "@/lib/auth";
import { AdminCreateUserDTO, AdminUpdateUserDTO } from "./dto/user.input.dto";
import { mapToUserAdminDetailDTO, mapToUserAuthDTO, mapTOUserListDTO } from "./mapper/user.mapper";
import { getAuthUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";


/* -------------------------------------
   Register User
------------------------------------- */
export async function registerUser(data: AdminCreateUserDTO){
  /*
    1️⃣ Email uniqueness check
    - Business rule
  */
  const existingUser=await User.findOne({email:data.email});
  if(existingUser){
    throw new Error("User with this email alrady exists");
  }

  
  /*
    2️⃣ Create user
    - role comes from admin input
    - password hashing handled by model hook
  */

  const user=await User.create({
    name:data.name,
    email:data.email,
    password:data.password,
    role:data.role,
  });

  /*
    3️⃣ Map mongoose document → DTO
    - Service never returns document
  */

  const userDTO=mapToUserAdminDetailDTO(user);
  return {user:userDTO};
}



/* -------------------------------------
   Login User
------------------------------------- */
export async function loginUser(email:string , password:string):
      Promise<{
        user:ReturnType<typeof mapToUserAuthDTO>
        token:string;
      }>{

        /*
          1️⃣ Find user (with password)
        */
        const user=await User.findOne({email}).select("+password");

        if(!user){
          throw new Error("Invalid credentials");
        }

        /*
          2️⃣ Account state check
        */
        
        if(user.isBlocked || user.status !=="active"){
          throw new Error("Account is inactive or blocked");
        }

        /*
          3️⃣ Password verification
        */

        const isMatch=await user.comparePassword(password);
        if(!isMatch){
          throw new Error("Invalid credentials");
        }

        /*
          4️⃣ Generate JWT token
          - Login = token issue point
        */

        const token = signToken({
          id:user._id.toString(),
          email:user.email,
          role:user.role,
          status:user.status,
          isBlocked:user.isBlocked,
        });

         /*
          5️⃣ Map mongoose document → DTO
          - Service never returns document
        */

        const userDTO=mapToUserAuthDTO(user);

        return{
          user:userDTO,
          token,
        };

}



/* -------------------------------------
   Get User By ID (Service)
------------------------------------- */
export async function getUserById(userId:string){
  /*
    1️⃣ Find user by ID
    - Service DB se data laati hai
  */
   
  const user=await User.findById(userId);

  if(!user){
    /*
      Business error
      - Controller isko HTTP response me convert karega
    */
   throw new Error("User not found");
  }

  /*
    3️⃣ Map mongoose document → DTO
    - Service never returns document
  */
  const userDTO=mapToUserAuthDTO(user);
  return userDTO;
}


/* -------------------------------------
   Get All Users (Service)
------------------------------------- */
export async function getAllUsers({page,limit}:{page:number; limit:number}){
  
  const authUser = await getAuthUser();
  if (
    !authUser ||
    (authUser.role !== "admin" &&
      authUser.role !== "super_admin")
  ) {
    redirect("/login");
  }

  /*
    1️⃣ Pagination calculation
  */ 
  const skip=(page-1)*limit;

  /*
    2️⃣ Fetch users from DB
    - Sorted by latest first (admin-friendly)
  */

  const users=await User.find()
    .sort({createdAt: -1})
    .skip(skip)
    .limit(limit);
  
  /*
    3️⃣ Total count (for pagination UI)
  */

  const total=await User.countDocuments();

  /*
    4️⃣ Map mongoose documents → DTOs
    - Service never returns documents
  */
  
  const userList=users.map(mapTOUserListDTO);

  /*
    5️⃣ Return pagination-friendly result
  */

  return{
    users:userList,
    total,
    page,
    limit,
  };
}



/* -------------------------------------
   Update User (Service)
------------------------------------- */
export async function updateUser(
  userId: string,
  data: AdminUpdateUserDTO
) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // apply allowed fields only
  if (data.name !== undefined) user.name = data.name;
  if (data.email !== undefined) user.email = data.email;
  if (data.role !== undefined) user.role = data.role;
  if (data.status !== undefined) user.status = data.status;

  await user.save();

  return mapToUserAdminDetailDTO(user);
}



/* -------------------------------------
   Block / Unblock User (Service)
------------------------------------- */
export async function setUserBlockStatus(
  userId: string,
  isBlocked: boolean
) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.isBlocked = isBlocked;
  user.status = isBlocked ? "blocked" : "active";

  await user.save();

  return mapToUserAdminDetailDTO(user);
}




/* -------------------------------------
   Delete User (Service)
------------------------------------- */
export async function deleteUser(userId: string) {
  const user = await User.findByIdAndDelete(userId);
  if (!user) throw new Error("User not found");
  return true;
}
