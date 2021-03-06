import * as uuidv1 from 'uuid/v1';

const envType = (process.env.NODE_ENV || 'dev') as 'dev' | 'prod' | 'stage' | 'test';
const appName = 'rso-auth';

export const environment = {
  appName,
  envType,
  appId: `${ appName }-${ uuidv1() }`,

  jwtSecret: process.env.JWT_SECRET,

  port: + (process.env.PORT || 3000),

  deployVersion: process.env.DEPLOY_VERSION || 'unknown',

  consul: {
    host: process.env.CONSUL_HOST || `consul`
  },

  loggly: {
    token    : process.env.LOGZIO_TOKEN,
    subdomain: 'tilentomakic',
    tags     : ['Winston-NodeJS'],
    json     : true
  },

  mongo: process.env.MONGO_HOST
};

console.log('Used env', environment);
