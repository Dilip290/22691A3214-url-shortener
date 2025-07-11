🔗 URL Shortener Microservice
A TypeScript-based URL Shortener backend built with Express.js and MongoDB, featuring detailed logging, rate limiting, and analytics.

🚀 Features
✅ Shorten long URLs with auto-generated or custom shortcodes

🔁 Redirect users using /:shortcode

📊 View analytics for each shortcode (clicks, location, userAgent, etc.)

🔒 Rate limiting to prevent abuse

🧾 Logging with custom logger service

⚙️ Configurable via .env

🌍 RESTful API with clean modular structure

🛠️ Tech Stack
Node.js + Express

TypeScript

MongoDB + Mongoose

NanoID (for generating shortcodes)

Axios (for internal logging)

Helmet, CORS, Express-rate-limit

Custom middleware for request logging and error handling

📁 Project Structure
csharp
Copy
Edit
src/
├── config/              # DB config
├── controllers/         # API route handlers
├── middleware/          # Custom middleware (logger, error handler)
├── models/              # Mongoose models
├── routes/              # Express routes
├── services/            # Business logic
├── utils/               # Validators, helpers
Logging Middleware/      # Custom Axios-based logger
.env.example              # Sample environment file
📦 Installation
bash
Copy
Edit
# Clone the repo
git clone https://github.com/Dilip290/22691A3214-url-shortener.git
cd 22691A3214-url-shortener

# Install dependencies
npm install
🔐 Environment Variables
Create a .env file based on the .env.example file:

env
Copy
Edit
PORT=3000
MONGO_URI=mongodb://localhost:27017/urlshortener
▶️ Running the App
bash
Copy
Edit
# Run in development mode
npm run dev

# Or build & run in production
npm run build
npm start
📬 API Endpoints
Method	Endpoint	Description
POST	/shorturls	Create a new short URL
GET	/shorturls/:shortcode	Get analytics of a short URL
GET	/:shortcode	Redirect to original URL

📌 Logging Format
Each log entry is sent to an external logging API:

json
Copy
Edit
{
  "stack": "backend",
  "level": "info",
  "package": "url-shortener",
  "message": "Created short URL: ab12cd34",
  "timestamp": "2025-07-11T09:00:00.000Z"
}
✅ TODO (Optional Enhancements)
 Add unit tests (Jest/Mocha)

 Deploy on cloud (Render/Heroku)

 Add click heatmap visualization

 Frontend client (React/Next.js)

🧑‍💻 Author
Dilip Bojanapu
GitHub: Dilip290
