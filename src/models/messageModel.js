class Message {
    constructor(message, creationDate, senderId, chat, id) {
        this.message = message;
        this.creationDate = creationDate;
        this.senderId = senderId;
        this.chat = chat;
        this.id = id;
    }
}

export default Message;