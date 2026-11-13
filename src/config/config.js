import { initializeApp } from 'firebase/app';
import { getFirestore  }  from 'firebase/firestore'
import fs from 'fs/promises'

async function readFirebaseConfigFile() {
    try {
        const data = await fs.readFile('.././firebaseConfig.json',{ encoding: 'utf8' });
        return JSON.parse(data)
    } catch (err) {
        console.log(err);
    }
}

async function readSessionConfigFile() {
    try {
        const data = await fs.readFile('.././sessionConfig.json',{ encoding: 'utf8' });
        return JSON.parse(data)
    } catch (err) {
        console.log(err);
    }
}

// Initialize Firebase
const fbapp = initializeApp(await readFirebaseConfigFile());
const dbRef = getFirestore(fbapp);
const sessionConfig = await readSessionConfigFile();

export { dbRef, sessionConfig }