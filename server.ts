import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Emergency Location
  app.post("/api/emergency-location", (req, res) => {
    const { name, phone, latitude, longitude, accuracy } = req.body;
    
    console.log("--- EMERGENCY LOCATION RECEIVED ---");
    console.log(`Name: ${name}`);
    console.log(`Phone: ${phone}`);
    console.log(`Location: https://www.google.com/maps?q=${latitude},${longitude}`);
    console.log(`Accuracy: ${accuracy} meters`);
    console.log("-----------------------------------");

    // In a real app, you'd use a service like SendGrid or AWS SES here.
    // For this demo, we'll simulate success.
    res.json({ 
      success: true, 
      message: "Location sent to dispatch. A driver will call you shortly." 
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
