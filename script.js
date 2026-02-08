async function askQuestion() {
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const query = document.getElementById('userQuery').value;
    const responseField = document.getElementById('answerField');

    if (!name.trim() || !email.trim() || !query.trim()) {
        responseField.innerHTML = "<span style='color: #d44c4c;'>⚠️ يرجى تعبئة كافة الحقول (الاسم، البريد، السؤال).</span>";
        return;
    }

    responseField.innerHTML = "جاري معالجة طلبك وإرسال الاستشارة للمهندس... 🏗️";

    try {
        // 1. إرسال نسخة لبريدك عبر Formspree
        fetch("https://formspree.io/f/mzdabogg", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "اسم العميل": name,
                "البريد الإلكتروني": email,
                "تفاصيل الاستشارة": query
            })
        });

        // 2. إرسال الاستفسار للذكاء الاصطناعي باستخدام المفتاح الجديد
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer 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",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://leader60.github.io/Engineering-Guide",
                "X-Title": "Engineering Guide"
            },
            body: JSON.stringify({
                "model": "google/gemini-2.0-flash-lite-preview-02-05:free",
                "messages": [
                    { "role": "system", "content": "أنت مهندس خبير بمؤهلات عالية. أجب بدقة واحترافية باللغة العربية." },
                    { "role": "user", "content": query }
                ]
            })
        });

        const data = await response.json();
        
        if (data && data.choices && data.choices[0]) {
            let aiReply = data.choices[0].message.content;
            renderFinalResponse(name, email, aiReply);
        } else {
            throw new Error("AI response empty");
        }

    } catch (error) {
        console.error("Error:", error);
        // في حال فشل الـ AI لأي سبب أمني أو فني، تظهر رسالة احترافية للعميل
        renderFinalResponse(name, email, "شكراً لثقتكم بنا، لقد تم استلام طلبكم بنجاح. نظراً لدقة التفاصيل المطلوبة ورغبة منّا في تقديم أفضل النتائج، نعتذرسلفاً عن التأخير، حيث يقوم حالياً فريق من المهندسين أصحاب الاختصاص بدراسة طلبكم بعناية لتقديم إجابة فنية دقيقة.");
    }
}

function renderFinalResponse(name, email, mainText) {
    const responseField = document.getElementById('answerField');
    responseField.innerHTML = `
        <div style="color: #2e7d32; font-weight: bold; margin-bottom: 15px;">✅ تم استلام طلبكم بنجاح سيد/ة:  ${name}</div>
        <div style="text-align: center; border: 1px dashed #ccc; padding: 15px; background: #fafafa; margin-bottom: 15px; color: #333;">
            <strong>التحليل الأولي المبدئي:</strong><br>${mainText}
        </div>
        <div class="audit-notice">
            <strong>📝 إشعار التدقيق البشري:</strong><br>
            تم استلام طلبكم الآن في مكاتبنا. سيصلكم التقرير بعد تدقيقه على عنوان بريدكم الإلكتروني المسجل لدينا: <strong>(${email})</strong> في أقرب وقت ممكن.
        </div>
    `;
}
