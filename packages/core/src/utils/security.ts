import crypto from 'crypto';

export function signRequest(
  payload: Record<string, any>,
  apiKey: string,
  timestamp = Date.now()
): { signature: string; timestamp: number } {
  const stringToSign = JSON.stringify(payload) + timestamp + apiKey;
  const signature = crypto
    .createHmac('sha256', apiKey)
    .update(stringToSign)
    .digest('hex');

  return {
    signature,
    timestamp
  };
}

export function verifyWebhookSignature(
  payload: string | Record<string, any>,
  signature: string,
  webhookSecret: string,
  timestamp: number
): boolean {
  // Safety check: don't accept webhooks more than 5 minutes old
  const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
  if (timestamp < fiveMinutesAgo) {
    return false;
  }

  const payloadStr = typeof payload === 'string' 
    ? payload 
    : JSON.stringify(payload);

  const stringToSign = payloadStr + timestamp + webhookSecret;
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(stringToSign)
    .digest('hex');

  // Use a constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
