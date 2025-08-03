import * as dotenv from 'dotenv';
dotenv.config();

export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET_KEY || 'default_secret',
  },
  database: {
    uri: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/nest_app',
  },
});
