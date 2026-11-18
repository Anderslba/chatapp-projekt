import crypto from 'crypto';
import { getPublicKey, getPrivateKey } from './userService.js'

function generateKeyPair() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
    });

    return { publicKey, privateKey };
}

async function encryptMessage(text, ownerId) {
    const publicKey = await getPublicKey(ownerId);
    return crypto.publicEncrypt(publicKey, Buffer.from(text)).toString('base64');
}

async function decryptMessage(encrypted, ownerId) {
    const privateKey = await getPrivateKey(ownerId);
    return crypto.privateDecrypt(privateKey, Buffer.from(encrypted, 'base64')).toString('utf8');
}

export { encryptMessage, decryptMessage, generateKeyPair };