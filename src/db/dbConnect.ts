import mongoose from "mongoose";

export async function dbConnect(){
    try{
        if(process.env.MONGO_URI){
            const dbStatus=await mongoose.connect(process.env.MONGO_URI);
            if(dbStatus) console.log("Connected to db!!");
        }else{
            console.log("No mongo uri");
        }
    }catch(e){
        console.log("error connecting db",e);
    }
}