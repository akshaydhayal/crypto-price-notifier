import { alertModel } from "@/db/models/alerts";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try{
        const {token,symbol,email,price}=await req.json();
        const alert=new alertModel({token,symbol,email,targetPrice:price});
        await alert.save();
        return NextResponse.json({msg:"Mail alert set for"+token},{status:200});
    }catch(e){
        console.log("error in post mail route",e);
        return NextResponse.json({msg:"Internal Server error"},{status:501});
    }
}















// import { NextResponse } from "next/server";
// import { connectToDatabase } from "@/utils/database";
// import nodemailer from "nodemailer";

// export async function POST(request) {
//   try {
//     const { token, price, email } = await request.json();

//     // Connect to your database
//     const db = await connectToDatabase();

//     // Store the alert in the database
//     await db.collection("alerts").insertOne({
//       token,
//       targetPrice: price,
//       email,
//       createdAt: new Date(),
//       triggered: false,
//     });

//     // Send a confirmation email
//     const transporter = nodemailer.createTransport({
//       host: process.env.EMAIL_HOST,
//       port: process.env.EMAIL_PORT,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     await transporter.sendMail({
//       from: process.env.EMAIL_FROM,
//       to: email,
//       subject: "Price Alert Confirmation",
//       text: `Your price alert for ${token} at $${price} has been set.`,
//     });

//     return NextResponse.json({ message: "Alert set successfully" }, { status: 200 });
//   } catch (error) {
//     console.error("Error setting alert:", error);
//     return NextResponse.json({ message: "Failed to set alert" }, { status: 500 });
//   }
// }
