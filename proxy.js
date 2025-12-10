import express from "express";
import fetch from "node-fetch";

const app = expres();

app.use(express.json());

const N8N_URL=process.env.N8N_URL;
const N8N_API_KEY=process.env.N8N_API_KEY;


// Main secure endpoint


app.post("/xing" ,async (req,res)=>{
    try{
        const response= await fetch(N8N_URL,{
            method:"POST",
            header:{
                "Content-Type": "application/json",
                "x-api-key": N8N_API_KEY
            },
            body:JSON.stringify(req.body)
        });

        const text = await response.text();
        let json;
        try{
            json=JSON.parse(text);
        }
        catch { return res.status(500).send("Invalid JSON received from n8n."); }

        res.json(json);
    }
    catch(err){
         console.error("Proxy error:", err);
        res.status(500).json({ error: "Proxy failed" });
    }
});


// Required for cloud run health check

app.get("/",(req,res)=> res.send("proxy Ok"));


const port= process.env.PORT || 8080;

app.listen(port, () => console.log(`Proxy running on port ${port}`));