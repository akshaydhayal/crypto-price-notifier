import { NextResponse } from "next/server";
import { NatsService } from "../../../pubsub/nats";
import { createAppJwt } from "../../../pubsub/userJwt";
import nodemailer from "nodemailer";
import { alertModel } from "@/db/models/alerts";
import { dbConnect } from "@/db/dbConnect";

export const dynamic = "force-dynamic";

let service: NatsService | null = null;

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

//@ts-expect-error arguments
async function sendAlertEmail(alert, currentPrice: number) {
  console.log("sendAlertEmail called with", alert, "and curr price", currentPrice);
  const response = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: alert.email,
    subject: `Price Alert: ${alert.token} has reached your target price!`,
    text: `The price of ${alert.token} has reached $${currentPrice}, meeting your alert condition of $${alert.targetPrice}.`,
  });
  console.log("response : ", response);
}

async function sendAlerts(livePrices: string) {
  console.log("sendAlert fn called with data : ", livePrices);
  const parsedPrices = JSON.parse(livePrices);

  const allAlerts = await alertModel.find({});
  console.log("all alerts before sending : ", allAlerts);

  for (const alert of allAlerts) {
    if (parsedPrices[alert.symbol] && alert.targetPrice <= parsedPrices[alert.symbol].price) {
      await sendAlertEmail(alert, parsedPrices[alert.symbol].price);
      await alertModel.findByIdAndDelete(alert._id);
    }
  }
  console.log("all alerts after sending : ", allAlerts);
}

export async function GET() {
  await dbConnect();
  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  if (!service) {
    console.log("Initializing NATS service");
    const natsUrl = "europe-west3-gcp-dl-testnet-brokernode-frankfurt01.synternet.com:4222";
    const subject = "synternet.price.all";
    const accessToken = process.env.ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json({ error: "Access token not found" }, { status: 500 });
    }

    service = new NatsService({
      url: natsUrl,
      natsCredsFile: createAppJwt(accessToken),
    });

     try {
       console.log("Connecting to NATS server...");
       await service.waitForConnection();
       console.log("Connected to NATS server.");
     } catch (error) {
       console.error("Failed to connect to NATS server:", error);
       return NextResponse.json({ error: "Failed to connect to NATS" }, { status: 500 });
     }

    service.addHandler(subject, async (data: Uint8Array) => {
      const decodedData = new TextDecoder().decode(data);
      console.log(`Received message on ${subject}: ${decodedData}`);
      await sendAlerts(decodedData);
      await writer.write(encoder.encode(`data: ${decodedData}\n\n`));
    });

     setInterval(() => {
      writer.write(encoder.encode(`data: ping\n\n`));
    }, 1700); // Send ping every 30 seconds
  

    await service.serve();
  }

  return new Response(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}







// // import { NextRequest } from "next/server";
// import { NatsService } from "../../../pubsub/nats";
// import { createAppJwt } from "../../../pubsub/userJwt";
// import nodemailer from "nodemailer";
// import { alertModel } from "@/db/models/alerts";
// import { dbConnect } from "@/db/dbConnect";

// let service: NatsService | null = null;

// const transporter=nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: process.env.EMAIL_PORT,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// export async function sendAlertEmail(alert, currentPrice) {
//   console.log("sendAlertEmail called with", alert, "and curr price", currentPrice);
//   const response = await transporter.sendMail({
//     from: process.env.EMAIL_FROM,
//     to: alert.email,
//     subject: `Price Alert: ${alert.token} has reached your target price!`,
//     text: `The price of ${alert.token} has reached $${currentPrice}, meeting your alert condition of $${alert.targetPrice}.`,
//   });
//   console.log("response : ", response);
// }

// async function sendAlerts(livePrices) {
//   console.log("sendAlert fn called with data : ", livePrices);
//   console.log("Keys in livePrices: ", Object.keys(livePrices));

//   console.log(typeof livePrices);

