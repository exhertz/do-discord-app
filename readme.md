<div align = center>
<h1>DO - Discord App</h1>

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
[![Invite]][https://discord.com/api/oauth2/authorize?client_id=1128387848391901236&permissions=8&scope=bot%20applications.commands]

[https://discord.com/api/oauth2/authorize?client_id=1128387848391901236&permissions=8&scope=bot%20applications.commands]: # 'Давай!'
[Invite]: https://img.shields.io/badge/Invite-5869EA?style=for-the-badge&logo=discord&logoColor=white

</div>

### src/config.json
```json
{
    "token": "text here",
    "clientID": "text here",
    "token_youtube": "text here",
    "token_telegram": "text here",
    "youtubeCookie": "text here",
    "spotifyId": "text here",
    "spotifySecret": "text here",
    "OPEN_AI": "text here (api key)",
    "adminTgChatId": "text here (you telegram chat id)",
    "adminId": "text here (your discord user id)",
    "prefix": "!"
}
```

### Start on hosting
```sh
pm2 start build/client.js --log ./logs/pm2/logs.txt --output ./logs/pm2/output.txt --error ./logs/pm2/errors.txt --time
```
