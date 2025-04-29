import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
  try {
    const hashedPassword = (await bcrypt.hash(password, saltRounds)) as string;
    return hashedPassword;
  } catch (error) {
    throw new Error('Error hashing password');
  }
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  try {
    const isMatch: boolean = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};
