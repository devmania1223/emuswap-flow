export const toStr = (amount) => {
    if (Number.isInteger(parseFloat(amount))) {
        amount = amount.toString() + '.0'
    }
    return amount
}
export const getPoolID = (poolsMeta, token1Address, token2Address) => {
    console.log(poolsMeta)
    return 0
}