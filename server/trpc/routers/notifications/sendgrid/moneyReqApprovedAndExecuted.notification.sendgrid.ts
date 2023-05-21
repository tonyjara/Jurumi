import type { MoneyRequest } from "@prisma/client";
import sgMail from "@sendgrid/mail";
export const moneyRequestApprovedSendgridNotification = async ({
  input,
}: {
  input: MoneyRequest & {
    account: {
      email: string;
      displayName: string;
      preferences: {
        receiveEmailNotifications: boolean;
      } | null;
    };
  };
}) => {
  try {
    if (!input.account.preferences?.receiveEmailNotifications) return;
    const sendgridKey = process.env.SENDGRID_API_KEY;
    const sengridFrom = process.env.SENDGRID_FROM;

    if (!sendgridKey.length || !sengridFrom.length) return;
    sgMail.setApiKey(sendgridKey);
    const msg = {
      to: input.account.email, // Change to your recipient
      from: sengridFrom, // Change to your verified sender
      subject: `${input.account.displayName} su solicitud de fondos ha sido aprobada.`,
      // text: 'and easy to do anywhere, even with Node.js',
      html: `<div>Visite el siguiente link para ver sus solicitudes <a>${process.env.NEXT_PUBLIC_WEB_URL}/home/requests</a>  <br />
<strong>Para deshabilitar los correos favor entrar en configuración / preferencias.</strong>
</div>`,
    };
    await sgMail.send(msg);
    return msg;
  } catch (error) {
    console.error(error);
  }
};
