import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export const addLiquidity = async (signer, token1Amount , token2Amount) => {
    const transactionId = await fcl.mutate({
      cadence: `
        import FungibleToken from 0xFungibleToken
        import FungibleTokens from 0xFungibleTokens
        import FUSD from 0xFUSD
        import FlowToken from 0xFlowToken
        import EmuSwap from 0xEmuSwap

        transaction(token1Amount: UFix64, token2Amount: UFix64) {

            // The Vault references that holds the tokens that are being transferred
            let flowTokenVaultRef: &FlowToken.Vault
            let fusdVaultRef: &FUSD.Vault
        
            // EmuSwap Admin Ref
            let adminRef: &EmuSwap.Admin
            
            // new pool to deposit to collection
            let lpTokenVault: @EmuSwap.TokenVault
        
            // reference to lp collection
            let lpCollectionRef: &EmuSwap.Collection
        
        
            // the signers auth account to pass to execute block
            let signer: AuthAccount
        
            prepare(signer: AuthAccount) {
            
            // prepare tokens refernces to withdraw inital liquidity 
            self.flowTokenVaultRef = signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
                ?? panic("Could not borrow a reference to Vault")
        
            self.fusdVaultRef = signer.borrow<&FUSD.Vault>(from: /storage/fusdVault)
                ?? panic("Could not borrow a reference to fusd Vault")
        
            // Create new Pool Vault 
            self.lpTokenVault <-EmuSwap.createEmptyTokenVault(tokenID: EmuSwap.nextPoolID) //to: EmuSwap.LPTokensStoragePath
            
            // check if Collection is created if not then create
            if signer.borrow<&EmuSwap.Collection>(from: EmuSwap.LPTokensStoragePath) == nil {
                // Create a new Collection and put it in storage
                signer.save(<- EmuSwap.createEmptyCollection(), to: EmuSwap.LPTokensStoragePath)
                
                
            }
            self.lpCollectionRef = signer.borrow<&EmuSwap.Collection>(from: EmuSwap.LPTokensStoragePath)!
        
            self.adminRef = signer.borrow<&EmuSwap.Admin>(from: EmuSwap.AdminStoragePath)
                ?? panic("Could not borrow a reference to EmuSwap Admin")
        
            self.signer = signer
            }
        
            execute {
            // Withdraw tokens
            let token1Vault <- self.flowTokenVaultRef.withdraw(amount: token1Amount) as! @FlowToken.Vault
            let token2Vault <- self.fusdVaultRef.withdraw(amount: token2Amount) as! @FUSD.Vault
        
            // Provide liquidity and get liquidity provider tokens
            let tokenBundle <- EmuSwap.createTokenBundle(fromToken1: <- token1Vault, fromToken2: <- token2Vault)
        
            // Keep the liquidity provider tokens
            let lpTokens <- self.adminRef.createNewLiquidityPool(from: <- tokenBundle)
        
            self.adminRef.togglePoolFreeze(id: lpTokens.tokenID)
            
            self.lpTokenVault.deposit(from: <-lpTokens )
            self.lpCollectionRef.deposit(token: <- self.lpTokenVault)
            //self.signer.save(<- lpTokens, to: /storage/LPToken)
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

