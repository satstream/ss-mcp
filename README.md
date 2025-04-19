# Satstream MCP Server

A Model Context Protocol (MCP) server that provides access to Satstream Bitcoin data API.

## Setup

To install dependencies:

```bash
bun install
```

To run with an API key:

```bash
export SATSTREAM_API_KEY="your-api-key-here"
bun run index.ts
```

Or pass the API key as a command line argument:

```bash
bun run index.ts your-api-key-here
```

## About Satstream

[Satstream](https://www.satstream.io) is a comprehensive Bitcoin blockchain API service that provides access to real-time blockchain data, including transactions, addresses, blocks, and specialized data like Ordinals inscriptions and Runes tokens.

### Getting an API Key

To use this MCP server, you'll need a Satstream API key. You can obtain one by:

1. Visiting [Satstream Documentation](https://docs.satstream.io)
2. Signing up for an account
3. Generating an API key from your dashboard

The free tier provides access to basic functionality with rate limits, while paid plans offer higher rate limits and additional features.

## Available MCP Functions

The following MCP functions are available for Bitcoin data queries:

### Address Functions
| Function Name | Description | Parameters |
|---------------|-------------|------------|
| `address_get` | Get detailed information about a Bitcoin address | `address`: Bitcoin address |
| `address_balance_get` | Get balance for a Bitcoin address | `address`: Bitcoin address |
| `address_deltas_get` | Get transaction history for an address | `address`: Bitcoin address, plus optional pagination params |
| `address_validate` | Validate a Bitcoin address | `address`: Bitcoin address |
| `address_outputs_get` | Get UTXOs for a Bitcoin address | `address`: Bitcoin address, `type`: Optional UTXO type filter |
| `address_rune_deltas_get` | Get rune token history for an address | `address`: Bitcoin address, plus optional pagination params |

### Blockchain Functions
| Function Name | Description | Parameters |
|---------------|-------------|------------|
| `block_get` | Get information about a block by hash or height | `identifier`: Block hash or height |
| `blockchain_info` | Get current blockchain stats and network info | `random_string`: Optional dummy parameter |
| `transaction_get` | Get details about a transaction | `txid`: Transaction ID |

### Mempool Functions
| Function Name | Description | Parameters |
|---------------|-------------|------------|
| `mempool_info_get` | Get mempool statistics | `random_string`: Optional dummy parameter |
| `mempool_transactions_get` | List unconfirmed transactions | Optional pagination params |

### Ordinals and Runes Functions
| Function Name | Description | Parameters |
|---------------|-------------|------------|
| `ordinals_inscription_get` | Get data about an ordinals inscription | `inscription_id`: Inscription ID |
| `rune_get` | Get information about a specific rune | `identifier`: Rune name or ID |
| `runes_latest_get` | Get latest runes (first 100) | `random_string`: Optional dummy parameter |
| `runes_page_get` | Get a specific page of runes | `page`: Page number |

## Usage Examples

### Get address information
```javascript
address_get({ address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" })
```

### Validate a Bitcoin address
```javascript
address_validate({ address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" })
```

### Get block information
```javascript
block_get({ identifier: "000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f" })
```

### Get blockchain stats
```javascript
blockchain_info({ random_string: "dummy" })
```

### Get address balance
```javascript
address_balance_get({ address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" })
```

### Get UTXOs for an address, filtered by type
```javascript
address_outputs_get({ 
  address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
  type: "cardinal"
})
```

### Get information about a specific rune
```javascript
rune_get({ identifier: "UNCOMMON•GOODS" })
```

### Get latest runes
```javascript
runes_latest_get({ random_string: "dummy" })
```

## MCP Integration

This server is designed to be used with Cursor or other environments supporting the Model Context Protocol. For detailed function descriptions and usage guidelines, see [function-descriptions.json](./function-descriptions.json).

This project was created using [Bun](https://bun.sh), a fast all-in-one JavaScript runtime.
