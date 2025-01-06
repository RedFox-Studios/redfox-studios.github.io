(() => {
    const config = {
        webhook: 'DISCORD_WEBHOOK_URL'
    };

    const tracker = {
        async getIP() {
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                return data.ip;
            } catch (error) {
                throw new Error('Could not fetch IP address');
            }
        },

        async sendToDiscord(ip) {
            try {
                const response = await fetch(config.webhook, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: "IP Tracker",
                        embeds: [{
                            title: "🌐 New Visit Detected",
                            color: 3447003,
                            fields: [
                                { name: "📍 IP Address", value: ip, inline: true },
                                { name: "🔗 Page", value: window.location.href, inline: false },
                                { name: "↩️ Referrer", value: document.referrer || 'Direct', inline: true }
                            ],
                            timestamp: new Date().toISOString(),
                            footer: { text: "IP Tracker v2.0" }
                        }]
                    })
                });

                if (!response.ok) {
                    throw new Error(`Discord webhook failed: ${response.status}`);
                }
            } catch (error) {
                throw new Error('Failed to send to Discord');
            }
        },

        async init() {
            try {
                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                    return;
                }

                const ip = await this.getIP();
                if (!ip) throw new Error('No IP address returned');

                await this.sendToDiscord(ip);

            } catch (error) {
                // Try to send error to Discord
                try {
                    await fetch(config.webhook, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            username: "IP Tracker",
                            embeds: [{
                                title: "⚠️ Tracking Error",
                                color: 15158332,
                                fields: [
                                    { name: "Error", value: error.message },
                                    { name: "Page", value: window.location.href }
                                ],
                                timestamp: new Date().toISOString()
                            }]
                        })
                    });
                } catch {
                    // Silent fail if error reporting fails
                }
            }
        }
    };

    // Start tracking with a small delay
    setTimeout(() => {
        const pageKey = btoa(window.location.href);
        if (!sessionStorage.getItem(pageKey)) {
            tracker.init();
            sessionStorage.setItem(pageKey, '1');
        }
    }, 1000);
})();