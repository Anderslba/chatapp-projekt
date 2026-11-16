class Message {
    constructor(message, creationDate, owner, chat, id) {
        this.message = message;
        this.creationDate = creationDate;
        this.owner = owner;
        this.chat = chat;
        this.id = id;
    }
}

export default Message;