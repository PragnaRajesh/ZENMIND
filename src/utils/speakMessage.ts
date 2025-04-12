export const speakMessage = (text: string) => {
    const synth = window.speechSynthesis;
  
    const speak = () => {
      const voices = synth.getVoices();
  
      // Preferred voice names in priority order
      const preferredVoiceNames = [
        'Samantha',
        'Google UK English Female',
        'Flo (English (United States))',
        'Martha',
        'Catherine',
        'Karen',
        'Grandma (English (United States))'
      ];
  
      // Try to find the first matching female voice
      const selectedVoice =
        voices.find((v) => preferredVoiceNames.includes(v.name)) ||
        voices.find((v) => v.name.toLowerCase().includes('female')) ||
        voices.find((v) => v.lang.startsWith('en'));
  
      const utterance = new SpeechSynthesisUtterance(text);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
  
      utterance.rate = 0.95;
      utterance.pitch = 1.15;
      utterance.volume = 1;
  
      synth.cancel(); // Stop any overlapping voice
      synth.speak(utterance);
    };
  
    // Delay needed for some browsers (like Chrome) to load voices
    if (synth.getVoices().length === 0) {
      synth.addEventListener('voiceschanged', speak);
    } else {
      speak();
    }
  };
  