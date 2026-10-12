const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Groq = require('groq-sdk');
const midtransClient = require('midtrans-client');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Supabase Server Client
const supabaseAdmin = (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

// Midtrans Snap Client
const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: (process.env.MIDTRANS_SERVER_KEY || '').trim(),
  clientKey: (process.env.MIDTRANS_CLIENT_KEY || '').trim()
});

// 1. SCANNER ENDPOINT (Audit CV yang sudah ada)
app.post('/api/optimize', async (req, res) => {
  try {
    const { targetRole, experienceLevel, rawResume } = req.body;

    const prompt = `
    You are an expert ATS optimizer and resume reviewer.
    Target Role: ${targetRole}
    Experience Level: ${experienceLevel}
    Raw Resume Content:
    ${rawResume}

    Analyze the resume against the target role.
    Provide output in pure JSON with schema:
    {
      "atsScore": (number 0-100),
      "scoreMessage": "short motivating message",
      "summaryCritique": "string evaluating current resume briefly",
      "enhancedBullets": [
        {
          "original": "original bullet",
          "enhanced": "rewritten bullet using XYZ impact formula"
        }
      ],
      "missingKeywords": ["keyword1", "keyword2"],
      "matchedKeywords": ["keyword1", "keyword2"],
      "actionableTips": ["tip1", "tip2"]
    }
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are an AI that strictly returns valid JSON." },
        { role: "user", content: prompt }
      ],
      model: "openai/gpt-oss-120b",
      response_format: { type: "json_object" }
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "{}";
    res.json(JSON.parse(responseText));
  } catch (error) {
    console.error("Optimize Error:", error.message);
    res.status(500).json({ error: "Failed to optimize resume." });
  }
});

// 2. BUILDER HELPER ENDPOINT (Generate Summary & Polish Bullet Points)
app.post('/api/builder-assist', async (req, res) => {
  try {
    const { type, payload } = req.body;
    let prompt = "";

    if (type === "summary") {
      prompt = `Generate a compelling, professional 2-3 sentence resume summary for a ${payload.targetRole || 'Professional'} based on this background: ${payload.rawBackground || 'Passionate worker with strong problem-solving skills'}. Return JSON: {"result": "the summary text"}`;
    } else if (type === "polish-bullet") {
      prompt = `Rewrite this resume work accomplishment into a high-impact XYZ formula bullet point (Action verb + Task + Metric/Result): "${payload.bullet}". Return JSON: {"result": "the improved bullet point"}`;
    } else {
      return res.status(400).json({ error: "Invalid assistance type." });
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are an expert resume writer. Output valid JSON only." },
        { role: "user", content: prompt }
      ],
      model: "openai/gpt-oss-120b",
      response_format: { type: "json_object" }
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "{}";
    res.json(JSON.parse(responseText));
  } catch (error) {
    console.error("Builder Assist Error:", error.message);
    res.status(500).json({ error: "Failed to assist with resume content." });
  }
});

// 2b. JOB DESCRIPTION MATCHER ENDPOINT (ATS Matcher)
app.post('/api/match-job', async (req, res) => {
  try {
    const { cvData, jobDescription, targetRole } = req.body;

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({ error: "Job description wajib diisi." });
    }

    const cvSummaryText = `
Role Target: ${targetRole || cvData?.personal?.role || 'General'}
Summary: ${cvData?.personal?.summary || ''}
Experience: ${(cvData?.experiences || []).map(e => `${e.role} at ${e.company}: ${e.description}`).join('; ')}
Education: ${(cvData?.education || []).map(e => `${e.degree} at ${e.school}`).join('; ')}
Skills: Hard: ${cvData?.skills?.hard || ''}, Soft: ${cvData?.skills?.soft || ''}
Projects: ${(cvData?.portfolio || []).map(p => `${p.name}: ${p.description}`).join('; ')}
Certifications: ${(cvData?.certifications || []).map(c => `${c.title} by ${c.issuer}`).join('; ')}
    `;

    const prompt = `
You are an expert ATS (Applicant Tracking System) screening algorithm and senior recruiter.
Analyze this candidate's resume data against the job description provided.

Candidate Resume Data:
${cvSummaryText}

Job Description:
${jobDescription}

Perform in-depth analysis:
1. Calculate an accurate ATS Match Score (0 - 100 percentage).
2. Identify matched technical & soft keywords present in both CV and Job Description.
3. Identify missing critical keywords/skills mentioned in the Job Description that the CV lacks.
4. Give 3-4 specific, actionable tips to optimize the CV for this exact job description.
5. Provide a short summary in Indonesian explaining the score.

Return STRICT JSON only matching this schema:
{
  "matchScore": number,
  "verdict": "Sangat Cocok" | "Cukup Cocok" | "Perlu Penyesuaian",
  "summary": "string in Indonesian",
  "matchedKeywords": ["string"],
  "missingKeywords": ["string"],
  "tips": ["string"]
}
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are an ATS screening system. Output valid JSON strictly." },
        { role: "user", content: prompt }
      ],
      model: "openai/gpt-oss-120b",
      response_format: { type: "json_object" }
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "{}";
    res.json(JSON.parse(responseText));
  } catch (error) {
    console.error("Match Job Error:", error.message);
    res.status(500).json({ error: "Gagal menganalisis kecocokan lowongan." });
  }
});

