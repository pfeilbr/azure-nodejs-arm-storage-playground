require("dotenv").config();

const msRestAzure = require("ms-rest-azure");
const { ResourceManagementClient } = require("azure-arm-resource");
const { StorageManagementClient } = require("azure-arm-storage");

// global.  its ok ... just for learning :)
let credentials;

// get via `az account list`
const subscriptionId = process.env.subscriptionId;

const log = s => {
  const outputString = typeof s === "string" ? s : JSON.stringify(s, null, 2);
  console.log(outputString);
};

const generateRandomId = prefix => {
  const self = generateRandomId;
  self.exsitIds = self.exsitIds || {};
  var randomId;
  while (true) {
    randomId = prefix + Math.floor(Math.random() * 10000);
    if (!self.exsitIds || !(randomId in self.exsitIds)) {
      break;
    }
  }
  self.exsitIds[randomId] = true;
  return randomId;
};

const getCredentials = async () => {
  const credentials = await msRestAzure.loginWithServicePrincipalSecret(
    process.env.clientId,
    process.env.secret,
    process.env.domain
  );
  return credentials;
};

const setCredentials = async () => {
  credentials = await getCredentials();
};

const resourceGroupExists = async resourceGroupName => {
  const client = new ResourceManagementClient(credentials, subscriptionId);
  const exists = await client.resourceGroups.checkExistence(resourceGroupName);
  return exists;
};

const checkIfResourceGroupExists = async () => {
  const resourceGroupName = `cloud-shell-storage-eastus`;
  const exists = await resourceGroupExists(resourceGroupName);
  log(`resource group "${resourceGroupName}" exists: ${exists}`);
};

const listStorageAccounts = async () => {
  const client = new StorageManagementClient(credentials, subscriptionId);
  const accounts = await client.storageAccounts.list();
  log(accounts);
};

const createStorageAccount = async (resourceGroupName, accountName) => {
  const client = new StorageManagementClient(credentials, subscriptionId);
  const resp = await client.storageAccounts.create(
    resourceGroupName,
    accountName,
    { sku: { name: "Standard_LRS" }, kind: "StorageV2", location: "eastus" }
  );
  return resp;
};

const createResourceGroup = async (
  name = "my-test-resource-group-01",
  location = "eastus"
) => {
  const client = new ResourceManagementClient(credentials, subscriptionId);
  const resp = await client.resourceGroups.createOrUpdate(name, {
    location
  });
  return resp;
};

const deleteResourceGroup = async name => {
  const client = new ResourceManagementClient(credentials, subscriptionId);
  const resp = await client.resourceGroups.deleteMethod(name);
  return resp;
};

const run = async () => {
  await setCredentials();
  const resourceGroupName = generateRandomId("auto");
  log(`resourceGroupName=${resourceGroupName}`);
  await resourceGroupExists(resourceGroupName);
  await createResourceGroup(resourceGroupName);

  const storageAccountName = generateRandomId("auto");
  await createStorageAccount(resourceGroupName, storageAccountName);

  await deleteResourceGroup(resourceGroupName);
};

run();
