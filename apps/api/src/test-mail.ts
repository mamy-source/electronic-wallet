
import 'dotenv/config';

import { sendEmail, verifyMailerConnection } from './libs/mailer.lib.js';

const main = async (): Promise<void> => {
  const connected = await verifyMailerConnection();

  if (!connected) {
    throw new Error('SMTP connection failed');
  }

  await sendEmail({
    to: 'test@example.com',
    subject: 'Electronic Wallet - Test SMTP',
    text: 'MailHog fonctionne correctement !',
    html: '<h2>MailHog fonctionne correctement !</h2>',
  });

  console.log('Email envoyé à MailHog');
};

main().catch((error: unknown) => {
  console.error('Mail test failed:', error);
  process.exitCode = 1;
});