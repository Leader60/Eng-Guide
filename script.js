async function askQuestion() {
    // جلب العناصر باستخدام الـ ID الصحيح الموجود في الـ HTML
    const input = document.getElementById('userQuery');
    const responseDiv = document.getElementById('answerField');
    
    // مفتاحك الذي أرفقته (سيعمل الآن لأننا أصلحنا الربط)
    const OPENROUTER_API_KEY = "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";

    // التحقق من النص
    if (!input.value.trim()) {
        responseDiv.innerText = "يرجى كتابة سؤالك الهندسي أولاً.";
        return;
    }

    const userText = input.value;
    responseDiv.innerText = "جاري استشارة المهندس المختص... 🏗️";

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://leader60.github.io/Engineering-Guide",
                "X-Title": "Engineering Guide"
            },
            body: JSON.stringify({
                "model": "deepseek/deepseek-r1:free",
                "messages": [
                    {
                        "role": "system",
                        "content": "أنت مهندس خبير لديك 40 عاماً من الخبرة. أجب على الأسئلة الهندسية باللغة العربية بأسلوب مهني ودقيق ومختصر."
                    },
                    {
                        "role": "user",
                        "content": userText
                    }
                ]
            })
        });

        const data = await response.json();
        
        if (data.choices && data.choices[0]) {
            const aiReply = data.choices[0].message.content;
            responseDiv.innerText = aiReply;
        } else {
            console.error("OpenRouter Error:", data);
            responseDiv.innerText = " عذراً، يوجد ضغط كبير على الموقع حالياً.  حاول مرة أخرى بعد قليل من فضلك.";
        }

    } catch (error) {
        console.error("Connection Error:", error);
        responseDiv.innerText = "حدث خطأ في الاتصال. تأكد من الإنترنت.";
    }
}
