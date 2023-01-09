import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string;
};
const env = process.env;
export default function hello(req: NextApiRequest, res: NextApiResponse<Data>) {
  res.status(200).json({
    name: `Hi, this are your envs: 
  
  DATABASE_URL=${env.DATABASE_URL},
  NEXTAUTH_SECRET=${env.NEXTAUTH_SECRET},
  NEXTAUTH_URL=${env.NEXTAUTH_URL},
  JWT_SECRET=${env.JWT_SECRET},
  STORAGE_SASTOKEN=${env.STORAGE_SASTOKEN},
  STORAGE_RESOURCE_NAME=${env.STORAGE_RESOURCE_NAME},
  NEXT_PUBLIC_WEB_URL=${env.NEXT_PUBLIC_WEB_URL},
  
  `,
  });
}
