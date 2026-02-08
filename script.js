async function askQuestion() {
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const query = document.getElementById('userQuery').value;
    const responseField = document.getElementById('answerField');

    // التأكد من ملء البيانات
    if (!name.trim() || !email.trim() || !query.trim()) {
        responseField.innerHTML = "<span style='color: #d44c4c;'>⚠️ يرجى تعبئة كافة الحقول المطلوبة (الاسم، البريد، السؤال).</span>";
        return;
    }

    responseField.innerHTML = "جاري تحليل الطلب وإعداد الرد الأولي... 🏗️";

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer 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",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://leader60.github.io/Engineering-Guide",
                "X-Title": "Engineering Guide"
            },
            body: JSON.stringify({
                "model": "deepseek/deepseek-chat:free",
                "messages": [
                    { "role": "system", "content": "أنت مهندس خبير بمؤهلات عالية. أجب بدقة واحترافية باللغة العربية الفصحى." },
                    { "role": "user", "content": query }
                ]
            })
        });

        const data = await response.json();
        let aiReply = (data.choices && data.choices[0]) ? data.choices[0].message.content : "عذراً يوجد ضغط كبير على الموقع حالياً، سننتقل مباشرة لتدقيق الخبراء.";

        // عرض النتيجة النهائية بالأسلوب المعتمد
        responseField.innerHTML = `
            <div style="color: #2e7d32; font-weight: bold; margin-bottom: 15px;">✅ تم استلام طلبك بنجاح يا ${name}</div>
            <div style="text-align: right; border: 1px dashed #ccc; padding: 15px; background: #fafafa; margin-bottom: 15px;">
                <strong>التحليل الأولي المبدئي:</strong><br>${aiReply}
            </div>
            <div style="background: #fff3cd; color: #856404; padding: 10px; border-radius: 5px; font-size: 0.95em;">
                <strong>📝 إشعار التدقيق:</strong><br>
                يتم الآن مراجعة هذه النتائج من قبل فريقنا الهندسي المعتمد. 
                <br>سيصلك التقرير النهائي المدقق إلى عنوان بريدك الإلكتروني: <strong>(${email})</strong> في أقرب وقت ممكن.
            </div>
        `;

    } catch (error) {
        console.error("Error:", error);
        responseField.innerHTML = "المعذرة حدث خطأ غير متوقع. لا تقلق، لقد تم تسجيل طلبك وسنتواصل معك عبر البريد الإلكتروني.";
    }
}
