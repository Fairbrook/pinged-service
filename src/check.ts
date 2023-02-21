import { HealthcheckerDetailedCheck } from 'nodejs-health-checker/dist/healthchecker/healthchecker.js';
import {
  HealthTypes,
  Dialects
} from 'nodejs-health-checker/dist/interfaces/types.js';
import { sendEmail } from './email.js';

export async function healthCheck () {
  return HealthcheckerDetailedCheck({
    name: 'La Nube méxico',
    version: '1.0',
    integrations: [
      {
        type: HealthTypes.Web,
        name: 'Web',
        host: process.env.WEB_URL
      },
      {
        type: HealthTypes.Database,
        name: 'MySQL Database',
        host: process.env.DATABASE_HOST,
        dbPort: parseInt(process.env.DATABASE_PORT),
        dbName: process.env.DATABASE_NAME,
        dbUser: process.env.DATABASE_USER,
        dbPwd: process.env.DATABASE_PASSWORD,
        dbDialect: Dialects.mysql
      }
    ]
  });
}

export async function cronCheck () {
  console.info('Checking');
  const check = await healthCheck();
  if (check.status) return;
  await sendEmail(check);
}
