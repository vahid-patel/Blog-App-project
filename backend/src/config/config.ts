import * as dotenv from 'dotenv';
dotenv.config();

export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET_KEY || 'default_secret',
  },
  database: {
    uri: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/nest_app',
  },
  Brevo : {
    BREVO_USER : process.env.BREVO_USER,
    BREVO_PASS : process.env.BREVO_PASS,
    BREVO_HOST : process.env.BREVO_HOST,
    BREVO_PORT : process.env.BREVO_PORT,
    sender_email : process.env.sender_email
  }
});
