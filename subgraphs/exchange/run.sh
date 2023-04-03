#!/bin/sh
#cd graphwork/chronoswap-subgraph/subgraphs/exchange
git pull
npx graph remove exchange --node http://127.0.0.1:8020
npm run codegen
npm run create-local
npm run deploy-local