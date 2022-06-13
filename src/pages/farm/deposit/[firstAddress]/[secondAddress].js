import { Avatar, AvatarGroup } from "@mui/material";
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import useAppContext from "../../../../hooks/useAppContext"
import { FARMS, TOKENS } from "../../../../config";
import * as scripts from "../../../../flow/scripts"
import * as transactions from "../../../../flow/transactions"
import { getPoolID } from "../../../../flow/utils"
import * as fcl from "@onflow/fcl"

export default function DepositPage() {
    const router = useRouter()
    const [amount, setAmount] = useState(0)
    const [poolsMetaData, setPoolsMetaData] = useState([])
    const [poolID, setPoolID] = useState(0)
    const [pendingRewards, setPendingRewards] = useState(0)
    const pathSet = router.asPath.split('/')
    const { currentUser } = useAppContext()

    const handleAmount = (e) => {
        setAmount(e)
    }

    useEffect(() => {
        currentUser && (async () => setPendingRewards(await scripts.getPendingRewards(0, currentUser.addr)))(); 
        (async () => setPoolsMetaData(await scripts.getPoolsMetaData()))();
        console.log(poolsMetaData, pathSet[pathSet.length - 2], pathSet[pathSet.length - 1]);
        setPoolID(getPoolID(poolsMetaData, pathSet[pathSet.length - 2], pathSet[pathSet.length - 1]));
    }, [])

    const deposit = async  () => {
        await transactions.deposit(fcl.authz, amount)
    }
    return (
        <main>
            <div className="deposit">
                <div className="deposit-box">
                    <div className="deposit-header">
                        <h2>
                            {FARMS[poolID].tokens.map((item, key) => (
                                <span key={key}>
                                    {TOKENS.find(x => x.tokenAddress === item.tokenAddress).tokenName}
                                    {key !== FARMS[poolID].tokens.length - 1 &&
                                        <>-</>
                                    }
                                </span>
                            ))}
                        </h2>
                        <div className="header-icons">
                            <AvatarGroup max={4}>
                                {FARMS[poolID].tokens.map((item, key) => (
                                    <Avatar alt="" src={TOKENS.find(x => x.tokenAddress === item.tokenAddress).icon} key={key} />
                                ))}
                            </AvatarGroup>
                        </div>
                    </div>
                    <div className="deposit-content">
                        <div className="reward-panel">
                            <div className="reward-item">
                                <h4>Total deposits</h4>
                                <p>$ 23,235,325</p>
                            </div>
                            <div className="reward-item">
                                <h4>Pool rate</h4>
                                <p>4,5454 FLOW / week</p>
                                <p>1,975 tUSDT / week</p>
                            </div>
                        </div>
                        <div className="user-info">
                            <h3>Your liquidity deposits</h3>
                            <h2>0</h2>
                            <h3>Your unclaimed rewards</h3>
                            <h2>{pendingRewards}</h2>
                        </div>
                        <div className="deposit-input">
                            <label>Deposit amount</label>
                            <input
                                value={amount}
                                onChange={(e) => handleAmount(e.target.value)}
                            />
                        </div>
                        <button className="btn-farm-stake" onClick={deposit}>
                            Deposit
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}