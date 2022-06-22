# Bash script for testing contracts, transactions and scripts against the emulator. 
# 1. Create accounts 

flow accounts create --key="2921bbc5acf75417b09ef1cc7981f2a57cc7ee00df71afaddde94991b6f26fb4da66a4b9bea1ee8a555dbba62626ba7c0437e4c6800d25203c915161bed6e4f2"

# 2. Mint Flow tokens

# mintFlowTokens amount recipientAddress
flow transactions send "./transactions/demo/mintFlowTokens.cdc" 1000000.0 0x01cf0e2f2f715450

flow project deploy --network emulator

# 3. Setup accounts FUSD.

flow transactions send "./transactions/FUSD/setup.cdc" --signer "admin-account"

# Setup EmuToken 
flow transactions send "./transactions/EmuToken/setup.cdc" --signer "admin-account"


flow transactions send "./transactions/demo/mintFUSD.cdc" 1000000.0 0x01cf0e2f2f715450

# 4. Create Pools (admin adds 100 Flow + 500 FUSD)
flow transactions send "./transactions/EmuSwap/admin/create_new_pool_FLOW_FUSD.cdc" 100.0 500.0 --signer "admin-account"


# Create new farm for pool 0 = Flow/FUSD
flow transactions send "./transactions/Staking/admin/toggle_mock_time.cdc" --signer "admin-account"
flow transactions send "./transactions/Staking/admin/create_new_farm.cdc" 0 --signer "admin-account"

#flow transactions send "./transactions/Staking/admin/create_reward_pool_fusd.cdc" 100000.0 --signer admin-account

flow transactions send "./transactions/Staking/admin/update_mock_timestamp.cdc" 1.0 --signer "admin-account"

# Setup xEmuToken 
flow transactions send "./transactions/xEmu/setup.cdc" --signer "admin-account"
flow transactions send "./transactions/xEmu/setup.cdc" --signer "user-account1"
flow transactions send "./transactions/xEmu/setup.cdc" --signer "user-account2"

