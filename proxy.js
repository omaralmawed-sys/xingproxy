import express from "express";
import fetch from "node-fetch";

const app = express();

// Body parser (für POST-Requests)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS für Chrome Extension erlauben
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "chrome-extension://anpbjeghdkiojcgkjanchcmbijfmckml");
    
    res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, x-api-key");
    res.header("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") return res.sendStatus(200);
    next();
});

// Preflight beantworten
app.options("*", (req, res) => {
    res.sendStatus(200);
});

const N8N_URL = process.env.N8N_URL;
const N8N_API_KEY = process.env.N8N_API_KEY;

if (!N8N_URL) {
    console.warn("Warning: N8N_URL is not set. Requests to /xing will fail until this is configured.");
}

app.post("/xing", async (req, res) => {
    try {

        if(!req.body) {
            return res.status(400).json({ error: "No body provided" });
        }
        // 🔍 DEBUG 1: Was kommt beim Proxy an?
        console.log("BODY RECEIVED ON PROXY:", req.body); 

        if (!N8N_URL) return res.status(500).json({ error: "N8N_URL not configured on the proxy" });

        // 🔍 DEBUG 2: Was wird an n8n weitergeleitet?
        console.log("FORWARDED TO N8N:", JSON.stringify(req.body));
        const response = await fetch(N8N_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": N8N_API_KEY
            },
            body: JSON.stringify(req.body ?? {})
        });

        const text = await response.text();
        let data;

        try {
            data = JSON.parse(text);
        } catch {
            // Wenn n8n kein JSON zurückgibt, leiten wir den Rohtext weiter (Statuscode wird übernommen)
            const status = response.status || 200;
            return res.status(status).send(text);
        }

        res.status(response.status || 200).json(data);

    } catch (err) {
        console.error("Proxy error:", err);
        res.status(500).json({ error: "Proxy failed" });
    }
});

app.get("/", (req, res) => res.send("Proxy OK"));

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Proxy running on port ${port}`));
