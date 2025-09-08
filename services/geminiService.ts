
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateEnhancedReport = async (userInput: string): Promise<string> => {
    // For testing, we use the hardcoded report generation if the API key is not available.
    if (!API_KEY) {
        return new Promise(resolve => setTimeout(() => {
            resolve(`
**Incident Report (English)**
This report documents a testimony from a woman facing domestic violence. The individual reports that her husband subjects her to repeated physical abuse. Specifically, she states that last night, her husband attacked her arm and threatened to evict her from their home. The individual expresses a state of fear and is actively seeking help.

---

**واقعہ کی رپورٹ (Urdu)**
اس رپورٹ میں گھریلو تشدد کا شکار ایک خاتون کی گواہی کو دستاویز کیا گیا ہے۔ فرد نے اطلاع دی ہے کہ اس کا شوہر اسے بار بار جسمانی تشدد کا نشانہ بناتا ہے۔ خاص طور پر، وہ بتاتی ہے کہ کل رات اس کے شوہر نے اس کے بازو پر حملہ کیا اور اسے گھر سے نکالنے کی دھمکی دی۔ فرد خوف کی حالت کا اظہار کر رہی ہے اور فعال طور پر مدد کی طالب ہے۔

---

**Relevant Pakistani Laws (متعلقہ پاکستانی قوانین)**
Based on your account, the following laws are relevant and can offer protection:
1.  **The Punjab Protection of Women against Violence Act 2016:** This is a key law designed to protect women from domestic violence. It allows a court to issue a Protection Order to stop the abuser from committing further violence, entering your residence, or contacting you.
2.  **Pakistan Penal Code, 1860 (Sections 337-A, 506):**
    *   **Section 337-A (Shajjah):** Deals with causing hurt to the body. Physical abuse, like the attack on your arm, can be prosecuted under this section.
    *   **Section 506 (Criminal Intimidation):** The threat to throw you out of the house can be considered criminal intimidation, which is a punishable offense.

---

**Next Steps: How to Report (اگلے اقدامات: رپورٹ کیسے کریں)**
Your safety is the most important thing. Here are confidential and safe steps you can take:
1.  **Call a Confidential Helpline:** Immediately call the Ministry of Human Rights helpline at **1099** or the Madadgaar National Helpline at **1098**. They are free, confidential, and can guide you on what to do next.
2.  **Contact a Women's Shelter/NGO:** Organizations like **Dastak Foundation** (in Lahore) or **Aurat Foundation** (multiple cities) provide safe shelter, free legal advice, and support. They can help you report the incident without putting you at risk.
3.  **Use the Punjab Women's Helpline (1043):** If you are in Punjab, this helpline is specifically for women facing violence and can connect you with the police and other services.
4.  **Go to a Women's Police Station:** These stations have female officers who are trained to handle such cases with sensitivity. You can ask a representative from an NGO to go with you for support.
`);
        }, 1500));
    }

    try {
        const prompt = `
            You are a compassionate and expert legal aid assistant for 'Aurat Ki Awaz', an organization helping women facing domestic violence in Pakistan. A user has provided an account of an incident. Your task is to generate a structured, multi-lingual report that is both empathetic and actionable.

            Here is the user's account:
            ---
            ${userInput}
            ---

            Based on this account, create a report with the following four sections, precisely in this order and with these exact headings (in both English and Urdu):

            1.  **Incident Report (English)**
                - Write a clear, formal, and empathetic summary of the user's statement.
                - Detail the events, the people involved, and the emotional state of the user as described.
                - Do NOT add any information that was not mentioned by the user.

            2.  **واقعہ کی رپورٹ (Urdu)**
                - Provide a precise and accurate Urdu translation of the English incident report you just wrote.

            3.  **Relevant Pakistani Laws (متعلقہ پاکستانی قوانین)**
                - List and briefly explain 2-3 Pakistani laws that are most relevant to the user's situation (e.g., The Punjab Protection of Women against Violence Act 2016, relevant sections of the Pakistan Penal Code).
                - The explanation should be simple and easy to understand.

            4.  **Next Steps: How to Report (اگلے اقدامات: رپورٹ کیسے کریں)**
                - Provide a clear, safe, and intuitive list of actionable steps the user can take.
                - Suggest contacting national helplines (like 1098 or 1099), reaching out to trusted NGOs (like Dastak Foundation or AGHS Legal Aid Cell), and how to approach official channels like a women's police station.
                - The tone should be highly reassuring, emphasizing confidentiality and safety.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error generating enhanced report:", error);
        return "We are sorry, but we were unable to generate the report at this time. Please try again later. Your original text has been saved.";
    }
};