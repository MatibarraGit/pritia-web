export async function notify(webhookUrl: string | undefined, payload: Record<string, unknown>): Promise<void> {
  if (!webhookUrl) return;
  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });
  } catch {
    console.error("No se pudo enviar la notificación");
  }
}