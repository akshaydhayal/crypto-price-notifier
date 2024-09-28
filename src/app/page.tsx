import { NatsService } from "../pubsub/nats";
import { createAppJwt } from "../pubsub/userJwt";

export default function Home() {

    // const natsUrl = "nats://localhost:4222";
    const natsUrl = "nats://localhost:3000";
    const subject = "synternet.price.telemetry";
    const accessToken = `SAAMTLX5KZ27GIVAHQNKD5FOEV5UZO73W2NEWMRHOVBUYGE42S5ZMCH6UQ`;

    async function printData(data: Uint8Array): Promise<void> {
      const decoded = new TextDecoder().decode(data);
      console.log(`Received message on ${subject} subject. Message: ${decoded}`);
    }

    async function main() {
      // Connect to the NATS server with credentials
      const service = new NatsService({
        url: natsUrl,
        natsCredsFile: createAppJwt(accessToken),
      });

      console.log("Connecting to NATS server...");
      await service.waitForConnection();
      console.log("Connected to NATS server.");

      // Add a handler function to process messages received on the exampleSubscribeSubject
      console.log(`Listening for ${subject} messages...`)
      service.addHandler(subject, async (data: Uint8Array) => {
        await printData(data);
      });

      // Start serving messages and processing them using the registered handler function
      await service.serve();
    }

    main().catch((err) => {
      console.error("Error:", err);
      process.exit(1);
    });

  return (
    <div>
      <p>Home</p>
    </div>
  );
}
