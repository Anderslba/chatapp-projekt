import fs from 'fs/promises';

const userPath = './../database/users/'

async function insertUser(user) {
    try {
        await fs.writeFile(`${userPath}/${user.id}.json`, JSON.stringify(user));
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function getUsers() {
    let documents = await fs.readdir(userPath);

    let users = documents.map(async (doc) => {
        return await convertFileToUser(doc);
    })

    return users;
}

async function convertFileToUser(filepath) {
    try {
        const userJSON = await fs.readFile(filepath, { encoding: 'utf8' });
        const data = JSON.parse(userJSON);
        return new User(data.userid, data.username, data.password, data.creationData, userData.userLevel);
    } catch (err) {
        console.log(err);
    }
}

export { insertUser }