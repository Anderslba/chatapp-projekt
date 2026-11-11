import fs from 'fs/promises';
import User from '../models/userModel.js';

const usersFilePath = './database/users.json'

async function insertUser(user) {
    try {
        const users = await getUsers();
        users.push(user);
        await fs.writeFile(usersFilePath, JSON.stringify(users));
    } catch (err) {
        console.log(err);
    }
}

async function getUsers() {
    const userJSON = await fs.readFile(usersFilePath);
    const usersData = JSON.parse(userJSON);
    const users = usersData.map((u) => {
        return new User(u.userid, u.username, u.password, u.creationData, u.level)
    })

    return users;
}

async function getUserByUsername(username) {
    const users = await getUsers();
    const user = users.find(user => user.username == username);

    return user;
}

export { insertUser, getUsers, getUserByUsername }