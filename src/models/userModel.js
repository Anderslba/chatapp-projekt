class User {
    constructor(userid, username, password, creationDate, level) {
        this.userid = userid;
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