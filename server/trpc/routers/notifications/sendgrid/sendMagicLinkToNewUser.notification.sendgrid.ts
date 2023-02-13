import type { Account, AccountVerificationLinks } from '@prisma/client';
import sgMail from '@sendgrid/mail';
export const sendMagicLinkToNewUserSendgridNotification = async ({
  newUser,
  link,
}: {
  newUser: Account & {
    accountVerificationLinks: AccountVerificationLinks[];
    organizations: {
      displayName: string;
    }[];
  };
  link: string;
}) => {
  const sendgridKey = process.env.SENDGRID_API_KEY;
  const sengridFrom = process.env.SENDGRID_FROM;

  if (!sendgridKey || !sengridFrom) return;
  sgMail.setApiKey(sendgridKey);

  const msg = {
    to: newUser.email,
    from: sengridFrom,
    subject: `${newUser.displayName} has sido invitado para ser parte de ${newUser.organizations[0]?.displayName}.`,
    html: `<div>Un usuario te ha invitado para ser parte de la organización ${newUser.organizations[0]?.displayName}. <br />
    <br />
    Favor verifique su cuenta a través del siguiente link: <a href="${link}" target="_blank">link</a>  <br />
   
    </div>`,
  };

  await sgMail.send(msg);
};
