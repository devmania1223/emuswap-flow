import * as fcl from "@onflow/fcl"

export const getPoolsMetaData = async () => {
  const info = await fcl.query({
      cadence: `
      import EmuSwap from 0xEmuSwap
       
      pub fun main():[EmuSwap.PoolMeta] {
        let meta: [EmuSwap.PoolMeta] = []
        for ID in EmuSwap.getPoolIDs() {
            let poolRef = EmuSwap.borrowPool(id: ID)
            meta.append(
                poolRef!.getPoolMeta()
            )
        }
        return meta
    }
    `,
  })

  return info;
}
