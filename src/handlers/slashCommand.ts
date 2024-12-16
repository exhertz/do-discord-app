// eslint-disable-next-line import/no-import-module-exports
import {
	Client, PermissionsBitField, REST, Routes
} from 'discord.js';
// eslint-disable-next-line import/no-import-module-exports

import fs from 'fs';
import path from 'node:path';
import { Table } from 'console-table-printer';
import { fileURLToPath } from 'url';

const createCommandTable = (label: string) => new Table({
	columns: [
		{ name: label, alignment: 'center' },
		{ name: 's', alignment: 'center' }
	],
	colorMap: {
		custom_green: '\x1b[32m'
	}
});

const p = createCommandTable('SlashCommands');
const v = createCommandTable('ContextMenuCommands');

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default async (client: Client) => {
	const allCommands: Array<any> = [];

	await loadSlashCommand(allCommands);
	await loadMenuCommand(allCommands);

	const rest = new REST({ version: '10' }).setToken(config.token);

	await rest.put(
		client.debug
			? Routes.applicationGuildCommands(config.clientID, config.debugGuildId)
			: Routes.applicationCommands(config.clientID),
		{ body: allCommands }
	)
		.then(() => console.log('Successfully reloaded application & slash (/) commands.'))
		.catch((er) => console.log(er));
};

async function loadSlashCommand(allCommands) {
	const commandFiles = fs.readdirSync(path.join(dirname, '../commands/slash'))
		.filter((file: any) => file.endsWith('.js'));

	// eslint-disable-next-line no-restricted-syntax
	for (const file of commandFiles) {
		const cmdPath = path.join(import.meta.url, '../../commands/slash', `${file}`);

		try {
			// eslint-disable-next-line no-await-in-loop
			const command = (await import(cmdPath)).default;

			if (command) {
				allCommands.push({
					name: command.name,
					description: command.description,
					options: command.options || null,
					default_permission: command.defaultPermission || null,
					default_member_permissions: command.default_member_permissions
						? PermissionsBitField.resolve(command.default_member_permissions).toString()
						: null
				});
	
				client.slashCommands.set(command.name, command);
			}

			p.addRow({
				SlashCommands: `${file} -> ${command ? command.name : 'Unknown'}`,
				s: command ? '+' : '-'
			}, { color: command ? 'custom_green' : 'red' });
		} catch (e) {
			console.log(e);
		}
	}

	p.printTable();
}

async function loadMenuCommand(allCommands) {
	const menuFiles = fs.readdirSync(path.join(dirname, '../commands/menu'))
		.filter((file: any) => file.endsWith('.js'));

	// eslint-disable-next-line no-restricted-syntax
	for (const file of menuFiles) {
		const cmdPath = path.join(import.meta.url, '../../commands/menu', `${file}`);

		try {
			// eslint-disable-next-line no-await-in-loop
			const command = (await import(cmdPath)).default;

			if (command) {
				allCommands.push({
					name: command.name,
					type: command.type
				});
	
				client.contextMenuCommands.set(command.name, command);
			}
			
			v.addRow({
				ContextMenuCommands: `${file} -> ${command ? command.name : 'Unknown'}`,
				s: command ? '+' : '-'
			}, { color: command ? 'custom_green' : 'red' });
		} catch (e) {
			console.log(e);
		}
	}

	v.printTable();
}