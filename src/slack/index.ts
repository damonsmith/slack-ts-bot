import { RTMClient, WebClient } from "@slack/client"

export interface Topic {
    value: string
    creator: string
    last_set: number
}

export interface Purpose {
    value: string
    creator: string
    last_set: number
}

export interface Channel {
    id: string
    name: string
    is_channel: boolean
    is_group: boolean
    is_im: boolean
    created: number
    creator: string
    is_archived: boolean
    is_general: boolean
    unlinked: number
    name_normalized: string
    is_read_only: boolean
    is_shared: boolean
    is_ext_shared: boolean
    is_org_shared: boolean
    pending_shared: any[]
    is_pending_ext_shared: boolean
    is_member: boolean
    is_private: boolean
    is_mpim: boolean
    last_read: string
    topic: Topic
    purpose: Purpose
    previous_names: string[]
    num_members: number
    locale: string
}

export interface Latest {
    type: string
    user: string
    text: string
    ts: string
}

export interface IM {
    id: string
    created: number
    is_im: boolean
    is_org_shared: boolean
    user: string
    last_read: string
    latest: Latest
    unread_count: number
    unread_count_display: number
    is_open: boolean
    locale: string
    priority: number
}

export type Conversation = Channel | IM

export class Connection {
    public readonly rtm: RTMClient
    public readonly web: WebClient
    private convos: {[id: string]: Conversation} = {}

    constructor(slackToken: string) {
        this.rtm = new RTMClient(slackToken)
        this.web = new WebClient(slackToken)
    }

    public async getConversationWithId(id: string): Promise<Conversation | null> {
        let convo = this.convos[id]
        if (convo) {
            return convo
        }
        let resp = await this.web.conversations.info({channel: id})
        if (!resp.ok) {
            return null
        }
        convo = (resp as any).channel as Conversation
        this.convos[convo.id] = convo
        return convo
    }
}

