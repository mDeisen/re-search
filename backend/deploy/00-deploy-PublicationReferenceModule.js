const { network } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("----------------------------------------------------")
    const hub = networkConfig[network.config.chainId].hub
    arguments = [hub]
    const moduleContract = await deploy("PublicationReferenceModule", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(moduleContract.address, arguments)
    }

    if(network.name == "mumbai"){
        log("Whitelisting on Mumbai Governance Test Net")
        const govContractAdress = networkConfig[network.config.chainId].gov;
        const govContract = await hre.ethers.getContractAt("ILensHub", govContractAdress);
        await govContract.whitelistReferenceModule(moduleContract.address, true);
    }
    
}

module.exports.tags = ["all", "moduleContract", "main"]