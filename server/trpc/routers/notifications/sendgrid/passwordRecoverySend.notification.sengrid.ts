import sgMail from '@sendgrid/mail';
export const sendPasswordRecoveryLinkOnSengrid = async ({
  email,
  displayName,
  link,
}: {
  email: string;
  displayName: string;
  link: string;
}) => {
  const sendgridKey = process.env.SENDGRID_API_KEY;
  const sengridFrom = process.env.SENDGRID_FROM;

  if (!sendgridKey || !sengridFrom) return;
  sgMail.setApiKey(sendgridKey);

  const msg = {
    to: email, // Change to your recipient
    from: sengridFrom, // Change to your verified sender
    subject: `${displayName} resetea tu password.`,
    // text: 'and easy to do anywhere, even with Node.js',
    html: `<div>Hemos recibido una solicitud para resetear su password a este correo. <br />
    <br />
    Si no has sido tu favor ignora este correo.
    <br />
    <br />

    De lo contrario puedes resetear tu passord ingresando en este <a href="${link}" target="_blank">link</a>  <br />
   
    </div>`,
  };
  await sgMail.send(msg);
  return msg;
};
