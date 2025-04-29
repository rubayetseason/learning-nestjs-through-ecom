import { sign } from 'jsonwebtoken';

export const signJwt = (payload: object, secret: string, expiresIn: string) => {
  return sign(payload, secret, { expiresIn });
};
