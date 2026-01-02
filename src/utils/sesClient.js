// const { SESClient } = require("@aws-sdk/client-ses");
// // Set the AWS Region.
// const REGION =  "ap-south-1";
// // Create SES service object.
// const sesClient = new SESClient({ region: REGION, credentials:{
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// },
//  });
// module.exports = { sesClient };

const { SESClient } = require("@aws-sdk/client-ses");


const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

module.exports = { sesClient };
