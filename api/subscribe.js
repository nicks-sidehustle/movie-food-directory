export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        listIds: [20],
        updateEnabled: true,
      }),
    });

    if (response.ok || response.status === 204) {
      return res.status(200).json({ message: 'Subscribed successfully!' });
    }

    const data = await response.json();

    // "Contact already exist" is fine
    if (data.code === 'duplicate_parameter') {
      return res.status(200).json({ message: 'You are already subscribed!' });
    }

    return res.status(response.status).json({ error: data.message || 'Subscription failed' });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
