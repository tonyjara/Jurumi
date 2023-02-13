import prisma from '@/server/db/client';
export const saveEmailMsgToDb = async ({
  msg,
  tag,
  accountId,
}: {
  msg: {
    to: string;
    from: string;
    subject: string;
    html: string;
  };
  tag: string;
  accountId: string | null;
}) => {
  await prisma.emails.create({
    data: {
      to: msg.to,
      from: msg.from,
      subject: msg.subject,
      html: msg.html,
      tag,
      accountId,
    },
  });
};
