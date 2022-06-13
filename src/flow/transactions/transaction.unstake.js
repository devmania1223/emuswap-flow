import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import "../../../flow/config"
import { toStr } from "../utils"

export const unstake = async (signer, amount) => {
    const transactionId = await fcl.mutate({
        cadence: `
    import FlowToken from 0xFlowToken
    import FUSD from 0xFUSD


    transaction(amount: UFix64) {

        // the signers auth account to pass to execute block
        let signer: AuthAccount

        prepare(signer: AuthAccount) {
            self.signer = signer
        }

        execute {
            let farmRef = StakingRewards.borrowFarm(id: 0)!

            let collectionRef = self.signer.borrow<&StakingRewards.StakeControllerCollection>(from: StakingRewards.CollectionStoragePath)
            let stakeControllerRef = collectionRef!.borrow(id: 0)!

            farmRef.unstake(amount: amount, stakeControllerRef: stakeControllerRef) 
        }
    }
    `,
        args: (arg) => [arg(toStr(amount), t.UFix64)],
        payer: signer,
        proposer: signer,
        authorizations: [signer],
        limit: 9999
    })
    const transaction = await fcl.tx(transactionId).onceSealed()
    console.log("Unstake", transaction)
}
