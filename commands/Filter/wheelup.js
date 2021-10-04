const {
	MessageEmbed,
	Message
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const {
	check_if_dj
} = require("../../handlers/functions")
const FiltersSettings = require("../../botconfig/filters.json");
const { RepeatMode } = require("distube");
module.exports = {
	name: "wheelup", //the command name for the Slash Command

	category: "Filter",
	usage: "wheelup",
	aliases: ["reload", "wheel", "wheelit", "pullup"],

	description: "Wheels up the Song!", //the command description for Slash Command Overview
	cooldown: 5,
	requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
	alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
	run: async (client, message, args) => {
		try {
			const {
				member,
				guildId,
				guild
			} = message;
			const {
				channel
			} = member.voice;
			if (!channel) return message.reply({
				embeds: [
					new MessageEmbed().setColor(ee.wrongcolor).setTitle(`${client.allEmojis.x} **Please join ${guild.me.voice.channel ? "__my__" : "a"} VoiceChannel First!**`)
				],

			})
			if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
				return message.reply({
					embeds: [new MessageEmbed()
						.setColor(ee.wrongcolor)
						.setFooter(ee.footertext, ee.footericon)
						.setTitle(`${client.allEmojis.x} Join __my__ Voice Channel!`)
						.setDescription(`<#${guild.me.voice.channel.id}>`)
					],
				});
			}
			try {
				let newQueue = client.distube.getQueue(guildId);
				if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return message.reply({
					embeds: [
						new MessageEmbed().setColor(ee.wrongcolor).setTitle(`${client.allEmojis.x} **I am nothing Playing right now!**`)
					],

				})
				if (check_if_dj(client, member, newQueue.songs[0])) {
					return message.reply({
						embeds: [new MessageEmbed()
							.setColor(ee.wrongcolor)
							.setFooter(ee.footertext, ee.footericon)
							.setTitle(`${client.allEmojis.x}**You are not a DJ and not the Song Requester!**`)
							.setDescription(`**DJ-ROLES:**\n> ${check_if_dj(client, member, newQueue.songs[0])}`)
						],
					});
				}

				let wheelupSpeed 
				args[0] ? wheelupSpeed = args[0] : wheelupSpeed = 8

				let cuePoint = await newQueue.currentTime
				let duration = await newQueue.songs[0].duration
				let beginTime = duration - cuePoint
				await newQueue.setRepeatMode(1);
				let oldFilterNames = newQueue.filters
				FiltersSettings.wheelup = `asetrate=48000*${wheelupSpeed},areverse`;
				client.distube.filters = FiltersSettings;
				
				//clear filters
				await newQueue.setFilter(false);
				if (newQueue.filters.includes("wheelup")) {
					await newQueue.setFilter(["wheelup"]);
				}
				await newQueue.setFilter(["wheelup"]);
				await newQueue.seek(beginTime)
				message.reply({
					embeds: [new MessageEmbed()
					  .setColor(ee.color)
					  .setTimestamp()
					  .setTitle(`♨️ **Wheeling up!**`)
					  .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
				});
				
				client.distube.once(`finishSong`, async (queue, song) => {
					//add old filters so that they get removed 	
					//if it was enabled before then add it
					if (newQueue.filters.includes("wheelup")) {
						await newQueue.setFilter(["wheelup"]);
					}
					await newQueue.setFilter(oldFilterNames);
					message.reply({
						embeds: [new MessageEmbed()
							.setColor(ee.color)
							.setTimestamp()
							.setTitle(`♨️ **Finished wheelup!**`)
							.setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))],
					})
					await newQueue.setRepeatMode(1);
				})
			
			} catch (e) {
				console.log(e.stack ? e.stack : e)
				message.reply({
					content: `${client.allEmojis.x} | Error: `,
					embeds: [
						new MessageEmbed().setColor(ee.wrongcolor)
						.setDescription(`\`\`\`${e}\`\`\``)
					],

				})
			}
		} catch (e) {
			console.log(String(e.stack).bgRed)
		}
	}
}
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
