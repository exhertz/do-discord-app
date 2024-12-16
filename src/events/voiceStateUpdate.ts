import { VoiceState } from 'discord.js';
import { DB } from '../modules/database.js';

global.client.on('voiceStateUpdate', async (oldState: VoiceState, newState: VoiceState) => {
	const state = newState.guild.id ? newState : oldState;

	if (state.member.user.bot) return;

	const MemMember = await DB.getGuildMember(state.guild, state.member);

	if ((!oldState.channel || oldState.channel == newState.channel)
		&& (newState.selfMute == false && newState.selfDeaf == false)) {
		global.client.voiceTime.set(newState.member.id, {
			start: Date.now()
		});
	}

	if (oldState.channel == newState.channel) {
		if ((newState.selfMute == true || newState.selfDeaf == true) && oldState.selfMute != newState.selfMute) {
			const startTime = global.client.voiceTime.get(newState.member.id);
			if (!startTime) return;

			const time = Math.floor((Date.now() - startTime.start) / 1000);
			MemMember.voice_time += time;
			global.rankSystem.addExp(oldState.member, 0.0625 * Math.trunc(time / 60));
		}
	}

	if (oldState.channel && !newState.channel && (newState.selfMute == false && newState.selfDeaf == false)) {
		const startTime = global.client.voiceTime.get(oldState.member.id);
		if (!startTime) return;

		const time = Math.floor((Date.now() - startTime.start) / 1000);
		MemMember.voice_time += time;
		global.rankSystem.addExp(oldState.member, 0.0625 * Math.trunc(time / 60));
	}
});