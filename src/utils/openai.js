// src/utlis/openai.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Secure way to access API key
});