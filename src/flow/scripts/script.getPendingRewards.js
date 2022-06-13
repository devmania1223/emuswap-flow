import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import "../../../flow/config"

export const getPendingRewards = async (poolID, address) => {
  const info = await fcl.query({
    cadence: `
      import StakingRewards from 0xStakingRewards

      pub fun main(id: UInt64, address: Address):  {UInt64: Fix64}? {
          return StakingRewards.borrowFarm(id: id)?.getPendingRewards(address: address)!
      }
      `,
    args: (arg) => [arg(poolID, t.UInt64), arg(address, t.Address)]
  })

  return info;
}
