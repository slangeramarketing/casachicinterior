import mongoose, { Connection } from "mongoose";

type ConnectionObject={
    isConnected ?:number
}

const connection:ConnectionObject={}

async function db():Promise<void>{
    if(connection.isConnected){
        console.log("Already Connected");
        return
    }

    const uri = process.env.MONGODB_URI;


    try{

        if (!uri) {
            throw new Error("MONGODB_URI is missing");
        }

        const db = await mongoose.connect(uri,{
            dbName: "casachicinterior",
        });

        connection.isConnected=db.connections[0].readyState;
        console.log("DB Connected Successfully");
    }catch(error){
       console.log("Database connection failed",error);
       process.exit(1)
    }
}

export default db;