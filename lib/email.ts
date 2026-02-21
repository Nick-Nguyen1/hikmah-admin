/**
 * Email sending. Set RESEND_API_KEY in .env to send real emails;
 * otherwise logs to console (e.g. in development).
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.EMAIL_FROM ?? "noreply@example.com";

export type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail({ to, subject, html, text }: SendEmailOptions): Promise<void> {
  if (RESEND_API_KEY) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html,
        text: text ?? html.replace(/<[^>]*>/g, ""),
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", res.status, err);
      throw new Error("Failed to send email");
    }
  } else {
    console.log("[Email (no RESEND_API_KEY)]", { to, subject });
  }
}
