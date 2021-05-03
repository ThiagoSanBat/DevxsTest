import * as bcrypt from 'bcrypt';

const saltOrRounds = 10;

export const encrypt = async (textToEncrypt: string) => {
  return await bcrypt.hash(textToEncrypt, saltOrRounds);
};

export const deCrypt = async (textToDecrypt: any, hashToCompare: string) => {
  return await bcrypt.compare(textToDecrypt, hashToCompare);
};
