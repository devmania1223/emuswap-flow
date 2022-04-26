import { config } from "@onflow/fcl";

config({
    "accessNode.api": "https://access-testnet.onflow.org", // Mainnet: "https://access-mainnet-beta.onflow.org"
    "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn", // Mainnet: "https://fcl-discovery.onflow.org/authn"
    "0xFlowToken": "0x7e60df042a9c0868",
    "0xFungibleToken": "0x9a0766d93b6608b7"
})


// config({
//     "accessNode.api": "http://127.0.0.1:3569", // Mainnet: "https://access-mainnet-beta.onflow.org"
//     "discovery.wallet": "http://localhost:8701/fcl/authn", // Mainnet: "https://fcl-discovery.onflow.org/authn"
//     "0xFlowToken": "0x0ae53cb6e3f42a79",
//     "0xFungibleToken": "0xee82856bf20e2aa6"
// })