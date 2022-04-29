import { NextSeo } from "next-seo";
import { useState , useEffect } from "react";
import TokenInput from "../components/TokenInput";
import { TOKENS } from "../config";
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import * as scripts from "../flow/scripts/script.getPoolsMetaData"
import * as fcl from "@onflow/fcl";

export default function SwapPage() {
    const [firstToken, setFirstToken] = useState(TOKENS[0]);
    const [firstTokenBalance, setFirstTokenBalance] = useState(0);
    const [firstTokenAmount, setFirstTokenAmount] = useState(0);
    const [secondToken, setSecondToken] = useState(TOKENS[1]);
    const [secondTokenBalance, setSecondTokenBalance] = useState(0);
    const [secondTokenAmount, setSecondTokenAmount] = useState(0);
    const [poolsMetaData, setPoolsMetaData ] = useState([]);

    const handleReplace = () => {
        setFirstToken(secondToken)
        setSecondToken(firstToken)
        setFirstTokenBalance(secondTokenBalance)
        setsetSecondTokenBalance(firstTokenBalance)
    }

    const getPools = async () => {
        let poolsMetaData = await scripts.getPoolsMetaData();
        setPoolsMetaData(poolsMetaData);
        
    }

    const getTokensBalance = () => {
        poolsMetaData.forEach((item,index) => {
            if (item.token1Identifier === firstToken && item.token2Identifier === secondToken) {
                setFirstTokenBalance(item.token1Amount);
                setSecondTokenBalance(item.token2Amount);
            }
        })
    }

    useEffect(()=>{
        getPools();
    },[]);

    useEffect(()=>{
        getTokensBalance();
    },[poolsMetaData]);
    
    return (
        <>
            <NextSeo
                title="emuswap | Flow token swap, pool, farm, stake"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                openGraph={{
                    url: 'https://emuswap.herokuapp.com/',
                    title: 'emuswap | Flow token swap, pool, farm, stake',
                    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                    images: [
                        {
                            url: 'https://emuswap.herokuapp.com/img/seo/flow-emuswap.png',
                            width: 335.44,
                            height: 100,
                            alt: 'Moduluc',
                            type: 'image/png',
                        }
                    ],
                    site_name: 'emuswap',
                }}
            />
            <main>
                <div className="swap-box">
                    <div className="swap-main">
                        <TokenInput 
                            tokenImage={firstToken.icon} 
                            title={firstToken.tokenName} 
                            onChange={(e) => {
                                setFirstToken(e);
                            }} 
                            inputTitle="From" 
                            onAmountChange = {(value) => {setFirstTokenAmount(value)}}  
                            amount = {firstTokenAmount}
                            balance={firstTokenBalance}
                            />
                        <div className="display-center">
                            <button className="btn-replace" onClick={() => handleReplace()}>
                                <ArrowDownwardRoundedIcon />
                            </button>
                        </div>
                        <TokenInput 
                            tokenImage={secondToken.icon} 
                            title={secondToken.tokenName} 
                            onChange={(e) => {
                             setSecondToken(e);
                            }} 
                            inputTitle="To" 
                            onAmountChange = {(value) => {setSecondTokenAmount(value)}}  
                            amount = {secondTokenAmount}
                            balance={secondTokenBalance}/>
                    </div>
                    <button className="btn-add-amount" style={{ marginTop: 10 }}>
                        Enter an amount
                    </button>
                </div>
            </main>
        </>
    )
}