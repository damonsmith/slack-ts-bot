import { TextMessage } from "./text_message_interface"

export interface MessageHandlerBase {
	name: string
	description: string
	help?: string
}

/** Receives messages that specifically mention the bot, and match the specified matcher */
export interface MatchingMessageHandler extends MessageHandlerBase {
	matcher(message: string): boolean
	receive(
		message: string,
		event: TextMessage,
		reply: (text: string) => void,
		react?: (type: string) => void,
		sendTyping?: () => void
	): void
}

/** Receives all messages. It's the handler's responsibility to filter out mentions. */
export interface CatchAllMessageHandler extends MessageHandlerBase {
	receiveAll(
		message: string,
		event: TextMessage,
		wasHandled: boolean,
		startsWithTSBot: boolean,
		tsbotIsMentioned: boolean,
		reply: (text: string) => void,
		react?: (type: string) => void,
		sendTyping?: () => void
	): void
}

export type MessageHandler = MatchingMessageHandler | CatchAllMessageHandler
