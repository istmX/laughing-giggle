import {GoogleGenAI}from  '@google/gemini';


const gemini = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-2.5-flash',
})


export default gemini;