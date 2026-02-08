async function askQuestion() {
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const query = document.getElementById('userQuery').value;
    const responseField = document.getElementById('answerField');

    // 1. التأكد من ملء البيانات
    if (!name.trim() || !email.trim() || !query.trim()) {
        responseField.innerHTML = "<span style='color: #d44c4c;'>⚠️ من فضلك تعبئة كافة الحقول (الاسم، البريد، السؤال).</span>";
        return;
    }

    responseField.innerHTML = "جاري معالجة الطلب وإرساله للمهندس المختص... 🏗️";

    try {
        // 2. إرسال نسخة لبريدك عبر Formspree (خلف الكواليس)
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

        // 3. إرسال الاستفسار للذكاء الاصطناعي للرد الفوري
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer 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",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "deepseek/deepseek-chat:free",
                "messages": [
                    { "role": "system", "content": "أنت مهندس خبير بمؤهلات عالية. أجب بدقة واحترافية باللغة العربية." },
                    { "role": "user", "content": query }
                ]
            })
        });

        const data = await response.json();
        let aiReply = (data.choices && data.choices[0]) ? data.choices[0].message.content : "تم استلام طلبك بنجاح، وسيقوم المهندس بالرد عليك مباشرة.";

        // 4. عرض النتيجة النهائية في الموقع
        responseField.innerHTML = `
            <div style="color: #2e7d32; font-weight: bold; margin-bottom: 15px;">✅ تم اسـتلام طلبك بنجاح يا سـيد/ة ${name}</div>
            <div style="text-align: center; border: 1px dashed #ccc; padding: 15px; background: #fafafa; margin-bottom: 15px; color: #333;">
                <strong>التحليل الأولي المبدئي:</strong><br>${aiReply}
            </div>
            <div class="audit-notice">
                <strong>📝 إشعار التدقيق البشري:</strong><br>
                لقد تم استلام طلبك من قبل المكتب الاستشاري في مكاتبنا. يقوم فريق الخبراء بمراجعة البيانات لضمان دقتها.
                <br>سيصلك التقرير النهائي المدقق على عنوان بريدك الإلكتروني: <strong>(${email})</strong> في أقرب وقت ممكن.
            </div>
        `;

    } catch (error) {
        console.error("Error:", error);
        responseField.innerHTML = "تم إرسال طلبك للمهندس المختص بنجاح، وسنتواصل معك عبر عنوان البريد الإلكتروني قريباً.";
    }
}
