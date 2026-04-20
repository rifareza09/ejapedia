export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { endpoint = '', ...queryParams } = req.query;
    const API_KEY = 'ak_rCTGDq_ut_1aMDQBxkTy-J8TM9HDAqJX';
    const API_BASE = 'https://api.vharasc.dev/api/v1/komiku';
    
    // Build the URL
    const url = `${API_BASE}/${endpoint}`;
    
    // Build query string with API key
    const queryString = new URLSearchParams({
      ...queryParams,
      apikey: API_KEY,
    }).toString();

    const fullUrl = `${url}?${queryString}`;
    console.log(`[PROXY] GET ${fullUrl}`);

    // Forward the request to the actual API
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    console.log(`[PROXY] Success: ${response.status}`);

    // Return the response with CORS headers
    res.status(200).json(data);
  } catch (error) {
    console.error('[PROXY] Error:', error.message);
    res.status(500).json({ 
      error: error.message,
      code: 'PROXY_ERROR'
    });
  }
}
