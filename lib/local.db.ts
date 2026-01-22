import mongoose, { Connection } from "mongoose";
import { PHASE_PRODUCTION_BUILD } from 'next/constants';
type ConnectionObject={
    isConnected ?:number
}

const connection:ConnectionObject={}

async function db():Promise<void>{

    // यह चेक करेगा कि क्या अभी 'npm run build' चल रहा है
    if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
        console.log("Skipping DB connection during build phase...");
        return;
    }


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