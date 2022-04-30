import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export const mintFUSD = async (signer, amount , recipientAddress) => {
    const transactionId = await fcl.mutate({
      cadence: `
        import FungibleToken from 0xFungibleToken
        import FUSD from 0xFUSD

        transaction(amount: UFix64, recipientAddress: Address) {
            prepare(signer: AuthAccount) {
          
              let fusdTokenAdmin = signer.borrow<&FUSD.Administrator>(from: FUSD.AdminStoragePath) ?? panic("no flow token administrator found in storage")
          
              let minter <- fusdTokenAdmin.createNewMinter()
          
              let tokens <- minter.mintTokens(amount: amount)
            
              destroy minter
              
              let receiverRef = getAccount(recipientAddress)
                    .getCapability(/public/fusdReceiver)
                    .borrow<&{FungibleToken.Receiver}>()  
                    ?? panic("Cannot borrow account: 0x01cf0e2f2f715450 fusdTokenReceiver Cap")
          
             
              receiverRef.deposit(from: <- tokens)
            }
        }
        `,
        args: (arg, t) => [arg(amount, t.UFix64), arg(recipientAddress, t.Address)],
        payer: signer,
        proposer: signer,
        authorizations: [signer],
        limit: 9999
    })
    const transaction = await fcl.tx(transactionId).onceSealed()
    console.log("mintFUSDs",transaction)

}

