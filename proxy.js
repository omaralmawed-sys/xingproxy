import express from "express";
import fetch from "node-fetch";

const app = express();

app.use(express.json());

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