// 3. PAYMENT ENDPOINT (Generate Midtrans Snap Token)
app.post('/api/payment/token', async (req, res) => {
  try {
    const { userId, userEmail } = req.body;
    
    if (!userId || !userEmail) {
      console.log('Missing data:', { userId, userEmail });
      return res.status(400).json({ error: "Missing user data" });
    }

    const orderId = `PRO-${Date.now()}`;
    const transactionParams = {
      transaction_details: {
        order_id: orderId,
        gross_amount: 49000
      },
      customer_details: {
        email: userEmail,
        first_name: "ATSify",
        last_name: "User"
      },
      item_details: [{
        id: 'PRO-LIFETIME',
        price: 49000,
        quantity: 1,
        name: 'ATSify Pro Lifetime'
      }],
      custom_field1: userId // Simpan userId di custom field agar tetap terbaca di webhook
    };

    console.log("Sending to midtrans:", JSON.stringify(transactionParams, null, 2));

    const transaction = await snap.createTransaction(transactionParams);
    res.json({ token: transaction.token, orderId });
  } catch (error) {
    console.error("Midtrans Error:", error.message);
    if (error.ApiResponse) {
      console.error("Midtrans API Error details:", JSON.stringify(error.ApiResponse, null, 2));
    }
    res.status(500).json({ error: "Gagal membuat transaksi pembayaran" });
  }
});

// 4. PAYMENT WEBHOOK (Terima notifikasi dari Midtrans)
app.post('/api/payment/webhook', async (req, res) => {
  try {
    const notification = req.body;
    const statusResponse = await snap.transaction.notification(notification);

    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;
    const userId = statusResponse.custom_field1;

    if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
      if (fraudStatus === 'challenge') {
        // Harus diverifikasi manual
      } else if (fraudStatus === 'accept' || !fraudStatus) {
        // Pembayaran Berhasil! Update database Supabase
        if (supabaseAdmin && userId) {
          const { error } = await supabaseAdmin
            .from('profiles')
            .update({ tier: 'pro' })
            .eq('id', userId);
            
          if (error) console.error('Supabase Update Error:', error);
        }
      }
    }
    
    res.status(200).json({ message: "OK" });
  } catch (error) {
    console.error("Webhook Error:", error.message);
    res.status(500).json({ error: "Webhook error" });
  }
});

// 5. PAYMENT VERIFY (Untuk update DB di lokal tanpa Ngrok Webhook)
app.post('/api/payment/verify', async (req, res) => {
  try {
    const { orderId, userId } = req.body;
    
    // Verifikasi status pesanan langsung ke Midtrans API
    const statusResponse = await snap.transaction.status(orderId);
    
    if (statusResponse.transaction_status === 'capture' || statusResponse.transaction_status === 'settlement') {
      if (userId) {
        // Karena service_role kosong di lokal, kita butuh pemicu alternatif atau bypass error log
        const { error } = await supabaseAdmin
          .from('profiles')
          .update({ tier: 'pro' })
          .eq('id', userId);
          
        if (error) {
          console.error('Supabase Update Error (Verify):', error);
          // Fallback lokal tanpa ngrok: Kirim response success agar frontend bisa refresh paksa (simulasi)
          return res.json({ success: true, message: "Simulasi update PRO (tanpa Service Role)" });
        }
        return res.json({ success: true, message: "Berhasil update ke PRO" });
      }
    }
    
    res.status(400).json({ error: "Pembayaran belum selesai atau data tidak valid" });
  } catch (error) {
    console.error("Verify Error:", error.message);
    res.status(500).json({ error: "Gagal verifikasi pembayaran" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
