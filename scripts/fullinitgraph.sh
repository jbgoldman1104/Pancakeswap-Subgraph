#!/bin/sh
#cd /var/lib/postgresql/10/main
#su postgres -c 'dropdb graphnodedb'
#su postgres -c 'createdb graphnodedb'
#cd /root/graphwork/chronoswap-subgraph
#graph-node --postgres-url postgresql://postgres:daniel@localhost:5432/graphnodedb --ethereum-rpc mainnet:http://localhost:8545 --ipfs http://127.0.0.1:5001 --http-port 80
graph-node --postgres-url postgresql://postgres:daniel@localhost:5432/graphnodedb --ethereum-rpc mainnet:https://cronos-rpc.elk.finance --ipfs http://127.0.0.1:5001 --http-port 80