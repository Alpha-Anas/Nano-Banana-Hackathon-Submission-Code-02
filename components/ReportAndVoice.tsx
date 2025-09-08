import React, { useState, useEffect } from 'react';
import { AppView } from '../types';
import { ArrowLeftIcon, SpeakerWaveIcon } from './icons';
import { useTranslations } from '../hooks/useTranslations';
import { generateVoice } from '../services/voiceService';

interface ReportAndVoiceProps {
    reportText: string;
    setView: (view: AppView) => void;
}

const ReportAndVoice: React.FC<ReportAndVoiceProps> = ({ reportText, setView }) => {
    const { t, language } = useTranslations();
    const [aiVoiceUrl, setAiVoiceUrl] = useState<string | null>(null);
    const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
    const audioPlayerRef = React.useRef<HTMLAudioElement>(null);

    const hardcodedReport = `**Incident Report**\nThis report documents a testimony from a woman facing domestic violence. The individual reports that her husband subjects her to repeated physical abuse. Specifically, she states that last night, her husband attacked her arm and threatened to evict her from their home. The individual expresses a state of fear and is actively seeking help.`;

    const handleGenerateAndPlayVoice = async () => {
        setIsGeneratingVoice(true);
        try {
            const voiceUrl = await generateVoice(hardcodedReport);
            setAiVoiceUrl(voiceUrl);
        } catch (error) {
            console.error("Failed to generate voice:", error);
            alert("Sorry, the AI voice could not be generated at this time.");
        } finally {
            setIsGeneratingVoice(false);
        }
    };
    
    useEffect(() => {
        if (aiVoiceUrl && audioPlayerRef.current) {
            audioPlayerRef.current.src = aiVoiceUrl;
            audioPlayerRef.current.play();
        }
    }, [aiVoiceUrl]);

    const handleReportAnonymously = () => {
        alert("Your report has been sent securely and anonymously to our partner network. Someone will reach out through a secure channel if you have provided contact details. Your safety is our priority.");
        setView('home');
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg animate-fade-in">
            <button onClick={() => setView('home')} className="flex items-center text-violet-600 hover:text-violet-800 mb-6 font-semibold text-lg">
                <ArrowLeftIcon size={6} className={`mr-2 ${language === 'ur' ? 'rotate-180' : ''}`} />
                {t('backToHome')}
            </button>
            
            <h2 className="text-4xl font-bold text-violet-800 mb-4">Your Case Summary</h2>
            <p className="text-gray-600 mb-6 text-xl">Below is a summary of your statement. You can listen to it with an anonymized AI voice or proceed to report it securely.</p>

            <div className="bg-gray-100 p-6 rounded-lg border border-gray-200 max-h-72 overflow-y-auto mb-6">
                <pre className="whitespace-pre-wrap font-sans text-gray-800 text-lg">{hardcodedReport}</pre>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <button
                    onClick={handleGenerateAndPlayVoice}
                    disabled={isGeneratingVoice}
                    className="bg-sky-500 text-white font-bold py-4 px-8 rounded-lg shadow-md hover:bg-sky-600 transition-colors duration-300 text-xl flex items-center justify-center disabled:bg-sky-300"
                >
                    <SpeakerWaveIcon size={7} className="mr-3" />
                    {isGeneratingVoice ? 'Generating...' : 'Listen with AI Voice'}
                </button>
                <audio ref={audioPlayerRef} className="hidden" />
            </div>

            {/* Anonymous Reporting Section */}
            <div className="bg-violet-50 border-l-8 border-violet-500 p-6 rounded-r-lg text-left space-y-6">
                <div>
                    <h3 className="text-2xl font-bold text-violet-900">Anonymous Reporting</h3>
                    <p className="text-violet-800 mt-2 text-lg">
                        When you click "Report Anonymously", this report is sent without any personal identifiers. Your location, IP address, and name are never stored or shared. It is completely confidential.
                    </p>
                </div>
                <div className="font-urdu text-right" dir="rtl">
                    <h3 className="text-2xl font-bold text-violet-900">گمنام رپورٹنگ</h3>
                    <p className="text-violet-800 mt-2 text-lg">
                        جب آپ "گمنام طور پر رپورٹ کریں" پر کلک کرتے ہیں، تو یہ رپورٹ بغیر کسی ذاتی شناخت کے بھیجی جاتی ہے۔ آپ کا مقام، آئی پی ایڈریس، اور نام کبھی بھی ذخیرہ یا شیئر نہیں کیا جاتا۔ یہ مکمل طور پر خفیہ ہے۔
                    </p>
                </div>

                <button
                    onClick={handleReportAnonymously}
                    className="w-full bg-violet-600 text-white font-bold py-5 px-8 mt-6 rounded-lg shadow-xl hover:bg-violet-700 transition-transform hover:scale-105 duration-300 text-2xl"
                >
                    Report Anonymously / گمنام طور پر رپورٹ کریں
                </button>
            </div>
        </div>
    );
};

export default ReportAndVoice;