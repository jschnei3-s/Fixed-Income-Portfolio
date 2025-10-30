// Vercel Serverless Function for Live Bond Yield Data

/**
 * Serverless API endpoint for fetching live bond yields
 * This prevents exposing API keys on the client side
 */

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // Only allow GET requests
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }
    
    const { symbol } = req.query;
    
    // Validate symbol parameter
    if (!symbol) {
        res.status(400).json({ error: 'Symbol parameter is required' });
        return;
    }
    
    // Get API key from environment variables
    const apiKey = process.env.FINNHUB_API_KEY;
    
    if (!apiKey) {
        console.error('FINNHUB_API_KEY not configured');
        res.status(500).json({ error: 'API key not configured' });
        return;
    }
    
    try {
        // Finnhub API endpoint for bond yields
        const apiUrl = `https://finnhub.io/api/v1/bond/yield?symbol=${symbol}&token=${apiKey}`;
        
        // Fetch data from Finnhub
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Return the data
        res.status(200).json(data);
        
    } catch (error) {
        console.error('Error fetching live yield data:', error);
        res.status(500).json({ 
            error: 'Failed to fetch live yield data',
            details: error.message 
        });
    }
}

