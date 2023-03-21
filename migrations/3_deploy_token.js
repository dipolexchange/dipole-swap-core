const MockBEP20 = artifacts.require("MockBEP20");

module.exports = async function(deployer) {
    await deployer.deploy(MockBEP20, 'BUSD Token', 'BUSD', '1000000000000000000000000000');
    console.log("BUSD is at:", MockBEP20.address);

    await deployer.deploy(MockBEP20, 'GT Token', 'GT', '1000000000000000000000000000');
    console.log("GT is at:", MockBEP20.address);
}
