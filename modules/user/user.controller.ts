import { NextRequest, NextResponse } from "next/server";
import {
  registerUser,
  loginUser,
  getUserById,
  getAllUsers,
  updateUser,
  setUserBlockStatus,
  deleteUser,
} from "./user.service";
import { AdminCreateUserDTO, AdminUpdateUserDTO, CreateUserDTO, LoginUserDTO } from "./dto/user.input.dto";
import { getAuthUser } from "@/lib/auth-server";

/* -------------------------------------
   Register Controller
------------------------------------- */
export async function registerController(req: NextRequest) {
  try{


    /* 
      Authenticate request
      - Token se logged-in user nikaalte hain
    */
    const authUser=await getAuthUser();

    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    /*
      2️⃣ Role check
    */
    if (
      authUser.role !== "admin" &&
      authUser.role !== "super_admin"
    ) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }


     /* 
       Read Raw Request Body 
       - Controller ka kaam sirf data lena hain..
     */
    const body=(await req.json()) as AdminCreateUserDTO;

    /* 
      call service layer
      -Business logic service me hota hain
      -service returns DTO-safe Data
    */
    const {user}=await registerUser(body);

    /* 
      Send Success Response
      -Controller HTTP response decide karta hain
    */
    
    return NextResponse.json(
        {
          success:true,
          user,
        },{
          status:201
        }
    );
  }catch(error:any){
    /* 
    Exception handling
    -Service errors yahin catch hota hain.
    -Controller user-friendly response banata hain
    */
    
     return NextResponse.json(
         {
          success:false,
          message:error.message || "Regstration Failed",
         },
         {
          status:400
         }
     );
  }
  
}

/* -------------------------------------
   Login Controller
------------------------------------- */
export async function loginController(req: NextRequest) {
      try{
        const body=(await req.json()) as LoginUserDTO;
        const {email, password}=body;

        const {user,token}=await loginUser(email,password);

        const response=NextResponse.json(
          {
            success:true,
            user,
          },
          {status:200}
        );

        response.cookies.set('token',token,{
          httpOnly:true,
          secure:process.env.NODE_ENV==='production',
          sameSite:'strict',
          path:"/",
        });

        return response;

      }catch(error:any){
        return NextResponse.json(
          {
            success:false,
            message:error.message || "Invalid Creadentials",
          },
          {status:401}
        );
      }
}



/* -------------------------------------
   Logout Controller
------------------------------------- */
export async function logoutController() {
  /*
    Logout ka matlab:
    - Auth token ko browser se hata do
    - Server-side koi business logic nahi
  */

  const response = NextResponse.json(
    {
      success: true,
      message: "Logged out successfully",
    },
    { status: 200 }
  );

  /*
    🔐 Auth cookie clear
    - Same name
    - Same path
    - maxAge = 0 (expire immediately)
  */
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return response;
}


/* -------------------------------------
   Get Current User Controller (/me)
------------------------------------- */
export async function getCurrentUserController() {
  try {
    /*
      1️⃣ Authenticate user (cookie → JWT)
      - getAuthUser auth + account-state check karta hai
    */
    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    /*
      2️⃣ Fetch fresh user from DB
      - JWT snapshot pe rely nahi karte
      - Latest data (role/status) milta hai
    */
    const user = await getUserById(authUser.id);

    /*
      3️⃣ Success response
      - Service mapper ke through DTO return karti hai
    */
    return NextResponse.json(
      {
        success: true,
        user,
      },
      { status: 200 }
    );
  } catch (error: any) {
    /*
      4️⃣ Exception handling
      - Service errors yahin translate hote hain
    */
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch user",
      },
      { status: 400 }
    );
  }
}



/* -------------------------------------
   Get All Users Controller (ADMIN ONLY)
------------------------------------- */

export async function getAllUsersController(req:NextRequest){
    try{
      
      /*
       1️⃣ Authenticate user
       - Cookie → JWT → AuthUser
      */
     const authUser=await getAuthUser();
     if(!authUser){
      return NextResponse.json(
        {success:false , message: "Unautherized"},
        {status:401}
      );
     }

     /*
      2️⃣ Authorize role
      - Sirf admin / super_admin allowed
    */
     
    if(authUser.role !="admin" && authUser.role !="super_admin"){
      return NextResponse.json(
        {success:false, message: "Forbidden"},
        {status:403}
      );
    }

    /*
      3️⃣ Read query params (pagination / filters)
      - Controller sirf params read karta hai
    */

      const {searchParams}=new URL(req.url);
      const page=Number(searchParams.get("page")) || 1;
      const limit=Number(searchParams.get("limit"))||10;

    /*
      4️⃣ Call service layer
      - Service DB query + mapper handle karti hai
    */
     
    const result=await getAllUsers({page,limit});

    /*
      result expected shape:
      {
        users: UserListDTO[],
        total: number,
        page: number,
        limit: number
      }
    */

    /*
      5️⃣ Success response
    */

    return NextResponse.json(
      {
        success:true,
        ...result,
      },{
        status:200
      }
    );

    }catch(error:any){
      return NextResponse.json(
        {
          success:false,
          message:error.message || "Failed to fetch Users",
        },{
          status:400
        }
      );
    }
}



/* -------------------------------------
   Update User (ADMIN ONLY)
------------------------------------- */
export async function updateUserController(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ success:false, message:"Unauthorized" }, { status:401 });
    }
    if (authUser.role !== "admin" && authUser.role !== "super_admin") {
      return NextResponse.json({ success:false, message:"Forbidden" }, { status:403 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");
    if (!userId) throw new Error("User id is required");

    const body = (await req.json()) as AdminUpdateUserDTO;
    const user = await updateUser(userId, body);

    return NextResponse.json({ success:true, user }, { status:200 });
  } catch (error:any) {
    return NextResponse.json(
      { success:false, message:error.message || "Update failed" },
      { status:400 }
    );
  }
}



/* -------------------------------------
   Block / Unblock User (ADMIN ONLY)
------------------------------------- */
export async function blockUserController(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ success:false, message:"Unauthorized" }, { status:401 });
    }
    if (authUser.role !== "admin" && authUser.role !== "super_admin") {
      return NextResponse.json({ success:false, message:"Forbidden" }, { status:403 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");
    const block = searchParams.get("block"); // "true" | "false"

    if (!userId || block === null) {
      throw new Error("User id and block flag required");
    }

    const user = await setUserBlockStatus(userId, block === "true");

    return NextResponse.json({ success:true, user }, { status:200 });
  } catch (error:any) {
    return NextResponse.json(
      { success:false, message:error.message || "Operation failed" },
      { status:400 }
    );
  }
}




/* -------------------------------------
   Delete User (ADMIN ONLY)
------------------------------------- */
export async function deleteUserController(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ success:false, message:"Unauthorized" }, { status:401 });
    }
    if (authUser.role !== "admin" && authUser.role !== "super_admin") {
      return NextResponse.json({ success:false, message:"Forbidden" }, { status:403 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");
    if (!userId) throw new Error("User id is required");

    await deleteUser(userId);

    return NextResponse.json(
      { success:true, message:"User deleted successfully" },
      { status:200 }
    );
  } catch (error:any) {
    return NextResponse.json(
      { success:false, message:error.message || "Delete failed" },
      { status:400 }
    );
  }
}


