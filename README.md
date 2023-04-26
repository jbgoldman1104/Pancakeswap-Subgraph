# Dex - Pancakeswap Subgraph

TheGraph exposes a GraphQL endpoint to query the events and entities within the Binance Smart Chain and PancakeSwap ecosystem.

Currently, there are multiple subgraphs, but additional subgraphs can be added to this repository, following the current architecture.

## Subgraphs

1. **[Blocks]: Tracks all blocks on Binance Smart Chain.

7. **[Pancake Squad](https://thegraph.com/legacy-explorer/subgraph/pancakeswap/pancake-squad)**: Tracks all Pancake Squad metrics with Owners, Tokens (including metadata), and Transactions.

8. **[Prediction (v1)](https://thegraph.com/legacy-explorer/subgraph/pancakeswap/prediction)**: Tracks all PancakeSwap Prediction (v1) with market, rounds, and bets.

9. **[Prediction (v2)](https://thegraph.com/legacy-explorer/subgraph/pancakeswap/prediction-v2)**: Tracks all PancakeSwap Prediction (v2) with market, rounds, and bets.

10. **[Profile](https://thegraph.com/legacy-explorer/subgraph/pancakeswap/profile)**: Tracks all PancakeSwap Profile with teams, users, points and campaigns.

11. **[SmartChef](https://thegraph.com/legacy-explorer/subgraph/pancakeswap/smartchef)**: Tracks all PancakeSwap SmartChef (a.k.a. Syrup Pools) with tokens and rewards.

12. **[Timelock](https://thegraph.com/legacy-explorer/subgraph/pancakeswap/timelock)**: Tracks all PancakeSwap Timelock queued, executed, and cancelled transactions.

13. **[Trading Competition (v1)](https://thegraph.com/legacy-explorer/subgraph/pancakeswap/trading-competition-v1)**: Tracks all metrics for the Easter Battle (April 07—14, 2021).

## Dependencies

- [Graph CLI](https://github.com/graphprotocol/graph-cli)
    - Required to generate and build local GraphQL dependencies.

```shell
yarn global add @graphprotocol/graph-cli
```

## Deployment

For any of the subgraph: `blocks` as `[subgraph]`

1. Run the `cd subgraphs/[subgraph]` command to move to the subgraph directory.

2. Run the `yarn codegen` command to prepare the TypeScript sources for the GraphQL (generated/*).

3. Run the `yarn build` command to build the subgraph, and check compilation errors before deploying.

4. Create and deploy to graph-node.
