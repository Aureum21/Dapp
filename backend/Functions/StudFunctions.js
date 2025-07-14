const Web3 = require("web3");
const path = require("path");
const fs = require("fs-extra");
const Web3Quorum = require("web3js-quorum");
const chainId = 1337;
const { besu, tessera, contractInformations } = require("../Files/keys");
const createContract = require("../Files/main");
const contractJsonRegStudPath = path.resolve(
  __dirname,
  "../Files",
  "registerStud.json"
);
const contractJsonRegStud = JSON.parse(
  fs.readFileSync(contractJsonRegStudPath)
);
const contractAbiRegStud = contractJsonRegStud.abi;
const contractJsonStudentPath = path.resolve(
  __dirname,
  "../Files",
  "student.json"
);
const contractJsonStudent = JSON.parse(
  fs.readFileSync(contractJsonStudentPath)
);
const contractAbiStudent = contractJsonStudent.abi;

// Public Data
const contractJsonPublicDataPath = path.resolve(
  __dirname,
  "../Files",
  "publicdata.json"
);

const contractJsonPublicData = JSON.parse(
  fs.readFileSync(contractJsonPublicDataPath)
);

const contractAbiPublicData = contractJsonPublicData.abi;

// Verify Stud contract
const contractJsonVerifyStudPath = path.resolve(
  __dirname,
  "../Files",
  "verifystud.json"
);
const contractJsonVerifyStud = JSON.parse(
  fs.readFileSync(contractJsonVerifyStudPath)
);
const contractAbiVerifyStud = contractJsonVerifyStud.abi;

async function getStudContract(accountAddress) {
  const web3 = new Web3(besu.member1.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiRegStud);
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "getRegisteredStudentsContract";
  });
  const functionArgs = web3quorum.eth.abi
    .encodeParameters(functionAbi.inputs, [accountAddress])
    .slice(2);
  const functionParams = {
    to: contractInformations.registerStud.contractAddress,
    data: functionAbi.signature + functionArgs,
    privateKey: besu.member1.accountPrivateKey,
    privateFrom: tessera.member1.publicKey,
    privateFor: [tessera.member3.publicKey],
  };
  const transactionHash = await web3quorum.priv.generateAndSendRawTransaction(
    functionParams
  );
  const result = await web3quorum.priv.waitForTransactionReceipt(
    transactionHash
  );
  const decoded = web3quorum.eth.abi.decodeParameters(
    functionAbi.outputs,
    result.output
  );
  console.log("Contract Address : ", decoded[0]);
  return decoded[0];
}
async function getStudProfile(
  clientUrl,
  contractAddress,
  fromPrivateKey,
  fromPublicKey,
  toPublicKey
) {
  const web3 = new Web3(clientUrl);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiStudent);
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "getStudentInfo";
  });
  const functionParams = {
    to: contractAddress,
    data: functionAbi.signature,
    privateKey: fromPrivateKey,
    privateFrom: fromPublicKey,
    privateFor: [toPublicKey],
  };
  const transactionHash = await web3quorum.priv.generateAndSendRawTransaction(
    functionParams
  );
  const result = await web3quorum.priv.waitForTransactionReceipt(
    transactionHash
  );
  const decoded = web3quorum.eth.abi.decodeParameters(
    functionAbi.outputs,
    result.output
  );
  const studInfo = {
    student_address: decoded[0],
    name: decoded[1],
    email: decoded[2],
    id: decoded[3],
  };
  console.log(studInfo);
  return studInfo;
}
async function RegisterStudentPrivate(
  clientUrl,
  address,
  value,
  fromPrivateKey,
  fromPublicKey,
  toPublicKey
) {
  console.log(
    besu.member3.url,
    besu.member3.accountPrivateKey,
    tessera.member3.publicKey,
    tessera.member1.publicKey
  );
  const StudentContract = await createContract(
    besu.member3.url,
    besu.member3.accountPrivateKey,
    tessera.member3.publicKey,
    tessera.member1.publicKey,
    value
  );
  console.log(
    "Student 11 Contract Address : ",
    StudentContract.contractAddress
  );
  const web3 = new Web3(clientUrl);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiRegStud);
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "registerStudents";
  });
  console.log([...value, StudentContract.contractAddress]);

  const functionArgs = web3quorum.eth.abi
    .encodeParameters(functionAbi.inputs, [
      value[0],
      value[1],
      value[2],
      value[3],
      StudentContract.contractAddress,
    ])
    .slice(2);
  const functionParams = {
    to: address,
    data: functionAbi.signature + functionArgs,
    privateKey: fromPrivateKey,
    privateFrom: fromPublicKey,
    privateFor: [toPublicKey],
  };
  console.log("Student 22 Contract Address : ", functionParams);
  const transactionHash = await web3quorum.priv.generateAndSendRawTransaction(
    functionParams
  );
  console.log(
    "Student 33 Contract Address : ",
    StudentContract.contractAddress
  );
  console.log(`Transaction hash: ${transactionHash}`);
  const result = await web3quorum.priv.waitForTransactionReceipt(
    transactionHash
  );

  return [result, StudentContract.contractAddress];
}

