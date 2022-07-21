const environment = {
  API_URL: process.env.REACT_APP_API_URL,
  SELF_URL: process.env.REACT_APP_SELF_URL,
  CRISTIANDI_PHONE_NUMBER: process.env.REACT_APP_CRISTIANDI_PHONE_NUMBER,
  DELAY_TIME: 1000,
  /* FIREBASE */
  FIREBASE_API_KEY: process.env.REACT_APP_FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID:
    process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID: process.env.REACT_APP_FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  /* EPAYCO */
  EPAYCO_PUBLIC_KEY: process.env.REACT_APP_EPAYCO_PUBLIC_KEY,
  EPAYCO_TESTING: process.env.REACT_APP_EPAYCO_TESTING === "1",
};

export default environment;
