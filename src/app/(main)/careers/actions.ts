"use server";

export async function submitCertification(formData: FormData) {
  const email = formData.get("email");
  const epin = formData.get("epin");
  const scriptUrl = process.env.GOOGLE_SHEETS_SCRIPT_URL;

  if (!scriptUrl) {
    return { success: false, error: "Google Sheets script URL not configured." };
  }

  try {
    const response = await fetch(scriptUrl, {
      method: "POST",
      body: JSON.stringify({ email, epin, timestamp: new Date().toISOString() }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to submit to Google Sheets");
    }

    return { success: true };
  } catch (error: any) {
    console.error("Submission error:", error);
    return { success: false, error: error.message };
  }
}
