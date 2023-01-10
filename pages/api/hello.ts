import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string;
};

export default function hello(req: NextApiRequest, res: NextApiResponse<Data>) {
  res
    .status(200)
    .json({
      name: `Hi, nextauth url = ${process.env.NEXTAUTH_URL}, and web url = ${process.env.NEXT_PUBLIC_WEB_URL}`,
    });
}
