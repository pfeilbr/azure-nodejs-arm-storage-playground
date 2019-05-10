require("dotenv").config();

const msRestAzure = require("ms-rest-azure");
const storageManagementClient = require("azure-arm-storage");

// get via `az account list`
const subscriptionId = process.env.subscriptionId;

const run = async () => {
  const credentials = await msRestAzure.loginWithServicePrincipalSecret(
    process.env.clientId,
    process.env.secret,
    process.env.domain
  );

  const client = new storageManagementClient(credentials, subscriptionId);
  const accounts = await client.storageAccounts.list();
  console.dir(accounts, { depth: null, colors: true });
};

run();
