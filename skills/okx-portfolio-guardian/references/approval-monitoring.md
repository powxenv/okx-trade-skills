# Approval Monitoring

Track and manage token approvals to detect and respond to suspicious contract authorizations.

## Why Monitor Approvals

Token approvals allow smart contracts to spend your tokens. Malicious approvals can drain your wallet. Regular monitoring catches:
- Phishing-induced approvals (user signed malicious transaction)
- Exploited contract approvals (trusted contract was hacked)
- Dusting attacks (token approvals that enable future exploitation)

## Monitoring Workflow

### Step 1: Capture Baseline

```bash
# Get current approvals
onchainos security approvals --address <addr> --chain <c>
```

Record all known approvals with: token address, spender address, allowance, timestamp.

### Step 2: Regular Checks

```bash
# Re-check approvals periodically
onchainos security approvals --address <addr> --chain <c>
```

Compare against baseline. Flag any new approvals.

### Step 3: Evaluate New Approvals

For each new approval, assess:

| Check | Safe | Suspicious | Dangerous |
|---|---|---|---|
| Spender contract | Known DEX/router | Unknown, recently deployed | Unverified, no source |
| Allowance | Limited (e.g., exact amount) | Unlimited on stablecoin | Unlimited on all tokens |
| Contract age | > 6 months | < 1 month | < 1 day |
| Source | User-initiated trade | Unclear origin | After clicking unknown link |

### Step 4: Respond

**Safe new approval:** Add to baseline, log.

**Suspicious new approval:**
1. Alert user with contract details
2. Recommend revocation
3. Wait for user decision

**Dangerous new approval:**
1. Alert immediately
2. If auto-mode: auto-revoke
3. Enhanced monitoring for 24 hours

## Auto-Revocation

When a dangerous approval is detected in auto-mode:

```bash
# Revoke the approval (set allowance to 0)
# This requires interacting with the token contract
onchainos security approvals --address <addr> --chain <c>
# Follow up with explicit revocation transaction
```

## Approval Hygiene Rules

1. **Prefer exact approvals** over unlimited where possible
2. **Revoke unused approvals** after each trading session
3. **Never approve** contracts you don't recognize
4. **Check approvals weekly** even without active trading
5. **Keep a whitelist** of known safe spenders (Uniswap Router, etc.)

## Known Safe Spenders

| Contract | Chain | Purpose |
|---|---|---|
| Uniswap Universal Router | All EVM | Token swaps |
| Permit2 | All EVM | Gasless approvals |
| OKX DEX Router | All supported | Aggregated swaps |
| Aave Lending Pool | Ethereum, L2s | Lending/borrowing |
| Compound Comptroller | Ethereum | Lending/borrowing |

Any spender not on this list should be evaluated before keeping.
