# Swap Integration Expert Reference

Deep expertise reference for Uniswap swap integration across v2, v3, v4, and Universal Router.

## Expertise Areas

- Trading API integration (check_approval, quote, swap endpoints)
- Universal Router command encoding and execution
- SDK usage (@uniswap/universal-router-sdk, @uniswap/v3-sdk)
- Permit2 token approval patterns
- Multi-hop routing and path optimization
- Cross-chain swaps and bridging
- Smart contract integration patterns
- Gas optimization for swaps
- Error handling and edge cases
- ERC-4337 smart account integration with delegation patterns
- WETH handling and unwrapping on L2 chains
- Rate limiting strategies for batch operations

## Decision Framework

1. **Understand the context**: Frontend, backend, or smart contract integration?
2. **Recommend the right method**: Trading API for most cases, SDK for full control, direct calls for contracts
3. **Provide working code**: Include complete, runnable examples
4. **Explain tradeoffs**: Gas costs, MEV protection, routing efficiency
5. **Handle edge cases**: Native ETH handling, permit signatures, slippage

## Key Technical Knowledge

### Trading API Flow

```text
1. POST /check_approval -> Check token approval status
2. POST /quote -> Get optimized route and quote
3. POST /swap -> Get executable transaction
```

### Universal Router Commands

| Command | Code | Use |
|---|---|---|
| V3_SWAP_EXACT_IN | 0x00 | v3 exact input swap |
| V3_SWAP_EXACT_OUT | 0x01 | v3 exact output swap |
| V2_SWAP_EXACT_IN | 0x08 | v2 exact input swap |
| V2_SWAP_EXACT_OUT | 0x09 | v2 exact output swap |
| V4_SWAP | 0x10 | v4 swap |
| WRAP_ETH | 0x0b | ETH to WETH |
| UNWRAP_WETH | 0x0c | WETH to ETH |

### SDK Pattern

```typescript
const { calldata, value } = SwapRouter.swapCallParameters(trade, {
  slippageTolerance: new Percent(50, 10000),
  recipient: address,
  deadline: Math.floor(Date.now() / 1000) + 1200,
});
```

## Best Practices

- Always provide complete, working code examples
- Include error handling for all swap operations
- Mention gas considerations and MEV protection
- Warn about common pitfalls (approval before swap, deadline expiry, slippage)
- For smart accounts, approve tokens directly to Universal Router (legacy mode) rather than Permit2
- Add 20-30% gas buffer for swap operations
- Handle WETH unwrapping on L2 chains after swap completion

## Cross-References

- Full Trading API integration: `sdk-integration.md`
- Advanced patterns (ERC-4337, WETH, rate limiting): `advanced-patterns.md`
- Trading API funding flows (swap + bridge): `trading-api-flows.md`
