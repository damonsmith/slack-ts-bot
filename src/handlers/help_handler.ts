import { MessageHandler, MatchingMessageHandler } from "../message_handler_interface"
import { TextMessage } from "../text_message_interface"

const detailedHelpRegex = /help ([\w\-\_]+)/

export class HelpHandler implements MatchingMessageHandler {
	handlers: MessageHandler[]

	name = "help"
	description = "lists the help info for all other handlers, try these:"
	help = ""

	constructor(handlers: MessageHandler[]) {
		this.handlers = handlers

		const helpfulHandlers = this.handlers.filter(
			handler => handler.name !== undefined && handler.help !== undefined
		)
		this.help = helpfulHandlers.map(handler => "help " + handler.name + "\n").join("")
	}

	matcher(message: string) {
		return (
			message === "help" ||
			message.match(detailedHelpRegex) !== null ||
			Object.keys(this.greetingsDict).indexOf(message) >= 0
		)
	}

	receive(message: string, event: TextMessage, reply: (text: string) => void) {
		const responses: string[] = this.greetingsDict[message]
		const detailedHelpMatch = message.match(detailedHelpRegex)
		if (message === "help") {
			reply("See the detailed help for each handler like this:\n " + this.help)
		} else if (detailedHelpMatch) {
			const handler = this.handlers.find(handler => handler.name === detailedHelpMatch[1])
			if (handler) {
				reply(handler.description + "\n" + handler.help)
			} else {
				reply(`I don't have any handlers with ${detailedHelpMatch[1]} for a name`)
			}
		} else if (responses) {
			reply(responses[Math.floor(Math.random() * responses.length)].replace("{user}", `<@${event.user}>`))
		}
	}

	receiveAll(
		message: string,
		event: TextMessage,
		wasHandled: boolean,
		startsWithTSBot: boolean,
		tsbotIsMentioned: boolean,
		reply: (text: string) => void,
		react: (text: string) => void
	) {
		if (message.indexOf("Damon") > -1) {
			react("tumbler_glass")
		}
		if (!wasHandled && startsWithTSBot) {
			if (startsWithTSBot) {
				reply(
					this.noHandlerDict[Math.floor(Math.random() * this.noHandlerDict.length)].replace(
						"{user}",
						`<@${event.user}>`
					)
				)
			}
		} else if (!wasHandled && tsbotIsMentioned) {
			react("eyes")
		}
	}

	greetingsDict: { [key: string]: string[] } = {
		hi: ["g'day {user}", "hi", "hola {user}", "yo yo yo", "hey... you"],
		hello: ["hello {user}, tsbot reporting for duty", "awaiting commands", "hello there {user}"]
	}

	noHandlerDict: string[] = [
		"{user} I have no idea what you're talking about",
		"{user} I got nothing. Maybe try saying help at me",
		"I don't understand, {user}"
	]
}
