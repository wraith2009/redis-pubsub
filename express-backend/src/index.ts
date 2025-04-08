import express from "express";
import { createClient } from "redis";

const redisClient = createClient();

const app = express();
app.use(express.json());

app.post("/submit", async (req, res) => {
  const { name, email, message } = req.body;
  await redisClient.lPush(
    "submission",
    JSON.stringify({ name, email, message })
  );
  res.json({
    message: "Submission received",
    status: "queued",
  });
});

app.post("/send-message", async (req, res) => {
  const { id, name, description } = req.body;
  const data = JSON.stringify({
    id: id,
    name: name,
    message: description,
    timestamp: Date.now(),
  });

  try {
    const response = await redisClient.publish("channel001", data);
    console.log("Published data to channel001:", response);
    res.json({
      message: "Message sent successfully",
      recipients: response,
    });
  } catch (error) {
    console.error("Error publishing to channel001:", error);
    res.status(500).json({
      message: "Failed to send message",
      error: error,
    });
  }
});

app.get("/submission-status", (req, res) => {
  res.json({
    message: "Check console for real-time updates from workers",
    info: "Workers publish updates to worker_updates channel",
  });
});

async function startServer() {
  try {
    await redisClient.connect();

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}`);
      console.log("Connected to Redis and subscribed to worker_updates");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
