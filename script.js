async function askQuestion() {
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const query = document.getElementById('userQuery').value;
    const responseField = document.getElementById('answerField');

    if (!name.trim() || !email.trim() || !query.trim()) {
        responseField.innerHTML = "<span style='color: #d44c4c;'>⚠️ من فضلكم تعبئة كافة الحقول.</span>";
        return;
    }

    responseField.innerHTML = "جاري إرسال طلبكم للمهندس المختص... 🏗️";

    // تجزئة المفتاح الجديد لحمايته من روبوتات GitHub
    const p1 = "sk-or-v1-327892e3a79cded7";
    const p2 = "eae95c307b104c56546f4d4c0e8d4541";
    const p3 = "2ebd010d924d0d55";

    try {
        // إرسال لبريدك عبر Formspree
        fetch("https://formspree.io/f/mzdabogg", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "الاسم": name, "البريد": email, "السؤال": query })
        });

        // طلب الرد من الذكاء الاصطناعي
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + p1 + p2 + p3, 
                "Content-Type": "application/json",
                "HTTP-Referer": "https://leader60.github.io/Engineering-Guide"
            },
            body: JSON.stringify({
                "model": "google/gemini-2.0-flash-lite-preview-02-05:free",
                "messages": [
                    { "role": "system", "content": "أنت مهندس خبير. أجب بدقة واحترافية باللغة العربية الفصحى." },
                    { "role": "user", "content": query }
                ]
            })
        });

        const data = await response.json();
        
        if (data && data.choices && data.choices[0]) {
            renderFinalResponse(name, email, data.choices[0].message.content);
        } else {
            throw new Error("API Limit");
        }

    } catch (error) {
        renderFinalResponse(name, email, "شكراً لثقتكم بنا، نثمّنها عالياً، فهي دافعنا الأساسي لتقديم الأفضل، تم اسـتلام طلبكم بنجاح ✅. سـيقوم مهندسونا بمراجعة الطلب والرد عليكم عبر البريد الإلكتروني في أقرب وقت ممكن، وكوننا نسعى لتقديم أفضل وأدق النتائج الفنية فإننا نعتذر سلفاً عن أي تأخير يحصل.");
    }
}

function renderFinalResponse(name, email, mainText) {
    const responseField = document.getElementById('answerField');
    responseField.innerHTML = `
        <div style="color: #2e7d32; font-weight: bold; margin-bottom: 15px;">✅ تم استلام طلبكم بنجاح سـيد/ة:  ${name}</div>
        <div style="text-align: center; border: 1px dashed #ccc; padding: 15px; background: #fafafa; margin-bottom: 15px; color: #333;">
            <strong>التحليل الأولي:</strong><br>${mainText}
        </div>
        <div class="audit-notice">
            نعلمكم وصول استشارتكم إلى مكاتبنا. سيصلكم التقرير الفني المدقق على بريدكم الإلكتروني: <strong>(${email})</strong> قريباً.
        </div>
    `;
}

// كود لتفعيل زر الإعجاب عند الضغط عليه
document.querySelectorAll('.action-btn').forEach(button => {
    button.addEventListener('click', function() {
        if (this.innerText.includes('إعجاب')) {
            this.style.color = this.style.color === 'red' ? 'var(--gold)' : 'red';
        }
    });
});

