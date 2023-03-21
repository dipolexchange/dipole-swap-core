const Multicall = artifacts.require("Multicall2");
const DipoleFactory = artifacts.require("DipoleFactory");
const DipoleRouter = artifacts.require("DipoleRouter");
const SmartChefFactory = artifacts.require("SmartChefFactory"); // 社区治理等地址
const CombinedSwapAddRemoveLiquidity = artifacts.require("CombinedSwapAddRemoveLiquidity");

const feeToSetter='0x810b7bacEfD5ba495bB688bbFD2501C904036AB7'; //有权更改 feeTo 地址的账户,为当前合约部署者
const smartChefOwner = '0x810b7bacEfD5ba495bB688bbFD2501C904036AB7'; // 部署活动的管理员账户

const usdtAddr = '0x97003a080D320eA015BEDba30df25e65Dc32164f'; // USDT代币合约地址
const wlatAddr = '0x02406D561069cBed27eF8Ea20AFD41779A90e2Bf'; // WLAT合约地址

async function getPairAddress(factory, token0, token1) {
   let addr = await factory.getPair.call(token0, token1);
   if (!+addr) {
      const result = await factory.createPair(token0, token1);
      addr = result.logs[0].args.pair;
   }
   return addr;
}

module.exports = async function(deployer) {
   await deployer.deploy(DipoleFactory,feeToSetter);
   console.log('DipoleFactory at:',DipoleFactory.address);

   await  deployer.deploy(DipoleRouter, DipoleFactory.address, wlatAddr);
   console.log('DipoleRouter at:',DipoleRouter.address);

   await deployer.deploy(CombinedSwapAddRemoveLiquidity, DipoleFactory.address, DipoleRouter.address, wlatAddr);
   console.log('CombinedSwapAddRemoveLiquidity at:',CombinedSwapAddRemoveLiquidity.address);

   await deployer.deploy(Multicall);
   console.log('Multicall  at:',Multicall.address);

   await deployer.deploy(SmartChefFactory, wlatAddr);
   console.log('SmartChefFactory  at:', SmartChefFactory.address);

   const smartChef = await SmartChefFactory.at(SmartChefFactory.address);
   await smartChef.transferOwnership(smartChefOwner);
   const owner = await smartChef.owner.call();
   console.log("SmartChefFactory owner is at:",owner);

   const factory = await DipoleFactory.at(DipoleFactory.address);

   var initHash = await factory.INIT_CODE_PAIR_HASH.call();
   console.log("initHash is at:",initHash);

   const latusdt = await getPairAddress(factory, usdtAddr, wlatAddr);
   console.log('lat/usdt pair is at:', latusdt);
};
