import nodemailer from 'nodemailer';
import { getEnvironmentVariable } from '../utils/Helper';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: getEnvironmentVariable('MAIL_EMAIL'),
    pass: getEnvironmentVariable('MAIL_PASSWORD'),
  },
});

export default transporter;
