# Xing/LinkedIn Proxy Server

## Overview

This is a lightweight **Node.js/Express proxy server** designed to bridge the communication gap between the **Recruiting Tools Chrome Extension** and an **n8n automation workflow**.

It is specifically built to run on **Google Cloud Run** and handles CORS (Cross-Origin Resource Sharing) headers to allow secure requests from the Chrome Extension while forwarding data to a protected n8n webhook.

## Features

* **CORS Handling:** Automatically adds the necessary headers (`Access-Control-Allow-Origin`, etc.) to allow requests from the specific Chrome Extension ID.
* **Request Forwarding:** Receives POST requests from the extension and forwards the payload to a configured n8n webhook URL.
* **Authentication:** Passes the `x-api-key` header to authenticate with the n8n endpoint.
* **Error Handling:** Catches JSON parsing errors and connection issues, returning meaningful status codes to the extension.
* **Cloud Ready:** Containerized with Docker and configured for deployment on Google Cloud Run (listening on port 8080).

## Architecture Flow

1.  **Chrome Extension** sends scraped data (candidate profile) to this Proxy Server (`/xing`).
2.  **Proxy Server** validates the request and forwards the payload to the **n8n Webhook**.
3.  **n8n** processes the data (AI analysis, message generation).
4.  **n8n** responds to the Proxy.
5.  **Proxy Server** relays the response back to the **Chrome Extension**.

## Installation & Local Setup

### Prerequisites
* Node.js (v18+)
* npm

### Steps
1.  Clone this repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file (optional for local testing) or set environment variables:
    ```env
    N8N_URL=[https://your-n8n-instance.com/webhook/path](https://your-n8n-instance.com/webhook/path)
    N8N_API_KEY=your_secret_api_key
    PORT=8080
    ```
4.  Start the server:
    ```bash
    npm start
    ```

## Deployment (Google Cloud Run)

This project is optimized for Google Cloud Run using the included `Dockerfile`.

### 1. Build & Push Container
```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/xing-proxy
