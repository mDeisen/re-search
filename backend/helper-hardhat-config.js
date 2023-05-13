const networkConfig = {
    31337: {
        name: "localhost",
    },
    11155111: {
        name: "sepolia",
        hub : "",
    },
    137: {
        name: "polygon",
        hub: "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d"
    },
    80001: {
        name: "mumbai",
        hub: "0x7582177F9E536aB0b6c721e11f383C326F2Ad1D5",
        gov: "0x1677d9cc4861f1c85ac7009d5f06f49c928ca2ad"
    }
}

const DECIMALS = "18"
const developmentChains = ["hardhat", "localhost"]

module.exports = {
    networkConfig,
    developmentChains,
    DECIMALS
}