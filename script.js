async function askQuestion() {
    const input = document.getElementById('user-input').value;
    const responseDiv = document.getElementById('response');
    
    // تأكد من وضع مفتاحك هنا
    const OPENROUTER_API_KEY = "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";

    if (!input) {
        responseDiv.innerText = "يرجى كتابة سؤالك الهندسي أولاً.";
        return;
    }

    responseDiv.innerText = "جاري استشارة المهنس المختص... 🏗️";

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://leader60.github.io", 
                "X-Title": "Engineering Guide"
            },
            body: JSON.stringify({
                "model": "meta-llama/llama-3-8b-instruct:free",
                "messages": [
                    {
                        "role": "system",
                        "content": "أنت مهندس خبير لديك 40 عاماً من الخبرة. أجب على الأسئلة الهندسية باللغة العربية بأسلوب مهني ودقيق."
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
            responseDiv.innerText = "عذراً، لم أتمكن من الحصول على رد حالياً. حاول مرة أخرى.";
        }

    } catch (error) {
        console.error("Error:", error);
        responseDiv.innerText = "حدث خطأ في الاتصال. تأكد من إعدادات المفتاح والإنترنت.";
    }
}
