const express = require("express");
const next = require("next");
const cors = require("cors");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const port = process.env.PORT || 8080;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Middleware
  server.use(cors());
  server.use(express.json());

  // API proxy for backend requests
  server.use("/api/proxy", async (req, res) => {
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "https://wealth-backend-env.eba-6sumcm74.us-east-1.elasticbeanstalk.com/api";

    try {
      const url = `${backendUrl}${req.url}`;
      const response = await fetch(url, {
        method: req.method,
        headers: {
          "Content-Type": "application/json",
          ...req.headers,
        },
        body:
          req.method !== "GET" && req.method !== "HEAD"
            ? JSON.stringify(req.body)
            : undefined,
      });

      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error) {
      console.error("Proxy error:", error);
      res.status(500).json({ error: "Proxy request failed", details: error.message });
    }
  });

  // Let Next.js handle all other routes
  server.all("*", (req, res) => handle(req, res));

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Server running on http://localhost:${port}`);
  });
});
