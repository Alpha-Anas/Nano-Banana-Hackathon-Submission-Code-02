
// This service is now structured to call a backend API endpoint for transcription.
// This is the recommended, secure approach as it keeps your API keys (e.g., for Google Cloud Speech-to-Text) off the client-side.

/**
 * Sends an audio blob to the backend for transcription.
 * @param audioBlob The audio data to transcribe.
 * @param languageCode The BCP-47 language code (e.g., 'en-US', 'ur-PK').
 * @returns A promise that resolves to the transcribed text.
 */
export const transcribeAudio = async (audioBlob: Blob, languageCode: string): Promise<string> => {
    console.log(`Sending audio for transcription. Language: ${languageCode}, Blob size: ${audioBlob.size}`);

    // We use FormData to send the audio file and language code to the backend.
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('languageCode', languageCode);

    try {
        // In a real application, you would create this '/api/transcribe' endpoint on your backend.
        // This endpoint would receive the audio file, call the Google Speech-to-Text API with your secret key,
        // and return the transcribed text.
        const response = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            // Try to get a more specific error message from the backend response body
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.error || `Server responded with status: ${response.status}`;
            throw new Error(errorMessage);
        }

        const data = await response.json();

        if (!data.transcription) {
            throw new Error("Invalid response from transcription server.");
        }

        return data.transcription;

    } catch (error) {
        console.error("Error during transcription:", error);

        // --- MOCK RESPONSE FOR OFFLINE/DEV ---
        // If the API call fails (e.g., the backend is not set up yet), we fall back to the mock data.
        // This allows the UI to continue working during development.
        // You should REMOVE this fallback in a production environment.
        console.warn("API call failed. Falling back to mock transcription data.");
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
        return getMockTranscription(languageCode);
        // --- END OF MOCK RESPONSE ---

        // In production, you would re-throw the error to be handled by the UI.
        // throw error;
    }
};

/**
 * Provides a mock transcription based on language. Used as a fallback for testing.
 */
const getMockTranscription = (languageCode: string): string => {
    // User-provided story for Urdu transcription
    const hardcodedStoryUrdu = "میں ایک عورت ہوں جو گھریلو تشدد کا شکار ہے۔ میرا شوہر مجھے بار بار مارتا ہے۔ کل رات اس نے میرے بازو پر حملہ کیا اور دھمکی دی کہ مجھے گھر سے نکال دے گا۔ میں خوفزدہ ہوں اور مدد مانگتی ہوں۔";
    
    // English version for other languages, translated from the user's Urdu story
    const hardcodedStoryEnglish = "I am a woman who is a victim of domestic violence. My husband beats me repeatedly. Last night he attacked my arm and threatened to throw me out of the house. I am scared and I am asking for help.";
    
    switch (languageCode) {
        case 'ur-PK':
            return hardcodedStoryUrdu;
        case 'hi-IN':
             return "मैं एक महिला हूं जो घरेलू हिंसा का शिकार है। मेरे पति मुझे बार-बार मारते हैं। कल रात उन्होंने मेरे हाथ पर हमला किया और मुझे घर से बाहर निकालने की धमकी दी। मैं डरी हुई हूं और मदद मांग रही हूं।";
        case 'es-MX':
            return "Soy una mujer víctima de violencia doméstica. Mi esposo me golpea repetidamente. Anoche me atacó el brazo y amenazó con echarme de la casa. Tengo miedo y pido ayuda.";
        case 'en-US':
        default:
            return hardcodedStoryEnglish;
    }
}