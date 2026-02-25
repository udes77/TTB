import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";

const LOG_FILE = path.join(process.cwd(), "form_logs.json");
const CONFIG_FILE = path.join(process.cwd(), "mail_config.json");

// Helper to read/write files
const readJsonFile = (filePath: string, defaultValue: any) => {
  if (!fs.existsSync(filePath)) return defaultValue;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (e) {
    return defaultValue;
  }
};

const writeJsonFile = (filePath: string, data: any) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Emergency Location
  app.post("/api/emergency-location", (req, res) => {
    const { name, phone, latitude, longitude, accuracy } = req.body;
    
    const entry = {
      id: Date.now(),
      type: "Emergency Location",
      timestamp: new Date().toISOString(),
      data: { name, phone, latitude, longitude, accuracy }
    };

    const logs = readJsonFile(LOG_FILE, []);
    logs.push(entry);
    writeJsonFile(LOG_FILE, logs);

    console.log("--- EMERGENCY LOCATION RECEIVED ---");
    console.log(`Name: ${name}`);
    console.log(`Phone: ${phone}`);
    console.log(`Location: https://www.google.com/maps?q=${latitude},${longitude}`);
    console.log("-----------------------------------");

    res.json({ 
      success: true, 
      message: "Location sent to dispatch. A driver will call you shortly." 
    });
  });

  // API Route for Contact Form
  app.post("/api/contact", (req, res) => {
    const { name, phone, service, message } = req.body;
    
    const entry = {
      id: Date.now(),
      type: "Quote Request",
      timestamp: new Date().toISOString(),
      data: { name, phone, service, message }
    };

    const logs = readJsonFile(LOG_FILE, []);
    logs.push(entry);
    writeJsonFile(LOG_FILE, logs);

    res.json({ success: true, message: "Quote request received." });
  });

  // Admin Routes
  app.get("/api/admin/logs", (req, res) => {
    res.json(readJsonFile(LOG_FILE, []));
  });

  app.delete("/api/admin/logs", (req, res) => {
    writeJsonFile(LOG_FILE, []);
    res.json({ success: true });
  });

  app.get("/api/admin/config", (req, res) => {
    res.json(readJsonFile(CONFIG_FILE, { smtpHost: "", smtpPort: "", smtpUser: "", fromEmail: "" }));
  });

  app.post("/api/admin/config", (req, res) => {
    writeJsonFile(CONFIG_FILE, req.body);
    res.json({ success: true });
  });

  app.post("/api/admin/test-mail", (req, res) => {
    const config = req.body;
    console.log("Simulating test mail with config:", config);
    // In a real app, use nodemailer here
    res.json({ success: true, message: "Test mail simulated successfully." });
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
