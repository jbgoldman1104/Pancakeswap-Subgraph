#!/bin/sh
#cd /root/cronos/bin
systemctl stop cronosd.service
cronosd unsafe-reset-all
rm ~/.cronos/config/genesis.json
cronosd init chronoswap-graphnode-1 --chain-id cronosmainnet_25-1
curl https://raw.githubusercontent.com/crypto-org-chain/cronos-mainnet/master/cronosmainnet_25-1/genesis.json > ~/.cronos/config/genesis.json
sed -i.bak -E 's#^(minimum-gas-prices[[:space:]]+=[[:space:]]+).*$#\1"5000000000000basecro"#' ~/.cronos/config/app.toml

sed -i.bak -E 's#^(seeds[[:space:]]+=[[:space:]]+).*$#\1"0d5cf1394a1cfde28dc8f023567222abc0f47534@cronos-seed-0.crypto.org:26656,3032073adc06d710dd512240281637c1bd0c8a7b@cronos-seed-1.crypto.org:26656,04f43116b4c6c70054d9c2b7485383df5b1ed1da@cronos-seed-2.crypto.org:26656"#' ~/.cronos/config/config.toml
sed -i.bak -E 's#^(create_empty_blocks_interval[[:space:]]+=[[:space:]]+).*$#\1"5s"#' ~/.cronos/config/config.toml
sed -i.bak -E 's#^(timeout_commit[[:space:]]+=[[:space:]]+).*$#\1"5s"#' ~/.cronos/config/config.toml
#cronosd keys add chronoswap
systemctl start cronosd.service
#cronosd start