//   livePrices = JSON.parse(livePrices);
//   console.log(typeof livePrices);
//   console.log("Keys in livePrices: ", Object.keys(livePrices));

//   console.log("sendAlert fn called with data : ", livePrices["ETH"]);
//   console.log("sendAlert fn called with dataa : ", livePrices.ETH);
//   // console.log("sendAlert fn called with data : ",livePrices['ETH'].price);
//   const allAlerts = await alertModel.find({});
//   // console.log("sendAlert fn called with data : ",livePrices[allAlerts[0].symbol].price);
//   console.log("all alerts before sending : ", allAlerts);
//   for (const alert of allAlerts) {
//     console.log("alert : ", alert);
//     console.log("alert type : ", typeof alert);
//     console.log("alert type : ", typeof alert.symbol);
//     console.log("symbol : ", alert.symbol);
//     console.log("Liveprice symbol : ", livePrices[alert.symbol]);
//     console.log("bool : ", alert.targetPrice <= livePrices[alert.symbol].price);

//     if (livePrices[alert.symbol] && alert.targetPrice <= livePrices[alert.symbol].price) {
//       await sendAlertEmail(alert, livePrices[alert.symbol].price);
//       await alertModel.findByIdAndDelete(alert._id);
//     }
//   }
//   console.log("all alerts after sending : ", allAlerts);
// }

// export async function GET() {
//   dbConnect();
//   const responseStream = new TransformStream();
//   const writer = responseStream.writable.getWriter();
//   const encoder = new TextEncoder();

//   if (!service) {
//     console.log("Initializing NATS service");
//     const natsUrl = "europe-west3-gcp-dl-testnet-brokernode-frankfurt01.synternet.com:4222";
//     const subject = "synternet.price.all";
//     const accessToken = process.env.ACCESS_TOKEN;
//     if(!accessToken) return;

//     service = new NatsService({
//       url: natsUrl,
//       natsCredsFile: createAppJwt(accessToken),
//     });

//     console.log("Connecting to NATS server...");
//     await service.waitForConnection();
//     console.log("Connected to NATS server.");

//     service.addHandler(subject, async (data: Uint8Array) => {
//       const decodedData = new TextDecoder().decode(data);
//       console.log(`Received message on ${subject}: ${decodedData}`);
//       sendAlerts(decodedData);
//       await writer.write(encoder.encode(`data: ${decodedData}\n\n`));
//     });

//     await service.serve();
//   }

//   return new Response(responseStream.readable, {
//     headers: {
//       "Content-Type": "text/event-stream",
//       "Cache-Control": "no-cache",
//       Connection: "keep-alive",
//     },
//   });
// }

// import { NextRequest, NextResponse } from "next/server";
// import { NatsService } from "../../../pubsub/nats";
// import { createAppJwt } from "../../../pubsub/userJwt";

// let service:NatsService|null=null;
// export async function GET(req:NextRequest) {
//   let decoded;
//   if(!service){
//     console.log("first time");
//     const natsUrl = "europe-west3-gcp-dl-testnet-brokernode-frankfurt01.synternet.com:4222";
//     const subject = "synternet.price.all";
//     const accessToken = `SAAMTLX5KZ27GIVAHQNKD5FOEV5UZO73W2NEWMRHOVBUYGE42S5ZMCH6UQ`;

//     // const service = new NatsService({
//     service = new NatsService({
//       url: natsUrl,
//       natsCredsFile: createAppJwt(accessToken),
//     });

//     console.log("Connecting to NATS server...");
//     await service.waitForConnection();
//     console.log("Connected to NATS server.");
//       service.addHandler(subject, async (data: Uint8Array) => {
//         // const decoded = new TextDecoder().decode(data);
//         decoded = new TextDecoder().decode(data);
//         console.log(`Received message on ${subject}: ${decoded}`);
//       });
//       await service.serve();
//     //   await  service.close();
//   }
//   return NextResponse.json({ message: "NATS service is running",data:decoded }, { status: 200 });
// }
