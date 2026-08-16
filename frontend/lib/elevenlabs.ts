const DEFAULT_VOICE_ID = "JBFqnCBsd6RMkjVDRZzb";
const DEFAULT_MODEL_ID = "eleven_multilingual_v2";

export interface ElevenLabsOptions {
  voiceId?: string;
  apiKey?: string;
  modelId?: string;
}

let activeAudio: HTMLAudioElement | null = null;

export function stopElevenLabsAudio() {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio = null;
  }
}

/**
 * Synthesizes text to speech using ElevenLabs API (Voice ID: JBFqnCBsd6RMkjVDRZzb, Model: eleven_multilingual_v2).
 * Falls back to browser WebSpeech API if ElevenLabs API key is missing or fails.
 */
export async function speakWithElevenLabs(
  text: string,
  options: ElevenLabsOptions = {}
): Promise<boolean> {
  stopElevenLabsAudio();

  const apiKey = options.apiKey 
    || (typeof window !== "undefined" ? localStorage.getItem("elevenlabs_api_key") : null)
    || process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
  const voiceId = options.voiceId || DEFAULT_VOICE_ID;
  const modelId = options.modelId || DEFAULT_MODEL_ID;

  const cleanText = text.replace(/[#*`_]/g, "");

  if (apiKey) {
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          "Accept": "audio/mpeg",
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: modelId,
          output_format: "mp3_44100_128",
        }),
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        activeAudio = audio;
        await audio.play();
        return true;
      }
    } catch (err) {
      console.warn("ElevenLabs TTS fetch error, using WebSpeech fallback:", err);
    }
  }

  // Fallback to browser WebSpeech API
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
    return true;
  }

  return false;
}
