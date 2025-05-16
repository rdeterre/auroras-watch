import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import nodemailer from "nodemailer";
import { noaa_parse_27_day_outlook } from './auroras';

const config = {
  region: "us-east-1",
};

const client = new SSMClient(config);

export const handler = async (
  event: any,
): Promise<string> => {
  // Retrieve SMTP credentials from Parameter Store
  const smtpPassResponse = await client.send(new GetParameterCommand({
    Name: "icloud_smtp_pass",
    WithDecryption: true,
  }));
  const smtpPass = smtpPassResponse.Parameter?.Value;

  // Fetch and parse the NOAA 27-day outlook
  const response = await fetch('https://services.swpc.noaa.gov/text/27-day-outlook.txt');
  const data = await response.text();
  const outlookContent = noaa_parse_27_day_outlook(data);

  // Create a transporter object
  const transporter = nodemailer.createTransport({
    host: 'smtp.mail.me.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'romain.deterre@me.com',
      pass: smtpPass,
    },
  });

  // Email options
  const mailOptions = {
    from: 'romain@auroras.watch',
    to: 'romain.deterre@gmail.com',
    subject: 'Subject of the email',
    text: `Upcoming forecast: \n\n${outlookContent}`,
  };

  // Send email
  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent: ' + info.response);
  return 'success';
};
