import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID || "service_8zd9m0p";
const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || "template_je5g0df";
const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || "rbs-LjFvOElLQhTFf";

emailjs.init({
  publicKey: EMAILJS_PUBLIC_KEY,
  limitRate: {
    throttle: 1000,
  },
});

function buildTemplateParams({ toEmail, toName, otp, mode }) {
  return {
    email: toEmail,
    to_email: toEmail,
    reply_to: toEmail,
    to_name: toName || "User",
    user_name: toName || "User",
    passcode: otp,
    otp,
    verification_code: otp,
    time: "15 minutes",
    auth_mode: mode,
    app_name: "Smart Timetable",
    message: `Your Smart Timetable verification code is ${otp}. It is valid for 15 minutes.`,
  };
}

export async function sendOtpEmail({ toEmail, toName, otp, mode }) {
  const templateParams = buildTemplateParams({ toEmail, toName, otp, mode });

  try {
    return await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY,
    );
  } catch (sdkError) {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: templateParams,
      }),
    });

    if (!response.ok) {
      const responseText = await response.text();
      throw new Error(responseText || sdkError?.text || sdkError?.message || "Failed to send OTP email.");
    }

    return { status: response.status, text: "OK" };
  }
}
