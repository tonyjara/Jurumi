import jwt from 'jsonwebtoken';

export const makeSignedToken = (
  email: string,
  displayName: string,
  uuid: string,
  secret: string
) =>
  jwt.sign(
    {
      data: {
        email,
        displayName,
        linkId: uuid,
      },
    },
    secret,
    { expiresIn: 60 * 60 }
  );
