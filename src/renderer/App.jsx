import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import axios from 'axios';

export default function App() {
  const [image, setImage] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const takeScreenshot = async () => {
    const dataUrl = await ipcRenderer.invoke('capture-screen');
    setImage(dataUrl);
  };

  const sendToAI = async () => {
    const resp = await axios.post(
      'https://api.openai.com/v1/your-endpoint',
      { image: image, prompt: prompt },
      { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } }
    );
    setResponse(resp.data.choices[0].text);
  };

  return (
    <div className="p-4">
      <button onClick={takeScreenshot}>Capture Desktop</button>
      {image && <img src={image} alt="screenshot preview" className="mt-4" />}
      <textarea
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        placeholder="Ask the AI..."
        className="w-full h-24 border p-2 mt-2"
      />
      <button onClick={sendToAI} className="mt-2">Send to AI</button>
      {response && <div className="mt-4 p-2 border">{response}</div>}
    </div>
  );
}