async function RegisterStudentPublic(contractAddress, value) {
  console.log("Registering Student Public");

  const host = besu.rpcnode.url;
  const web3 = new Web3(host);

  const account = web3.eth.accounts.privateKeyToAccount(
    besu.member3.accountPrivateKey
  );
  const fromAddress = account.address;

  const contractInstance = new web3.eth.Contract(
    contractAbiPublicData,
    contractAddress
  );

  // Encode function call
  const data = contractInstance.methods
    .registerStudent(value[0], value[1])
    .encodeABI();

  const tx = {
    to: contractAddress,
    data: data,
    gas: 150000, // or tune it
    gasPrice: "0x0", // for Besu/Quorum, no fees
    from: fromAddress,
  };

  const signed = await web3.eth.accounts.signTransaction(
    tx,
    besu.member3.accountPrivateKey
  );
  const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);

  console.log("Result from Register:", receipt);
  return receipt;
}
async function RegisterStudentPrivateToPending(
  clientUrl,
  value,
  fromPrivateKey,
  fromPublicKey,
  toPublicKey
) {
  const web3 = new Web3(besu.member2.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiVerifyStud);
  const studentcontract = await getStudContract(value[0]);
  const studInfo = await getStudProfile(
    clientUrl,
    studentcontract,
    fromPrivateKey,
    fromPublicKey,
    toPublicKey
  );
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "addStudToPending";
  });
  const functionArgs = web3quorum.eth.abi
    .encodeParameters(functionAbi.inputs, [
      studInfo.name,
      studInfo.student_address,
      studInfo.email,
      studInfo.id,
      value[1],
    ])
    .slice(2);
  const functionParams = {
    to: contractInformations.verifyStud.contractAddress,
    data: functionAbi.signature + functionArgs,
    privateKey: besu.member2.accountPrivateKey,
    privateFrom: tessera.member2.publicKey,
    privateFor: [tessera.member1.publicKey],
  };
  const transactionHash = await web3quorum.priv.generateAndSendRawTransaction(
    functionParams
  );
  const result = await web3quorum.priv.waitForTransactionReceipt(
    transactionHash
  );
  return result;
}

const gentStudentInstitution = async (
  clientUrl,
  fromPrivateKey,
  fromPublicKey,
  toPublicKey,
  key
) => {
  const web3 = new Web3(clientUrl);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiRegStud);
  // eslint-disable-next-line no-underscore-dangl
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "getRegisteredStudentByKey";
  });
  const functionArgs = web3quorum.eth.abi
    .encodeParameter(functionAbi.inputs[0], key)
    .slice(2);
  const functionParams = {
    to: contractInformations.registerStud.contractAddress,
    data: functionAbi.signature + functionArgs,
    privateKey: fromPrivateKey,
    privateFrom: fromPublicKey,
    privateFor: [toPublicKey],
  };
  const transactionHash = await web3quorum.priv.generateAndSendRawTransaction(
    functionParams
  );
  // console.log(`Transaction hash: ${transactionHash}`);
  const result = await web3quorum.priv.waitForTransactionReceipt(
    transactionHash
  );
  const decoded = web3quorum.eth.abi.decodeParameters(
    functionAbi.outputs,
    result.output
  );
  console.log("decoded", decoded);
  return decoded;
};
const getStudentInformation = async (
  clientUrl,
  address,
  fromPrivateKey,
  fromPublicKey,
  toPublicKey
) => {
  const web3 = new Web3(clientUrl);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiStudent);
  // eslint-disable-next-line no-underscore-dangle
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "getStudentInfo";
  });

  const functionArgs = web3quorum.eth.abi
    .encodeParameters(functionAbi.inputs, [])
    .slice(2);
  const functionParams = {
    to: address,
    data: functionAbi.signature + functionArgs,
    privateKey: fromPrivateKey,
    privateFrom: fromPublicKey,
    privateFor: [toPublicKey],
  };
  const transactionHash = await web3quorum.priv.generateAndSendRawTransaction(
    functionParams
  );
  // console.log(`Transaction hash: ${transactionHash}`);
  const result = await web3quorum.priv.waitForTransactionReceipt(
    transactionHash
  );
  const decoded = web3quorum.eth.abi.decodeParameters(
    functionAbi.outputs,
    result.output
  );
  console.log("decoded", decoded);
  const key = web3.utils.soliditySha3(decoded[0], decoded[3]);
  console.log("key", key);
  const studentInfo = await gentStudentInstitution(
    clientUrl,
    fromPrivateKey,
    fromPublicKey,
    toPublicKey,
    key
  );
  return studentInfo;
};

module.exports = {
  RegisterStudentPrivate,
  RegisterStudentPublic,
  RegisterStudentPrivateToPending,
  getStudContract,
  getStudProfile,
  getStudentInformation,
};
