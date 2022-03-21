import * as sendgrid from "@sendgrid/mail";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const client = require("@sendgrid/client");

const SENDGRID_API_KEY: string = process.env.SENDGRID_API_KEY!;
// console.log(SENDGRID_API_KEY)
sendgrid.setApiKey(SENDGRID_API_KEY);
client.setApiKey(SENDGRID_API_KEY);


// Add email to SendGrid list and send welcome email
const addEmailToList = async (email: string) => {
  try {
    const data = {
      contacts: [
        {
          email: email,
          // first_name: "First Name",
          // last_name: "Last Name",
        },
      ],
    };
    const request = {
      url: "/v3/marketing/contacts",
      method: "PUT",
      body: data,
    };
    return client.request(request);
  } catch (err) {
    let message;
    if (err instanceof Error) message = err.message;
    throw message;
  }
};

// Send welcome email
const emailSender = "info@sui.io";
const emailTemplateId = "d-746d506a0a3e4c6f9e6b595bd0ab9381";
export const sendEmail = async (email: string): Promise<any> => {
  try {
    if (!email) {
      throw new Error("No email provided");
    }
    const emailRequest = {
      templateId: emailTemplateId,
      subject: "Thanks for joining the SUi community!",
      from: emailSender,
      to: email,
    };
    return sendgrid.send(emailRequest);
  } catch (err) {
    let message;
    if (err instanceof Error) message = err.message;
    throw message;
  }
};

export const subscribeToSui = async (request: any, response: any) => {
  try {
    if (request.method !== "POST") {
      throw new Error("This request is not allowed");
    }
    const email = request.body.email;
    if (!email) {
      throw new Error("No email provided");
    }

    // / add email to SendGrid Contact List
    await addEmailToList(email);
    // / send welcome email
    await sendEmail(email);
    response.status(200).send("done");
  } catch (err) {
    let message;
    if (err instanceof Error) message = err.message;
    response.status(400).send(message);
  }
};
