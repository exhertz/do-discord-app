/* eslint-disable max-len */
import { Message, PermissionsBitField, Collection, ChannelType } from 'discord.js';
import { DB } from '../modules/database.js';
const cooldown = new Collection();

global.client.on('messageCreate', async (message: Message) => {
	if (message.author.bot) return;

	if (message.channel.type == ChannelType.GuildText) { // GUILD TEXT - 0
		const MemMember = await DB.getGuildMember(message.guild, message.member);

		MemMember.messages += 1;
		await global.rankSystem.addExp(message.member, 0.125);

		if (message.content) global.log.add(`[${message.channel.name}] ${message.author.tag}: ${message.content}`, message.guild);
		if (message.attachments.size != 0) {
			let logText = '';
			message.attachments.forEach((el: any) => {
				logText = logText.concat(` (${el.name}, ${el.url})`);
			});
			global.log.add(`[${message.channel.name}] [attachments] ${message.author.tag}:${logText}`, message.guild);
		}

		if ((message.content.includes('+rep') || message.content.includes('+реп')) && message.reference) {
			const replyMessage = message.reference.messageId;
			const whoAddRep = message.author;
			const RepMessage = await message.channel.messages.fetch(replyMessage);
			const whoRepMessage = RepMessage.author;

			if (cooldown.has(`rep-${whoAddRep.id}`)) {
				message.reply(`Выдать клевер участнику можно будет через ${new Date(
					Number(cooldown.get(`rep-${whoAddRep.id}`)) - Date.now()
				).toISOString()
					.slice(11, 19)}`)
					.then((msg) => {
						setTimeout(() => {
							msg.delete()
								.catch(console.log);
						}, 10000);
					});
				return;
			}
			if (RepMessage.content.length < 10) return;
			if (whoRepMessage.bot) return;
			if (whoAddRep.id == whoRepMessage.id) return;

			cooldown.set(`rep-${whoAddRep.id}`, Date.now() + 12 * 3600000);
			setTimeout(() => {
				cooldown.delete(`rep-${whoAddRep.id}`);
			}, 12 * 3600000);

			message.channel.send(`${whoAddRep} посчитал сообщение ${whoRepMessage} полезным. Начислен один клевер.`);
			const userRep = await DB.getUser(whoRepMessage);
			userRep.clovers += 1;
		}
	}

	if (!message.content.startsWith(global.config.prefix)) {
		return;
	}

	const args = message.content.slice(global.config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	const cmd = global.client.commands.get(command);

	if (cmd) {
		if (cmd.userPerms || cmd.botPerms) {
			if (!message.member.permissions.has(PermissionsBitField.resolve(cmd.userPerms || []))) {
				return message.reply({
					embeds: [{
						color: global.client.color,
						description: `У тебя нет разрешения \`${global.client.namePermission(cmd.userPerms)}\` чтобы использовать эту команду!`
					}]
				});
			}
			if (!message.guild.members.cache.get(global.client.user.id).permissions.has(PermissionsBitField.resolve(cmd.botPerms || []))) {
				return message.reply({
					embeds: [{
						color: global.client.color,
						description: `У меня нет разрешения \`${global.client.namePermission(cmd.botPerms)}\` чтобы использовать эту команду!`
					}]
				});
			}
		}
		// eslint-disable-next-line no-param-reassign
		message.args = args;
		cmd.run(global.client, message);
	}
});