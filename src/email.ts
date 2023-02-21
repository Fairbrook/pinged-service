import FormData from 'form-data';
import Mailgun from 'mailgun.js';
import { ApplicationHealthDetailed } from 'nodejs-health-checker/dist/interfaces/types.js';

const mailgun = new Mailgun.default(FormData);
const mgClient = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY
});

export async function sendEmail (health: ApplicationHealthDetailed) {
  return mgClient.messages.create(process.env.MAILGUN_DOMAIN, {
    from: 'Pinged <pinged@samples.mailgon.org>',
    to: [process.env.ADMIN_EMAIL],
    subject: `Parece que el servidor ${health.name} está fuera de servicio`,
    html: `<div>\
    <h2>Integraciones</h2>
${health.integrations.map(
  (integration) => `<div>\
<b>${integration.name}: </b>${
    integration.status
      ? '<span style="color:#72ba32;">Ok</span>'
      : `<span style="color:#a8323a;">${integration.error?.name}</span>`
  }
</div>`
)}
</div>`
  });
}
