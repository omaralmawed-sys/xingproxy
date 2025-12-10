import express from "express";
import fetch from "node-fetch";

const app = express();

// CORS für Chrome Extension erlauben
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, x-api-key");
    next();
});

// Preflight beantworten
app.options("*", (req, res) => {
    res.sendStatus(200);
});

const N8N_URL = process.env.N8N_URL;
const N8N_API_KEY = process.env.N8N_API_KEY;

app.post("/xing", async (req, res) => {
    try {
        const response = await fetch(N8N_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": N8N_API_KEY
            },
            body: JSON.stringify(req.body)
        });

        const text = await response.text();
        let data;

        try {
            data = JSON.parse(text);
        } catch {
            return res.status(500).send("Invalid JSON received from n8n.");
        }

        res.json(data);

    } catch (err) {
        console.error("Proxy error:", err);
        res.status(500).json({ error: "Proxy failed" });
    }
});

app.get("/", (req, res) => res.send("Proxy OK"));

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Proxy running on port ${port}`));
