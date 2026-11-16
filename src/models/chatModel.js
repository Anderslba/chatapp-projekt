export class ChatMessage {
    constructor({ id = null, sender, text, room = 'general', timestamp = Date.now() }) {
        if (!sender || !text) {
            throw new Error('Både afsender (sender) og besked (text) er påkrævet.');
        }

        this.id = id;
        this.sender = sender;
        this.text = text;
        this.room = room;
        this.timestamp = timestamp;
    }

    // Konverterer objektet til et rent JSON-objekt uden 'id' (da Firebase genererer nøglen)
    toFirebaseObject() {
        return {
            sender: this.sender,
            text: this.text,
            room: this.room,
            timestamp: this.timestamp
        };
    }
}