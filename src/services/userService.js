import fs from 'fs/promises';
import User from '../models/userModel.js';
import { generateKeyPair } from './cryptoService.js';

const usersDirPath = './database/users/';

function userDir(userid) {
    return usersDirPath + userid + '/';
}

function userFile(userid) {
    return userDir(userid) + `${userid}.json`;
}

async function insertUser(user) {
    // split userid fra andet userdata for at undgå at gemme id 2 gange
    // id gemmes som filnavn
    const { userid, ...userdata } = user;
    const { publicKey, privateKey } = generateKeyPair();

    await fs.mkdir(userDir(userid), { recursive: true });
    await fs.writeFile(userFile(userid), JSON.stringify(userdata));

    await fs.writeFile(userDir(userid) + '/public.pem', publicKey);
    await fs.writeFile(userDir(userid) + '/private.pem', privateKey);

    return user;
}

async function getUsers() {
    await fs.mkdir(usersDirPath, { recursive: true });

    const folders = await fs.readdir(usersDirPath);
    const users = [];

    for (const folder of folders) {
        const user = await getUserById(folder);
        if (user) users.push(user);
    }

    return users;
}

async function getUserByUsername(username) {
    const users = await getUsers();
    return users.find(user => user.username == username);
}

async function getUserById(userid) {
    try {
        const userJSON = await fs.readFile(userFile(userid));
        const user = JSON.parse(userJSON);
        return new User(userid, user.username, user.password, user.creationDate, user.level);
    } catch (err) {
        console.log(err)
    }
}

async function deleteUser(userid) {
    try {
        await fs.rm(userDir(userid), { recursive: true });
    } catch (err) {
        console.log(err)
    }
}

async function getPrivateKey(userid) {
    try {
        return await fs.readFile(userDir(userid) + 'private.pem');
    } catch (err) {
        console.log(err)
    }
}

async function getPublicKey(userid) {
    try {
        return await fs.readFile(userDir(userid) + 'public.pem');
    } catch (err) {
        console.log(err)
    }
}

export { insertUser, getUsers, getUserByUsername, getUserById, deleteUser, getPrivateKey, getPublicKey };