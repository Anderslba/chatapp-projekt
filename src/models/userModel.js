class User {
    constructor(userId, username, password, creationDate, level) {
        this.userId = userId;
        this.username = username;
        this.password = password;
        this.creationDate = creationDate;
        this.level = level;
    }

    userWithoutPassword() {
        const { password, ...rest } = this;
        return rest;
    }
}

export default User