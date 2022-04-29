import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export const addLiquidity = async (signer, token1Amount , token2Amount) => {
    console.log("firstAmount", token1Amount);
    console.log("secondAmount", token2Amount);
    const transactionId = await fcl.mutate({
      cadence: `
        import FungibleToken from 0xFungibleToken
        import FungibleTokens from 0xFungibleTokens
        import EmuToken from 0xEmuToken
        import FUSD from from 0xFUSD
        import EmuSwap from 0xEmuSwap

        transaction(token1Amount: UFix64, token2Amount: UFix64) {
        
            let poolID:UInt64

            // The Vault references that holds the tokens that are being added as liquidity
            let emuTokenVaultRef: &EmuToken.Vault
            let fusdVaultRef: &FUSD.Vault

            // reference to lp collection
            var lpCollectionRef: &EmuSwap.Collection

            // The Vault reference for liquidity tokens
            var liquidityTokenRef: &FungibleTokens.TokenVault

            prepare(signer: AuthAccount) {
                // perhaps function to look this up instead of hard coding
                self.poolID = 1

                self.emuTokenVaultRef = signer.borrow<&EmuToken.Vault>(from: EmuToken.EmuTokenStoragePath)
                    ?? panic("Could not borrow a reference to Vault")

                self.fusdVaultRef = signer.borrow<&FUSD.Vault>(from: /storage/fusdVault)
                    ?? panic("Could not borrow a reference to Vault")

                // check if Collection is created if not then create
                if signer.borrow<&EmuSwap.Collection>(from: EmuSwap.LPTokensStoragePath) == nil {
                // Create a new Collection and put it in storage
                signer.save(<- EmuSwap.createEmptyCollection(), to: EmuSwap.LPTokensStoragePath)
                signer.link<&EmuSwap.Collection{FungibleTokens.CollectionPublic}>(
                    EmuSwap.LPTokensPublicReceiverPath, 
                    target: EmuSwap.LPTokensStoragePath
                )
                }

                // store reference to LP Tokens Collection
                self.lpCollectionRef = signer.borrow<&EmuSwap.Collection>(from: EmuSwap.LPTokensStoragePath)!

                // check if the user has the correct LP in their collection
                if !self.lpCollectionRef.getIDs().contains(self.poolID) {
                // if not create an empty LP Token
                let tokenVault <- EmuSwap.createEmptyTokenVault(tokenID: self.poolID)
                self.lpCollectionRef.deposit(token: <-tokenVault)
                self.liquidityTokenRef = self.lpCollectionRef.borrowVault(id: self.poolID)
                }
                
                self.liquidityTokenRef = self.lpCollectionRef.borrowVault(id: self.poolID)
            }

            execute {
                // Withdraw tokens
                let token1Vault <- self.emuTokenVaultRef.withdraw(amount: token1Amount) as! @EmuToken.Vault
                let token2Vault <- self.fusdVaultRef.withdraw(amount: token2Amount) as! @FUSD.Vault

                // create a token bundle with both tokens in equal measure
                let tokenBundle <- EmuSwap.createTokenBundle(fromToken1: <- token1Vault, fromToken2: <- token2Vault)
                
                // Pass tokenbundle to add liquidity and get LP tokens in return
                let liquidityTokenVault <- EmuSwap.borrowPool(id: self.poolID)?.addLiquidity!(from: <- tokenBundle)

                // Deposit the liquidity provider tokens
                self.liquidityTokenRef.deposit(from: <- liquidityTokenVault)
            }
        }
        `,
        args: (arg, t) => [arg(token1Amount, t.UFix64), arg(token2Amount, t.UFix64)],
        payer: signer,
        proposer: signer,
        authorizations: [signer],
        limit: 9999
    })
    const transaction = await fcl.tx(transactionId).onceSealed()
    console.log("AddLiquidity1",transaction)

}

