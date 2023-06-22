import prisma from "@/server/db/client";
import type { MoneyRequest } from "@prisma/client";
import sgMail from "@sendgrid/mail";
export const moneyRequestCreatedApproversEmailNotification = async ({
  input,
}: {
  input: MoneyRequest & {
    account: {
      displayName: string;
    };
  };
}) => {
  try {
    const org = await prisma?.organization.findUniqueOrThrow({
      where: { id: input.organizationId },
      select: {
        displayName: true,
        moneyRequestApprovers: {
          select: {
            id: true,
            email: true,
            displayName: true,
            preferences: true,
          },
        },
      },
    });
    if (!org.moneyRequestApprovers.length) return;

    const sendgridKey = process.env.SENDGRID_API_KEY;
    const sengridFrom = process.env.SENDGRID_FROM;
    if (!sendgridKey.length || !sengridFrom.length) return;

    for (const approver of org.moneyRequestApprovers) {
      if (!approver.preferences?.receiveEmailNotifications) continue;

      sgMail.setApiKey(sendgridKey);
      const msg = {
        to: approver.email, // Change to your recipient
        from: sengridFrom, // Change to your verified sender
        subject: `${input.account.displayName} ha creado una solicitud.`,
        // text: 'and easy to do anywhere, even with Node.js',
        html: `<div>Has recibido el siguiente correo por ser aprobador de solicitudes en la organización ${org.displayName}. El usuario ${input.account.displayName} ha creado una solicitud que requiere de su aprobación. Favor visite el siguiente link para ver la solicitud <a href="${process.env.NEXT_PUBLIC_WEB_URL}/mod/approvals" target={"_blank"} rel="noreferrer">Aprobaciones</a>  <br />
        <strong>Para deshabilitar los correos favor entrar en configuración / preferencias.</strong>
        </div>`,
      };
      await sgMail.send(msg);
    }
  } catch (error) {
    console.error(error);
  }
};
