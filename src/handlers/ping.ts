import { MatchingMessageHandler } from "../message_handler_interface"
import { TextMessage } from "../text_message_interface"
const ccgen = require("creditcard-generator")

export class PingHandler implements MatchingMessageHandler {
	name = "ping"
	description = "replies pong"
	help = "ping - replies with pong"

	matcher(message: string) {
		return message.trim().indexOf("ping") === 0
	}

	receive(message: string, event: TextMessage, reply: (text: string) => void, react: (text: string) => void) {
		react("tabletennis")
	}
}