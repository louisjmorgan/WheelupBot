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
module.exports = {
	name: "customecho", //the command name for the Slash Command

	category: "Filter",
	usage: "customecho <Time (0-9000.0) ms> <Decay (0-1.0>",
	aliases: ["echo", "delay"],

	description: "Sets a custom bit reduction!", //the command description for Slash Command Overview
	cooldown: 3,
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
				if (!args[0]) {
					return message.reply({
						embeds: [
							new MessageEmbed()
							.setColor(ee.wrongcolor)
							.setFooter(ee.footertext, ee.footericon)
							.setTitle(`${client.allEmojis.x} **Please add a delay between 2 and 9000ms !**`)
						],
					})
				}
				
				let delay = parseFloat(args[0])

				if (delay > 9000.0 || delay < 0) {
					return message.reply({
						embeds: [
							new MessageEmbed()
							.setColor(ee.wrongcolor)
							.setFooter(ee.footertext, ee.footericon)
							.setTitle(`${client.allEmojis.x} **The delay must be between 2 and 9000ms !**`)
						],
					})
				}

				let decay = args[1] ? parseFloat(args[1]) : 0.5

				if (decay < 0 || decay > 1) {
					return message.reply({
						embeds: [
							new MessageEmbed()
							.setColor(ee.wrongcolor)
							.setFooter(ee.footertext, ee.footericon)
							.setTitle(`${client.allEmojis.x} **The decay must be between 0 and 1 !**`)
						],
					})
				}


				FiltersSettings.customecho = `aecho=0.8:0.8:${delay}|${delay}:${decay}|${decay}`;
				client.distube.filters = FiltersSettings;
				//add old filters so that they get removed 	
				//if it was enabled before then add it
				if (newQueue.filters.includes("customecho")) {
					await newQueue.setFilter(["customecho"]);
				}
				await newQueue.setFilter(["customecho"]);
				message.reply({
					embeds: [new MessageEmbed()
					  .setColor(ee.color)
					  .setTimestamp()
					  .setTitle(`♨️ **Set an echo of delay interval: ${delay} ms and decay ${decay} !**`)
					  .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
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
