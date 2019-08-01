export interface TextMessage {
	type: string,
	user: string,
	text: string,
	client_msg_id: string,
	team: string,
	channel: string,
	event_ts: string,
	ts: string
}