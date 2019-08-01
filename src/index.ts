import { config } from "../env"
import { HelpHandler } from "./handlers/help_handler"
import { MessageHandler, MatchingMessageHandler, CatchAllMessageHandler } from "./message_handler_interface"
import { PingHandler } from "./handlers/ping"
import { TextMessage } from "./text_message_interface"
import * as Slack from "./slack"

function isMatchingHandler(handler: MessageHandler): handler is MatchingMessageHandler {
	return (
		(handler as MatchingMessageHandler).matcher !== undefined &&
		(handler as MatchingMessageHandler).receive !== undefined
	)
}

function isCatchAllHandler(handler: MessageHandler): handler is CatchAllMessageHandler {
	return (handler as CatchAllMessageHandler).receiveAll !== undefined
}

async function main() {
	const authToken = config.slack_token

	const slack = new Slack.Connection(authToken)
	slack.rtm.start({})

	const handlers: MessageHandler[] = []

	// Here's where you register your new handler
	handlers.push(new PingHandler())
	// Always do the help one last though
	handlers.push(new HelpHandler(handlers))

	const matchingHandlers = handlers.filter(isMatchingHandler)
	const catchAllHandlers = handlers.filter(isCatchAllHandler)

	function generateReplyFunction(conversationId: string) {
		return (message: string) => {
			slack.rtm.sendMessage(message, conversationId).catch(console.error)
		}
	}

	function generateReactFunction(event: any) {
		return (reaction: string) => {
			slack.web.reactions.add({
				name: reaction,
				channel: event.channel,
				timestamp: event.event_ts
			})
		}
	}

	function generateSendTypingFunction(event: any) {
		return () => {
			slack.rtm.sendTyping(event.channel)
		}
	}

	slack.rtm.on("message", async (event: any) => {
		// Skip messages that are from a bot or my own user ID
		if (
			(event.subtype && event.subtype === "bot_message") ||
			(!event.subtype && event.user === slack.rtm.activeUserId)
		) {
			return
		}

		if (event.type !== "message") {
			return
		}

		const conversation = await slack.getConversationWithId(event.channel)
		if (conversation === null) {
			return
		}

		let wasHandled = false

		// If it's a mention of this bot uid or an IM:
		const startsWithTSBot = event.text && event.text.indexOf(slack.rtm.activeUserId) === 2
		const tsbotIsMentioned = event.text && event.text.indexOf(slack.rtm.activeUserId) > -1
		if (conversation.is_im || startsWithTSBot) {
			const text: string = startsWithTSBot ? event.text.substring(13) : event.text
			matchingHandlers.forEach(handler => {
				try {
					if (handler.matcher(text)) {
						wasHandled = true
						handler.receive(
							text,
							event,
							generateReplyFunction(event.channel),
							generateReactFunction(event),
							generateSendTypingFunction(event)
						)
					}
				} catch (e) {}
			})
		}

		if (event.text) {
			catchAllHandlers.forEach(handler => {
				try {
					handler.receiveAll(
						event.text,
						event,
						wasHandled,
						startsWithTSBot,
						tsbotIsMentioned,
						generateReplyFunction(event.channel),
						generateReactFunction(event),
						generateSendTypingFunction(event)
					)
				} catch (e) {}
			})
		}
	})
}

/* Why main()?
Because we have TypeScript strict enabled.
Code at the top level can't "return", which means you can't do things like:

	const thing: string | undefined
	if (thing === undefined) {
		return
	}

In a function, after that if statement, the type is known to not be undefined, due
to the "return".

TL;DR: trust me, we do this because typescript
*/
main()
