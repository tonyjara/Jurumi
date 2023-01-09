import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string;
};
const env = process.env;

export default function hello(req: NextApiRequest, res: NextApiResponse<Data>) {
  res.status(200).json({
    name: `Hi, this are your envs: 
  
  DATABASE_URL=${env.APPSETTING_DATABASE_URL},
  NEXTAUTH_SECRET=${env.APPSETTING_NEXTAUTH_SECRET},
  NEXTAUTH_URL=${env.APPSETTING_NEXTAUTH_URL},
  JWT_SECRET=${env.APPSETTING_JWT_SECRET},
  STORAGE_SASTOKEN=${env.APPSETTING_STORAGE_SASTOKEN},
  STORAGE_RESOURCE_NAME=${env.APPSETTING_STORAGE_RESOURCE_NAME},
  NEXT_PUBLIC_WEB_URL=${env.APPSETTING_NEXT_PUBLIC_WEB_URL},
  
  `,
  });
}
