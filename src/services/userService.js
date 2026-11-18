import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/userModel.js';
import { generateKeyPair } from './cryptoService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const usersDirPath = path.join(__dirname, '../database/users');

function userDir(userId) {
    return path.join(usersDirPath, userId);
}

function userFile(userId) {
    return path.join(userDir(userId), `${userId}.json`);
}

async function insertUser(user) {
    // split userId fra andet userdata for at undgå at gemme id 2 gange
    // id gemmes som filnavn
    const { userId, ...userdata } = user;
    const { publicKey, privateKey } = generateKeyPair();

    await fs.mkdir(userDir(userId), { recursive: true });
    await fs.writeFile(userFile(userId), JSON.stringify(userdata));

    await fs.writeFile(userDir(userId) + '/public.pem', publicKey);
    await fs.writeFile(userDir(userId) + '/private.pem', privateKey);

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

async function getUserById(userId) {
    try {
        const userJSON = await fs.readFile(userFile(userId));
        const user = JSON.parse(userJSON);
        return new User(userId, user.username, user.password, user.creationDate, user.level);
    } catch (err) {
        return null;
    }
}

async function deleteUser(userId) {
    try {
        await fs.rm(userDir(userId), { recursive: true });
    } catch (err) {
        console.log(err)
    }
}

async function getPrivateKey(userId) {
    return await fs.readFile(path.join(userDir(userId), 'private.pem'));
}

async function getPublicKey(userId) {
    return await fs.readFile(path.join(userDir(userId), 'public.pem'));
}

export { insertUser, getUsers, getUserByUsername, getUserById, deleteUser, getPrivateKey, getPublicKey };