import { MatchingMessageHandler } from "../message_handler_interface"
import { TextMessage } from "../text_message_interface"
import fetch from "node-fetch"

export class StatusHandler implements MatchingMessageHandler {
	name = "status"
	description = "info about TSBot's mental state"
	help = "status"

	matcher(message: string) {
		return message === "status"
	}

	async receive(message: string, event: TextMessage, reply: (text: string) => void, react: (text: string) => void, sendTyping: () => void) {
		sendTyping()
		reply("not implemented yet")
	}
}
