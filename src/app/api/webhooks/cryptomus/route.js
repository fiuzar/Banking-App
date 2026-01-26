import {query} from "@/dbh"
import crypto from 'crypto';

export async function POST(req) {
  const body = await req.json();
  const { sign, ...data } = body;

  // Verify Cryptomus Signature
  const checkSign = crypto
    .createHash('md5')
    .update(Buffer.from(JSON.stringify(data)).toString('base64') + process.env.CRYPTOMUS_API_KEY)
    .digest('hex');

  if (checkSign !== sign) {
    return new Response('Invalid Signature', { status: 400 });
  }

  // Cryptomus sends 'paid' or 'paid_over' when successful
  if (data.status === 'paid' || data.status === 'paid_over') {
    const userId = data.order_id.split('_')[0]; // We encoded this earlier
    const amount = parseFloat(data.amount);

    try {
      await client.query(
        'UPDATE users SET savings_balance = savings_balance + $1 WHERE id = $2',
        [amount, userId]
      );
    } 
    catch(error) {
    return new Response('Failed to update table', {status: 500})
}
  }

  return new Response('OK', { status: 200 });
}