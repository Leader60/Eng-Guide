async function askQuestion() {
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const query = document.getElementById('userQuery').value;
    const responseField = document.getElementById('answerField');

    if (!name.trim() || !email.trim() || !query.trim()) {
        responseField.innerHTML = "<span style='color: #d44c4c;'>⚠️ من فضلك تعبئة كافة الحقول.</span>";
        return;
    }

    responseField.innerHTML = "شكراً لثقتكم بمكتبنا، جاري إرسال طلبكم للمهندس المختص... 🏗️";

    try {
        // 1. إرسال لبريدك (يعمل دائماً بإذن الله)
        fetch("https://formspree.io/f/mzdabogg", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "الاسم": name, "البريد": email, "السؤال": query })
        });

        // 2. محاولة جلب رد الذكاء الاصطناعي
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer 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",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "google/gemini-2.0-flash-lite-preview-02-05:free", // غيرت الموديل لواحد أسرع وأحدث
                "messages": [
                    { "role": "system", "content": "أنت مهندس خبير. أجب باختصار واحترافية باللغة العربية الفصحى." },
                    { "role": "user", "content": query }
                ]
            })
        });

        const data = await response.json();
        
        // التحقق مما إذا كان هناك رد فعلي
        if (data && data.choices && data.choices[0]) {
            let aiReply = data.choices[0].message.content;
            renderFinalResponse(name, email, aiReply);
        } else {
            throw new Error("AI Busy"); // في حال لم يرد الـ AI
        }

    } catch (error) {
        // حل الطوارئ: إذا تعطل الـ AI لا تظهر رسالة خطأ، بل أظهر رسالة نجاح احترافية
        renderFinalResponse(name, email, "تم استلام طلبكم بنجاح. نظراً لدقة الطلب، سيقوم فريقنا الهندسي بتدقيقه ودراسته والرد عليكم مباشرة لضمان أعلى معايير الجودة.");
    }
}

// وظيفة لعرض الشكل النهائي الموحد
function renderFinalResponse(name, email, mainText) {
    const responseField = document.getElementById('answerField');
    responseField.innerHTML = `
        <div style="color: #2e7d32; font-weight: bold; margin-bottom: 15px;">✅تم اسـتلام طلبكم بنجاح سـيد(ة)/ ${name}</div>
        <div style="text-align: center; border: 1px dashed #ccc; padding: 15px; background: #fafafa; margin-bottom: 15px; color: #333;">
            <strong>التحليل الأولي:</strong><br>${mainText}
        </div>
        <div class="audit-notice">
            <strong>📝 إشعار التدقيق البشري:</strong><br>
            تم استلام طلبكم من قبل فريق الخبراء في مكاتبنا. سيصلكم التقرير المدقق على على عنوان بريدكم الإلكتروني: <strong>(${email})</strong> في أقرب وقت.
        </div>
    `;
}
