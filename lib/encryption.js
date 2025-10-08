import CryptoJS from 'crypto-js';


const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

export const encryptPassword = (password) => {
  return CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
};

export const decryptPassword = (encryptedPassword) => {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};