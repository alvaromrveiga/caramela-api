// Which mail provider to use
const mailProviders = ["ethereal", "sendgrid"];
const MAIL_PROVIDER = mailProviders[0];

// Where to store the files
// currently has only local storage
const storageProviders = ["local"];
const STORAGE_PROVIDER = storageProviders[0];

export { MAIL_PROVIDER, STORAGE_PROVIDER };
