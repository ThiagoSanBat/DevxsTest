import { hash, compare } from 'bcryptjs';

const saltOrRounds = 10;

export const encrypt = async (textToEncrypt: string) => {
  return await hash(textToEncrypt, saltOrRounds);
};

export const deCrypt = async (textToDecrypt: any, hashToCompare: string) => {
  return await compare(textToDecrypt, hashToCompare);
};
