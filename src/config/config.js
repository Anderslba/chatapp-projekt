import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import fs from 'fs/promises';

// Læs Firebase config
async function readFirebaseConfigFile() {
    const data = await fs.readFile(
        './../firebaseConfig.json',
        'utf8'
    );
    return JSON.parse(data);
}

// Læs session config
async function readSessionConfigFile() {
    const data = await fs.readFile(
        './../sessionConfig.json',
        'utf8'
    );
    return JSON.parse(data);
}

// Initialiser Firebase
const firebaseConfig = await readFirebaseConfigFile();

const fbapp = initializeApp(firebaseConfig);
const dbRef = getFirestore(fbapp);

const sessionConfig = await readSessionConfigFile();

export { dbRef, sessionConfig };