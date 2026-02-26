const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ===============================
// API ROUTES
// ===============================

// Status API
app.get("/api/status", (req, res) => {
    res.json({
        status: "online",
        uptime: process.uptime(),
        timestamp: new Date()
    });
});

// Bewerbung API
app.post("/api/bewerbung", (req, res) => {
    const { name, discord, text } = req.body;

    if (!name || !discord || !text) {
        return res.status(400).json({
            success: false,
            message: "Alle Felder sind erforderlich."
        });
    }

    const neueBewerbung = {
        id: Date.now(),
        name,
        discord,
        text,
        createdAt: new Date()
    };

    let bewerbungen = [];

    if (fs.existsSync("bewerbungen.json")) {
        bewerbungen = JSON.parse(
            fs.readFileSync("bewerbungen.json", "utf8")
        );
    }

    bewerbungen.push(neueBewerbung);

    fs.writeFileSync(
        "bewerbungen.json",
        JSON.stringify(bewerbungen, null, 2)
    );

    res.json({
        success: true,
        message: "Bewerbung gespeichert."
    });
});

// Bewerbungen abrufen (Admin API)
app.get("/api/bewerbungen", (req, res) => {
    if (!fs.existsSync("bewerbungen.json")) {
        return res.json([]);
    }

    const data = JSON.parse(
        fs.readFileSync("bewerbungen.json", "utf8")
    );

    res.json(data);
});

// ===============================

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});