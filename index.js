require("dotenv").config();

const msRestAzure = require("ms-rest-azure");
const { ResourceManagementClient } = require("azure-arm-resource");
const { StorageManagementClient } = require("azure-arm-storage");

// get via `az account list`
const subscriptionId = process.env.subscriptionId;

const run = async () => {
  const credentials = await msRestAzure.loginWithServicePrincipalSecret(
    process.env.clientId,
    process.env.secret,
    process.env.domain
  );

  const client = new StorageManagementClient(credentials, subscriptionId);

  // create resource group
  const resourceManagementClient = new ResourceManagementClient(
    credentials,
    subscriptionId
  );
  const exists = await resourceManagementClient.resourceGroups.checkExistence(
    /* "cloud-shell-storage-eastus" */
    "app"
  );

  const createResp = await resourceManagementClient.resourceGroups.createOrUpdate(
    "my-test-group-01",
    { location: "eastus" }
  );

  console.dir(createResp);

  // create storage account
  //client.storageAccounts.create()

  const accounts = await client.storageAccounts.list();

  //console.dir(accounts, { depth: null, colors: true });
};

run();
