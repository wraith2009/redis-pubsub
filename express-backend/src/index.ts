import express from "express";
import { createClient } from "redis";

const client = createClient();
const app = express();

app.use(express.json());
app.post("/submit", async (req, res) => {
  const { name, email, message } = req.body;
  await client.lPush("submission", JSON.stringify({ name, email, message }));
  res.json({
    message: "Submission received",
  });
});
async function startServer() {
  try {
    await client.connect();

    app.listen(8000);
  } catch (error) {
    console.error("failed to connect to redis", error);
  }
}

startServer();
