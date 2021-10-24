const Web3 = require("web3");
const Web3Contract = require("web3-eth-contract");
const bep20ABI = require("./abi/bep20.json");
const poolABI = require("./abi/poolAbi.json");
const { decodeConstructorArgs } = require('canoe-solidity');

// Mainnet or Testnet endpoint는 bsc developer 페이지 참고
const bscMainnetEndpoint = "https://bsc-dataseed.binance.org/";

// 각 Token의 Contract Address는 BscScan 홈페이지 참고
const bscFinixSixLpPoolAddress = "0x6b51E8FDc32Ead0B837deb334fcB79E24F3b105A";
const bscFinixSixLpTokenAddress = "0xc4b4ac94a73af2a4788aca0204ce0be779999dc9";
const bscSixTokenAddress = "0x070a9867ea49ce7afc4505817204860e823489fe";
const bscDefinixTokenAddress = "0x0f02b1f5af54e04fb6dd6550f009ac2429c4e30d";
const bscSystemContractAddress = '0x0000000000000000000000000000000000000000';
const myWalletAddress = "0xf2e9832d350697643d4eeb1e4d60ba24a8862a97";
const testAddress = myWalletAddress;

// const web3 = new Web3(new Web3.providers.HttpProvider(bscMainnetEndpoint));

Web3Contract?.setProvider(bscMainnetEndpoint);
const contract = new Web3Contract(poolABI, bscFinixSixLpPoolAddress);

async function getTransactionFromBlock (hash) {
  const tx = await web3.eth.getTransaction(hash);
  console.log('tx:', tx);
  return tx;
}


async function getTotalSupply(contract, decimal, symbol) {
  const totalSupply = await contract?.methods.totalSupply().call();
  console.log("totalSupply:", `${(parseInt(totalSupply) / Math.pow(10, decimal))} ${symbol}`);
  return totalSupply;
}

async function getName(contract) {
  const name = await contract?.methods.name().call();
  console.log("name:", name);
  return name;
}

async function getSymbol(contract) {
  const symbol = await contract?.methods.symbol().call();
  console.log("symbol:", symbol);
  return symbol;
}

async function getDecimal(contract) {
  const decimals = await contract?.methods.decimals().call();
  console.log("decimals:", decimals);
  return decimals;
}

async function getFactoryAddress(contract) {
  const factoryAddress = await contract?.methods.factory().call();
  console.log("factoryAddress:", factoryAddress);
  return factoryAddress;
}

async function getAllowance(contract, from, to) {
  const allowance = await contract?.methods.allowance(from, to).call();
  console.log("allowance:", allowance);
  return allowance;
}

async function getBalanceOf(contract, address, decimal, symbol) {
  const balanceOf = await contract?.methods.balanceOf(address).call();
  console.log("balanceOf:", `${(parseInt(balanceOf) / Math.pow(10, decimal))} ${symbol}`);
  return balanceOf;
}

async function getKLast(contract) {
  const kLast = await contract?.methods.kLast().call();
  console.log("kLast:", kLast);
  return kLast;
}

// LP Token에만 존재
// token1을 기준으로 token0의 가격
async function getPrice0CumulativeLast(contract) {
  const price0CumulativeLast = await contract?.methods.price0CumulativeLast().call();
  console.log("price0CumulativeLast:", price0CumulativeLast);
  return price0CumulativeLast;
}

// LP Token에만 존재
// token0을 기준으로 token1의 가격
async function getPrice1CumulativeLast(contract) {
  const price1CumulativeLast = await contract?.methods.price1CumulativeLast().call();
  console.log("price1CumulativeLast:", price1CumulativeLast);
  return price1CumulativeLast;
}

async function getPoolLength(contract) {
  const poolLength = await contract?.methods.poolLength().call();
  console.log("poolLength:", poolLength);
  return poolLength;
}

async function getPoolInfo(contract, poolIndex) {
  const poolInfo = await contract?.methods.poolInfo(poolIndex).call();
  // console.log(`poolInfo ${poolIndex}:`, poolInfo);
  return poolInfo;
}

async function getUserInfo(contract, poolIndex, address) {
  const userInfo = await contract?.methods.userInfo(poolIndex, address).call();
  return userInfo;
}

async function getPendingFinix(contract, pid, address, decimal) {
  const pendingFinix = await contract?.methods.pendingFinix(pid, address).call();
  console.log(`pendingFinix:`, `${pendingFinix / Math.pow(10, decimal)} Finix`);
  return pendingFinix;
}

async function start() {
  // const symbol = await getSymbol(contract);
  // const name = await getName(contract);
  // const decimal = await getDecimal(contract);
  // await getFactoryAddress();
  // await getKLast();
  // await getAllowance(
  //   "0x553210240d14c084770e9ab72a28ce57a0001470",
  //   "0x6b51e8fdc32ead0b837deb334fcb79e24f3b105a"
  // );
  // await getTotalSupply(contract, decimal, symbol);
  // await getBalanceOf(contract, testAddress, decimal, symbol);
  // await getPrice0CumulativeLast();
  // await getPrice1CumulativeLast();
  // await getMint();
  const poolLength = await getPoolLength(contract);
  // const poolInfoList = [];
  // for(let i = 0; i < poolLength; i++){
  //   poolInfoList.push(await getPoolInfo(contract, i));
  // }
  // console.log(poolInfoList[1]);
  const userInfoList = [];
  for(let i = 0; i < poolLength; i++){
    userInfoList.push(await getUserInfo(contract, i, testAddress));
  }
  console.log('userInfoList:', userInfoList);

  userInfoList.forEach((userInfo, userInfoListIndex) => {
    if(parseInt(userInfo.amount) > 0){
      getPendingFinix(contract, userInfoListIndex, testAddress, 18);
    }
  });
}

start();
