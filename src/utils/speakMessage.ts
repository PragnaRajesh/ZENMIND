export const speakMessage = (text: string) => {
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
  
    // Try to pick a soothing female voice by name or language
    const femaleVoice = voices.find(
      (voice) =>
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('samantha') || // MacOS default female voice
        voice.name.toLowerCase().includes('google us english') || // Chrome
        voice.lang === 'en-US'
    );
  
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = femaleVoice || voices[0]; // Fallback to first if no match
    utterance.rate = 0.95;
    utterance.pitch = 1.1;
  
    synth.speak(utterance);
  };
  