// import { ApiClient, EmailsApi, EmailMessageData, EmailRecipient, BodyPart } from '@elasticemail/elasticemail-client';
// import "dotenv/config"
// const {ELASTICEMAIL_API_KEY, ELASTICEMAIL_FROM} = process.env
// const defaultClient = ApiClient.instance;
 
// const {apikey} = defaultClient.authentications;
// apikey.apiKey = ELASTICEMAIL_API_KEY
 
// const api = new EmailsApi()
 
// let email = EmailMessageData.constructFromObject({
//   Recipients: [
//     new EmailRecipient("finexol204@lucvu.com")
//   ],
//   Content: {
//     Body: [
//       BodyPart.constructFromObject({
//         ContentType: "HTML",
//         Content: "<strong>Test Email</strong>"
//       })
//     ],
//     Subject: "Test Email",
//     From: ELASTICEMAIL_FROM
//   }
// });
 
// const callback = function(error, data, response) {
//   if (error) {
//     console.error(error);
//   } else {
//     console.log('API called successfully.');
//   }
// };
// api.emailsPost(email, callback);
