import { Client } from 'discord.js';

import fs from 'fs';
import path from 'node:path';
import { Table } from 'console-table-printer';
import { fileURLToPath } from 'url';

const p = new Table({
	columns: [
		{ name: 'ChatCommands', alignment: 'center' },
		{ name: 's', alignment: 'center' }
	],
	colorMap: {
		custom_green: '\x1b[32m'
	}
});

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default async (client: Client) => {
	const commandFiles = fs.readdirSync(path.join(dirname, '../commands/chat'))
		.filter((file: any) => file.endsWith('.js'));

	// eslint-disable-next-line no-restricted-syntax
	for (const file of commandFiles) {
		const cmdPath = path.join(import.meta.url, '../../commands/chat', `${file}`);

		try {
			// eslint-disable-next-line no-await-in-loop
			const command = (await import(cmdPath)).default;

			if (command) {
				client.commands.set(command.name, command);
			}

			p.addRow({
				ChatCommands: `${file} -> ${command ? command.name : 'Unknown'}`,
				s: command ? '+' : '-'
			}, { color: command ? 'custom_green' : 'red' });
		} catch (e) {
			console.log(e);
		}
	}

	p.printTable();
};