import EmuSwap from 0xEmuSwap

pub fun main(poolID: UInt64, amount: UFix64): UFix64 {
    let poolRef = EmuSwap.borrowPool(id: poolID)
    return poolRef!.quoteSwapToken1ForExactToken2(amount: amount)
}