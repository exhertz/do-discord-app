import { Guild } from 'discord.js';

global.client.on('ready', async () => {
	console.timeEnd('Start bot time');
	let serverList = `\nServers(${global.client.guilds.cache.size}):`;
	await global.client.guilds.cache.forEach((guild: Guild) => {
		serverList = serverList.concat('\n\t', `ID: ${guild.id}  Name: ${guild.name}`);
		// guild.commands.set([]); // Clear all guild command. Using ONLY global.
	});
	console.log(serverList);

	setInterval(() => {
		console.log(`[~] ${new Date().toLocaleDateString().slice(0, -5)} ${new Date().toLocaleTimeString()} | PING: ${Math.round(global.client.ws.ping)} ms`);
	}, 1800000);
});
