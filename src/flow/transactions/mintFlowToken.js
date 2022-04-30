import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export const mintFlowToken = async (signer, amount , recipientAddress) => {
    const transactionId = await fcl.mutate({
      cadence: `
        import FungibleToken from 0xFungibleToken
        import FlowToken from 0xFlowToken

        transaction(amount: UFix64, recipientAddress: Address) {
          prepare(signer: AuthAccount) {
        
            // get reference to flow admin resource
            let flowTokenAdmin = signer.borrow<&FlowToken.Administrator>(from: /storage/flowTokenAdmin) ?? panic("no flow token administrator found in storage")
        
            // create a new minter
            let minter <- flowTokenAdmin.createNewMinter(allowedAmount: amount)
        
            let tokens <- minter.mintTokens(amount: amount)
           
            destroy minter
            
            // borrow recipients
            let accountRef = getAccount(recipientAddress)
                  .getCapability(/public/flowTokenReceiver)
                  .borrow<&{FungibleToken.Receiver}>()  ?? panic("Cannot borrow account: ".concat(recipientAddress.toString()).concat(" flowTokenReceiver Cap"))
        
            accountRef.deposit( from: <- tokens )
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
    console.log("mintFlowToken",transaction)

}

