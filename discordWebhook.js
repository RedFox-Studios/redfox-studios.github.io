// discordWebhook.js
// This file handles sending data to Discord via webhook

// Replace with your Discord webhook URL
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1325525927144329317/PCYE5RoiJjlYSwWmmIK50i9xnkzIGtPWLAtq81RwzSrrM-ebs6JAD3amygj-jzjQNQOk';

export async function sendToDiscord(username) {
    try {
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        const userData = await userResponse.json();

        const message = {
            content: `🚀 **${username}** has requested to join the organization!`,
            embeds: [{
                title: `GitHub Profile: ${username}`,
                url: `https://github.com/${username}`,
                color: 0x2ecc71, // A nice green color
                thumbnail: {
                    url: userData.avatar_url
                },
                fields: [
                    {
                        name: 'Followers',
                        value: userData.followers.toString(),
                        inline: true
                    },
                    {
                        name: 'Public Repos',
                        value: userData.public_repos.toString(),
                        inline: true
                    },
                    {
                        name: 'Account Created',
                        value: new Date(userData.created_at).toDateString(),
                        inline: true
                    }
                ],
                footer: {
                    text: 'GitHub Organization Request',
                    icon_url: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'
                },
                timestamp: new Date().toISOString()
            }]
        };

        await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message)
        });
    } catch (error) {
        console.error('Error sending Discord message:', error);
        throw new Error('Failed to send request to Discord');
    }
}

