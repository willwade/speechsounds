const MailerLite = require('@mailerlite/mailerlite-nodejs').default;

exports.handler = async function(event, context) {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: 'Method Not Allowed'
        };
    }

    try {
        const { email } = JSON.parse(event.body);

        if (!email) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Email is required' })
            };
        }

        const mailerlite = new MailerLite({
            api_key: process.env.MAILER_LITE_API_KEY
        });

        // Add subscriber to MailerLite
        await mailerlite.subscribers.createOrUpdate({
            email: email,
            status: 'active'
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Subscription successful' })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
}; 