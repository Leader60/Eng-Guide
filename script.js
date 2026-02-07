// ملف script.js - منطق الذكاء الاصطناعي والربط مع OpenRouter
const OPENROUTER_API_KEY = "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";

async function askQuestion() {
    const input = document.getElementById('user-input').value;
    const responseDiv = document.getElementById('response');
    
    if (!input) return;

    responseDiv.innerText = "جاري استشارة الذكاء الاصطناعي الهندسي... 🏗️";

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "deepseek/deepseek-r1:free", // النموذج المجاني
                "messages": [
                    {
                        "role": "system",
                        "content": "أنت مهندس خبير (Engineering Guide) لديك 40 عاماً من الخبرة. أجب على الأسئلة الهندسية باللغة العربية بأسلوب مهني ودقيق ومختصر."
                    },
                    {
                        "role": "user",
                        "content": input
                    }
                ]
            })
        });

        const data = await response.json();
        
        if (data.choices && data.choices[0]) {
            const aiReply = data.choices[0].message.content;
            responseDiv.innerText = aiReply;
        } else {
            responseDiv.innerText = "عذراً، لم أتمكن من الحصول على إجابة حالياً.";
        }

    } catch (error) {
        console.error("Error:", error);
        responseDiv.innerText = "حدث خطأ في الاتصال، يرجى المحاولة لاحقاً.";
    }
}
