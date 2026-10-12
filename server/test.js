const dotenv = require('dotenv');
dotenv.config();

const apiKey = process.env.GROQ_API_KEY;

async function checkGroqModels() {
  try {
    const res = await fetch("https://api.groq.com/openai/v1/models", {
      headers: {
        "Authorization": `Bearer ${apiKey}`
      }
    });
    const data = await res.json();
    console.log("Model Groq:");
    data.data.forEach(m => console.log("-", m.id));
  } catch (err) {
    console.error(err);
  }
}
checkGroqModels();