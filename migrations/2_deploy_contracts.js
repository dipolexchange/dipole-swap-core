const Multicall = artifacts.require("Multicall2");
const DipoleFactory = artifacts.require("DipoleFactory");
const DipoleRouter = artifacts.require("DipoleRouter");
const SmartChefFactory = artifacts.require("SmartChefFactory"); // 社区治理等地址
const CombinedSwapAddRemoveLiquidity = artifacts.require("CombinedSwapAddRemoveLiquidity");

const feeToSetter='0x8499C7F7A73ee7Ff3Cba9eC73111700F4bFa30F8'; //有权更改 feeTo 地址的账户,为当前合约部署者
const smartChefOwner = '0xf905737347167cBd098A211ce969e19A5BF8DAfC'; // 部署活动的管理员账户

const wlatAddr = '0xCC9fBAB49C29B3FF536A3d94873e988cC4A572aF'; // WLAT合约地址
const pusdtAddr = '0x9BEedA978b7E916F5DB4bBb24a0B7d5DC90D1066';
const pusdcAddr = '0xAEB97D93f6AEc7d3BaDD41853F012E67cDb9906d';
const pdaiAddr = '0xdCf4348243170F8b5f80b59792E2cF5c1E41fa64';
const cusdtAddr = '0xA31B732A6272E7F1aCdf172f56B2188A777eFd0A';
const cusdcAddr = '0xd02e2965F64CfD3C80e783ADdabf346fb71f0f0b';
const cdaiAddr = '0xFc61b7cC9b0ACbe5348706A36ce17dfD18c5BF11';
const scgtAddr = '0xd9FA928fe15C07066434aC555f24a091B66a45f8';

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

   const latpusdt = await getPairAddress(factory, pusdtAddr, wlatAddr);
   console.log('lat/pusdt pair is at:', latpusdt);
   const latpusdc = await getPairAddress(factory, pusdcAddr, wlatAddr);
   console.log('lat/pusdc pair is at:', latpusdc);
   const latpdai = await getPairAddress(factory, pdaiAddr, wlatAddr);
   console.log('lat/pdai pair is at:', latpdai);
   const latcusdt = await getPairAddress(factory, cusdtAddr, wlatAddr);
   console.log('lat/cusdt pair is at:', latcusdt);
   const latcusdc = await getPairAddress(factory, cusdcAddr, wlatAddr);
   console.log('lat/cusdc pair is at:', latcusdc);
   const latcdai = await getPairAddress(factory, cdaiAddr, wlatAddr);
   console.log('lat/cdai pair is at:', latcdai);
   const latscgt = await getPairAddress(factory, scgtAddr, wlatAddr);
   console.log('lat/scgt pair is at:', latscgt);
};
