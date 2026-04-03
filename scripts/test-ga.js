const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf-8').split('\n').reduce((acc, line) => {
  const [key, ...val] = line.split('=');
  if (key && val.length) acc[key.trim()] = val.join('=').trim();
  return acc;
}, {});
process.env = { ...process.env, ...env };


async function main() {
  try {
    const propertyId = process.env.GA_PROPERTY_ID;
    const clientEmail = process.env.GA_CLIENT_EMAIL?.replace(/"/g, '');
    let privateKey = process.env.GA_PRIVATE_KEY || '';
    
    // Remove surrounding quotes if they exist, then replace escaped \n
    privateKey = privateKey.replace(/^"|"$/g, '').replace(/\\n/g, '\n');

    console.log("Property ID:", propertyId);
    console.log("Client Email:", clientEmail);
    console.log("Private Key valid:", privateKey.includes('BEGIN PRIVATE KEY'));

    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      projectId: clientEmail?.split('@')[1]?.split('.')[0],
    });

    console.log("Requesting data...");
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      limit: 1,
    });

    console.log("Success! Data:");
    console.log(JSON.stringify(response.rows, null, 2));

  } catch (error) {
    console.error("FATAL ERROR:");
    console.error(error.message);
  }
}

main();
