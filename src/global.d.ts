/* eslint-disable no-var */
/* eslint-disable vars-on-top */
import { Client } from 'discord.js';

export interface global {}
declare global {
    var config: any;
	var log: any;
	var CheckModer: any;
	var checkRolePosition: any;
	var sendEmbed: any;
	var rankSystem: any;
	var client: Client;
	// eslint-disable-next-line no-underscore-dangle
}