import { createClient } from "redis";

const client = createClient();

async function main() {
  await client.connect();

  await client.subscribe("channel001", (message) => {
    console.log(`Received message from channel001: ${message}`);

    try {
      const parsedMessage = JSON.parse(message);
      console.log("Processed message:", parsedMessage);
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  });

  console.log("Subscribed to channel001, now processing submission queue");

  while (true) {
    try {
      const response = await client.brPop("submission", 0);

      if (response) {
        console.log("Processing user submission:", response);

        const submission = JSON.parse(response.element);

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error("Error processing submission:", error);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

main().catch(console.error);
