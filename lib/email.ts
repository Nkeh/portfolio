import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail({ name, email, subject, message }: {
  name: string; email: string; subject: string; message: string;
}) {
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
    to: [process.env.PORTFOLIO_OWNER_EMAIL || "ransom@example.com"],
    subject: `[Portfolio] ${subject}`,
    replyTo: email,
    html: `
      <div style="font-family:monospace;max-width:600px;margin:0 auto;background:#080A08;color:#F0F5F0;padding:32px;border:1px solid rgba(0,200,83,0.2);border-radius:4px">
        <div style="border-left:3px solid #00C853;padding-left:16px;margin-bottom:24px">
          <h1 style="font-size:20px;margin:0;color:#00C853">New Message</h1>
          <p style="color:#8A9E8A;margin:4px 0 0;font-size:13px">ransom.dev portfolio contact form</p>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
          <tr><td style="padding:8px 0;color:#8A9E8A;width:80px;font-size:13px">From:</td><td style="padding:8px 0;color:#F0F5F0">${name}</td></tr>
          <tr><td style="padding:8px 0;color:#8A9E8A;font-size:13px">Email:</td><td style="padding:8px 0;color:#00C853">${email}</td></tr>
          <tr><td style="padding:8px 0;color:#8A9E8A;font-size:13px">Subject:</td><td style="padding:8px 0;color:#F0F5F0">${subject}</td></tr>
        </table>
        <div style="padding:20px;background:#111611;border:1px solid rgba(0,200,83,0.1);border-radius:4px">
          <p style="color:#8A9E8A;font-size:11px;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.1em">Message</p>
          <p style="color:#F0F5F0;line-height:1.7;margin:0;white-space:pre-wrap;font-size:14px">${message}</p>
        </div>
        <p style="color:#4A5E4A;font-size:12px;margin-top:24px">Reply directly to this email to respond to ${name}.</p>
      </div>
    `,
  });
  if (error) throw new Error(error.message);
  return data;
}
