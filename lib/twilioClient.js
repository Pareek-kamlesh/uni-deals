// lib/twilioClient.js
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !twilioPhoneNumber) {
  throw new Error('Please define all necessary Twilio environment variables inside .env.local');
}

export const twilioClient = twilio(accountSid, authToken);
export const twilioFrom = twilioPhoneNumber;