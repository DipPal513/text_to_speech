import React, { useState } from "react";
import axios from "axios";
import { css } from "@emotion/react";
import HashLoader from "react-spinners/HashLoader";

import dotenv from "dotenv"; // Import dotenv

// Load environment variables

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const App = () => {
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  async function convertToSpeech() {
    setLoading(true);
    setText("");
    setAudioUrl(null);

    const encodedParams = new URLSearchParams();
    encodedParams.set("voice_code", "en-US-1");
    encodedParams.set("text", text);
    encodedParams.set("speed", "1.00");
    encodedParams.set("pitch", "1.00");
    encodedParams.set("output_type", "audio_url");

    const options = {
      method: "POST",
      url: "https://cloudlabs-text-to-speech.p.rapidapi.com/synthesize",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": import.meta.env.VITE_API_KEY, // Use REACT_APP_ prefix
        "X-RapidAPI-Host": "cloudlabs-text-to-speech.p.rapidapi.com",
      },
      data: encodedParams,
    };

    try {
      const response = await axios.request(options);
      const res = response.data;
      if (res.status === "success") {
        setAudioUrl(res.result.audio_url);
      } else {
        alert("Text to speech conversion failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-96 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Text To Speech Converter</h1>
        <textarea
          placeholder="Enter your text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-40 p-2 border rounded shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          onClick={convertToSpeech}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 flex items-center"
        >
          Convert to Speech
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
        {loading && (
          <div className="mt-4 flex justify-center">
            <HashLoader
              color={"#000000"}
              loading={loading}
              css={override}
              size={50}
            />
          </div>
        )}
        {audioUrl && (
          <audio controls className="mt-4">
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
    </div>
  );
};

export default App;
