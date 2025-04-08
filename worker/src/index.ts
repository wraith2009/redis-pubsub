import { createClient } from "redis";

const client = createClient();

async function main() {
  await client.connect();

  while (1) {
    const response = await client.brPop("submission", 0);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("processed user submission", response);
  }
}

main();
