import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";

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

  // Email helper
  const sendEmail = async (subject: string, text: string, html: string) => {
    const config = readJsonFile(CONFIG_FILE, { smtpHost: "", smtpPort: "", smtpUser: "", smtpPass: "", fromEmail: "" });
    
    if (!config.smtpHost) {
      console.log("--- EMAIL SIMULATION (No SMTP Config) ---");
      console.log(`To: info@towtrucksbrisbane.com.au`);
      console.log(`Subject: ${subject}`);
      console.log(`Body: ${text}`);
      console.log("-----------------------------------------");
      return;
    }

    const transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: parseInt(config.smtpPort),
      secure: config.smtpPort === "465",
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
      },
    });

    try {
      await transporter.sendMail({
        from: config.fromEmail || "no-reply@towtrucksbrisbane.com.au",
        to: "info@towtrucksbrisbane.com.au",
        subject,
        text,
        html,
      });
      console.log(`Email sent successfully to info@towtrucksbrisbane.com.au: ${subject}`);
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  };

  // API Route for Emergency Location
  app.post("/api/emergency-location", async (req, res) => {
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

    const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    
    await sendEmail(
      `EMERGENCY: Location Received from ${name}`,
      `Emergency location request received.\n\nName: ${name}\nPhone: ${phone}\nLocation: ${mapsUrl}\nAccuracy: ${accuracy}m`,
      `<h2>Emergency Location Received</h2>
       <p><strong>Name:</strong> ${name}</p>
       <p><strong>Phone:</strong> ${phone}</p>
       <p><strong>Location:</strong> <a href="${mapsUrl}">${mapsUrl}</a></p>
       <p><strong>Accuracy:</strong> ${accuracy}m</p>`
    );

    res.json({ 
      success: true, 
      message: "Location sent to dispatch. A driver will call you shortly." 
    });
  });

  // API Route for Contact Form
  app.post("/api/contact", async (req, res) => {
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

    await sendEmail(
      `New Quote Request: ${service} from ${name}`,
      `New quote request received.\n\nName: ${name}\nPhone: ${phone}\nService: ${service}\nMessage: ${message}`,
      `<h2>New Quote Request</h2>
       <p><strong>Name:</strong> ${name}</p>
       <p><strong>Phone:</strong> ${phone}</p>
       <p><strong>Service:</strong> ${service}</p>
       <p><strong>Message:</strong> ${message}</p>`
    );

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
