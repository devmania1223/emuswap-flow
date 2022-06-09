import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import "../../../../flow/config";
//import GET_FLOW_BALANCE from '../../../../cadence/scripts/standard/get_flow_balance.cdc'

export const getFlowBalance = async (address) => {
    // return   fcl.account(address).then(d => {
    //     console.log(d.balance)
    //     return d.balance
    // });
  const info = await fcl.query({
    cadence: `
    import FungibleToken from 0xFungibleToken
    import FUSD from 0xe223d8a629e49c68

    pub fun main(account: Address): UFix64 {

        let vaultRef = getAccount(account)
            .getCapability(/public/fusdBalance)
            .borrow<&FUSD.Vault{FungibleToken.Balance}>()
            ?? panic("Could not borrow Balance reference to the Vault")

        return vaultRef.balance
    }
    `,
      args: (arg, t) => [arg(address, t.Address)]
  })

  return info;
}
