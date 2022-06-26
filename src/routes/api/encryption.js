import CryptoJS from 'crypto-js';

export function Encrypt(pass, key) {
    const encJson = CryptoJS.AES.encrypt(JSON.stringify(pass), key).toString();
    let encData = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encJson))
    return encData;
};

export function Decrypt(pass, key) {
    const decData = CryptoJS.enc.Base64.parse(pass).toString(CryptoJS.enc.Utf8);
    const bytes = CryptoJS.AES.decrypt(decData, key).toString(CryptoJS.enc.Utf8);
    return JSON.parse(bytes);
};