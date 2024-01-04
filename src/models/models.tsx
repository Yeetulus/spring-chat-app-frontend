
export interface ChatRoom {
    id: number;
    exchange: string;
    chatName: string;
    owner: ChatUser;
    userQueues: ChatUsers[];
}
export interface ChatObject {
    chat: ChatRoom;
    queues: string[];
    messages: DisplayedMessage[];
    seen: boolean
}
export interface ChatUser{
    id: number,
    email: string,
    firstName: string,
    lastName: string
}
export interface ChatUsers {
    id: number;
    user: ChatUser;
    queue: string;
}

export interface ChatMessage {
    type: string;
    chatId: number;
    content: string;
    senderId: number;
}

export interface DisplayedMessage {
    type: string;
    content: string;
    sender: ChatUser;
}