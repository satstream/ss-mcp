// MCP Server main entry point (Stdio transport, following official SDK examples)
// NOTE: If MCP SDK types are missing, you may need to add a types reference or update the SDK.
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { proxyApiRequest } from "./apiProxy";

const API_KEY = process.env.SATSTREAM_API_KEY || process.argv[2];
if (!API_KEY) {
  console.error("Error: SATSTREAM_API_KEY must be provided as env var or first CLI argument.");
  process.exit(1);
}

const server = new McpServer({
  name: "satstream-bitcoin-mcp-server",
  version: "1.0.0",
});

// GET /address/{address}
server.tool(
  "address_get",
  "Get detailed information about a specific Bitcoin address, including transaction history and UTXO details. Use this when you need comprehensive data about an address.",
  { address: z.string() },
  async (args: { address: string }) => {
    const { address } = args;
    const data = await proxyApiRequest({
      method: "GET",
      path: "/address/{address}",
      pathParams: { address },
      apiKey: API_KEY,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// GET /block/{identifier}
server.tool(
  "block_get",
  "Get detailed information about a specific Bitcoin block by its hash or height. Use this to retrieve block header data, transaction IDs, and mining details.",
  { identifier: z.string() },
  async (args: { identifier: string }) => {
    const { identifier } = args;
    const data = await proxyApiRequest({
      method: "GET",
      path: "/block/{identifier}",
      pathParams: { identifier },
      apiKey: API_KEY,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// GET /blockchain/info
server.tool(
  "blockchain_info",
  "Get current blockchain information including chain height, latest block details, and network status. Use this for obtaining overall Bitcoin network statistics.",
  { random_string: z.string().optional() },
  async () => {
    const data = await proxyApiRequest({
      method: "GET",
      path: "/blockchain/info",
      apiKey: API_KEY,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// GET /address/{address}/balance
server.tool(
  "address_balance_get",
  "Get the total Bitcoin balance (in satoshis) of an address by summing all its deltas. Use this when you only need the balance information without the full address details.",
  { address: z.string() },
  async (args: { address: string }) => {
    const { address } = args;
    const data = await proxyApiRequest({
      method: "GET",
      path: "/address/{address}/balance",
      pathParams: { address },
      apiKey: API_KEY,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// GET /address/{address}/deltas
server.tool(
  "address_deltas_get",
  "Get transaction deltas (inputs and outputs) for a specific Bitcoin address with pagination. Use this to analyze the transaction history of an address with filtering by block height.",
  { 
    address: z.string(),
    page_size: z.number().optional(),
    start_height: z.number().optional(),
    end_height: z.number().optional(),
    cursor: z.string().optional()
  },
  async (args: { 
    address: string;
    page_size?: number;
    start_height?: number;
    end_height?: number;
    cursor?: string;
  }) => {
    const { address, ...queryParams } = args;
    const data = await proxyApiRequest({
      method: "GET",
      path: "/address/{address}/deltas",
      pathParams: { address },
      queryParams,
      apiKey: API_KEY,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// GET /transaction/{txid}
server.tool(
  "transaction_get",
  "Get detailed information about a specific Bitcoin transaction by its transaction ID (txid). Use this to retrieve comprehensive data about inputs, outputs, fees, and confirmation status.",
  { txid: z.string() },
  async (args: { txid: string }) => {
    const { txid } = args;
    const data = await proxyApiRequest({
      method: "GET",
      path: "/transaction/{txid}",
      pathParams: { txid },
      apiKey: API_KEY,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// GET /ordinals/inscription/{inscription_id}
server.tool(
  "ordinals_inscription_get",
  "Get information about a specific Bitcoin Ordinals inscription by its ID. Use this to retrieve metadata about NFT-like inscriptions on Bitcoin, including content type and ownership details.",
  { inscription_id: z.string() },
  async (args: { inscription_id: string }) => {
    const { inscription_id } = args;
    const data = await proxyApiRequest({
      method: "GET",
      path: "/ordinals/inscription/{inscription_id}",
      pathParams: { inscription_id },
      apiKey: API_KEY,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// GET /mempool/info
server.tool(
  "mempool_info_get",
  "Get current Bitcoin mempool statistics including size, transaction count, and fee estimates. Use this to understand the current state of unconfirmed transactions.",
  { random_string: z.string().optional() },
  async () => {
    const data = await proxyApiRequest({
      method: "GET",
      path: "/mempool/info",
      apiKey: API_KEY,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// GET /mempool/transactions
server.tool(
  "mempool_transactions_get",
  "List unconfirmed transactions in the Bitcoin mempool with pagination. Use this to monitor incoming transactions before they are included in a block.",
  { 
    page_size: z.number().optional(),
    cursor: z.string().optional()
  },
  async (args: {
    page_size?: number;
    cursor?: string;
  }) => {
    const data = await proxyApiRequest({
      method: "GET",
      path: "/mempool/transactions",
      queryParams: args,
      apiKey: API_KEY,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// GET /address/{address}/validate
server.tool(
  "address_validate",
  "Validate a Bitcoin address and retrieve information about its format, type, and validity. Use this to check if an address is valid before sending or receiving transactions.",
  { address: z.string() },
  async (args: { address: string }) => {
    const { address } = args;
    const data = await proxyApiRequest({
      method: "GET",
      path: "/address/{address}/validate",
      pathParams: { address },
      apiKey: API_KEY,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// GET /address/{address}/outputs
server.tool(
  "address_outputs_get",
  "Retrieve UTXOs (unspent transaction outputs) held by a specific Bitcoin address with optional type filtering. Use this to get detailed information about available UTXOs for spending or analysis.",
  { 
    address: z.string(),
    type: z.enum(["any", "cardinal", "inscribed", "runic"]).optional()
  },
  async (args: { 
    address: string;
    type?: "any" | "cardinal" | "inscribed" | "runic";
  }) => {
    const { address, ...queryParams } = args;
    const data = await proxyApiRequest({
      method: "GET",
      path: "/address/{address}/outputs",
      pathParams: { address },
      queryParams,
      apiKey: API_KEY,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// GET /address/{address}/deltas/runes
server.tool(
  "address_rune_deltas_get",
  "Get rune deltas (changes in rune balances) for a specific Bitcoin address with pagination. Use this to analyze the history of rune token transfers for an address.",
  { 
    address: z.string(),
    page_size: z.number().optional(),
    start_height: z.number().optional(),
    end_height: z.number().optional(),
    cursor: z.string().optional()
  },
  async (args: { 
    address: string;
    page_size?: number;
    start_height?: number;
    end_height?: number;
    cursor?: string;
  }) => {
    const { address, ...queryParams } = args;
    const data = await proxyApiRequest({
      method: "GET",
      path: "/address/{address}/deltas/runes",
      pathParams: { address },
      queryParams,
      apiKey: API_KEY,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// GET /rune/{identifier}
server.tool(
  "rune_get",
  "Retrieve information about a specific Bitcoin Rune by name or ID (e.g., \"UNCOMMON•GOODS\" or \"1:0\"). Use this to get details about a specific rune token, including supply, minting status, and transactions.",
  { identifier: z.string() },
  async (args: { identifier: string }) => {
    const { identifier } = args;
    const data = await proxyApiRequest({
      method: "GET",
      path: "/rune/{identifier}",
      pathParams: { identifier },
      apiKey: API_KEY,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// GET /runes
server.tool(
  "runes_latest_get",
  "Retrieve information about the last 100 inscribed Bitcoin Runes (first page). Use this to get an overview of the most recently created rune tokens on the Bitcoin blockchain.",
  { random_string: z.string().optional() },
  async () => {
    const data = await proxyApiRequest({
      method: "GET",
      path: "/runes",
      apiKey: API_KEY,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// GET /runes/{page}
server.tool(
  "runes_page_get",
  "Retrieve a specific page of 100 inscribed Bitcoin Runes. Use this for paginated access to the complete list of rune tokens on the blockchain.",
  { page: z.number() },
  async (args: { page: number }) => {
    const { page } = args;
    const data = await proxyApiRequest({
      method: "GET",
      path: "/runes/{page}",
      pathParams: { page: page.toString() },
      apiKey: API_KEY,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// === Additional functions from TASKS.md ===

// GET /blocks
server.tool(
  "blocks_get",
  "Get information about the last 100 Bitcoin blocks. Use this for obtaining an overview of recent blockchain activity including block heights, hashes, and timestamps.",
  { random_string: z.string().optional() },
  async () => {
    const data = await proxyApiRequest({
      method: "GET",
      path: "/blocks",
      apiKey: API_KEY,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// GET /block/raw/{identifier}/hex
server.tool(
  "block_raw_hex_get",
  "Get the raw hexadecimal representation of a specific Bitcoin block by its hash or height. This provides the complete serialized block data in hexadecimal format.",
  { identifier: z.string() },
  async (args: { identifier: string }) => {
    const { identifier } = args;
    const data = await proxyApiRequest({
      method: "GET",
      path: "/block/raw/{identifier}/hex",
      pathParams: { identifier },
      apiKey: API_KEY,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// GET /block/raw/{identifier}/decoded
server.tool(
  "block_raw_decoded_get",
  "Get the full decoded (verbose) representation of a specific Bitcoin block by its hash or height. This provides extensive details about the block structure and contained transactions.",
  { identifier: z.string() },
  async (args: { identifier: string }) => {
    const { identifier } = args;
    const data = await proxyApiRequest({
      method: "GET",
      path: "/block/raw/{identifier}/decoded",
      pathParams: { identifier },
      apiKey: API_KEY,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// GET /inscriptions
server.tool(
  "inscriptions_latest_get",
  "Get the latest Bitcoin Ordinals inscriptions. Use this to retrieve recently created NFT-like inscriptions on the Bitcoin blockchain.",
  { random_string: z.string().optional() },
  async () => {
    const data = await proxyApiRequest({
      method: "GET",
      path: "/inscriptions",
      apiKey: API_KEY,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// GET /inscriptions/{page}
server.tool(
  "inscriptions_page_get",
  "Get a specific page of Bitcoin Ordinals inscriptions. Use this for paginated access to the complete list of inscriptions on the blockchain.",
  { page: z.number() },
  async (args: { page: number }) => {
    const { page } = args;
    const data = await proxyApiRequest({
      method: "GET",
      path: "/inscriptions/{page}",
      pathParams: { page: page.toString() },
      apiKey: API_KEY,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// GET /inscriptions/block/{block_height}
server.tool(
  "inscriptions_block_get",
  "Get all Bitcoin Ordinals inscriptions in a specific block. Use this to analyze the inscriptions created in a particular block height.",
  { block_height: z.number() },
  async (args: { block_height: number }) => {
    const { block_height } = args;
    const data = await proxyApiRequest({
      method: "GET",
      path: "/inscriptions/block/{block_height}",
      pathParams: { block_height: block_height.toString() },
      apiKey: API_KEY,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// GET /inscriptions/block/{block_height}/{page}
server.tool(
  "inscriptions_block_page_get",
  "Get a specific page of Bitcoin Ordinals inscriptions in a particular block. Use this for paginated access to the inscriptions created in a specific block height.",
  { 
    block_height: z.number(),
    page: z.number()
  },
  async (args: { 
    block_height: number;
    page: number;
  }) => {
    const { block_height, page } = args;
    const data = await proxyApiRequest({
      method: "GET",
      path: "/inscriptions/block/{block_height}/{page}",
      pathParams: { 
        block_height: block_height.toString(),
        page: page.toString()
      },
      apiKey: API_KEY,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// GET /output/{outpoint}
server.tool(
  "output_get",
  "Get detailed information about a specific Bitcoin UTXO (unspent transaction output) by its outpoint in the format 'txid:vout'. Use this to retrieve spend status, value, and script details of an output.",
  { outpoint: z.string() },
  async (args: { outpoint: string }) => {
    const { outpoint } = args;
    const data = await proxyApiRequest({
      method: "GET",
      path: "/output/{outpoint}",
      pathParams: { outpoint },
      apiKey: API_KEY,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// GET /tx/{txid}/inscriptions
server.tool(
  "tx_inscriptions_get",
  "Get all Bitcoin Ordinals inscriptions contained in a specific transaction. Use this to analyze the inscriptions created or transferred in a particular transaction.",
  { txid: z.string() },
  async (args: { txid: string }) => {
    const { txid } = args;
    const data = await proxyApiRequest({
      method: "GET",
      path: "/tx/{txid}/inscriptions",
      pathParams: { txid },
      apiKey: API_KEY,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// GET /sat/{number}
server.tool(
  "sat_get",
  "Get information about a specific satoshi by its absolute number (index). Use this to retrieve details about a particular satoshi, including its rarity, block of creation, and inscription status.",
  { number: z.number() },
  async (args: { number: number }) => {
    const { number } = args;
    const data = await proxyApiRequest({
      method: "GET",
      path: "/sat/{number}",
      pathParams: { number: number.toString() },
      apiKey: API_KEY,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// GET /status
server.tool(
  "status_get",
  "Get the current status of the Satstream API server, including uptime, version information, and performance metrics. Use this to check if the API is functioning properly.",
  { random_string: z.string().optional() },
  async () => {
    const data = await proxyApiRequest({
      method: "GET",
      path: "/status",
      apiKey: API_KEY,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// === Additional endpoints from OpenAPI spec that were not yet implemented ===

// GET /blockcount
server.tool(
  "block_count_get",
  "Get the current block height of the Bitcoin blockchain. This returns the height of the latest block that has been processed.",
  { random_string: z.string().optional() },
  async () => {
    const data = await proxyApiRequest({
      method: "GET",
      path: "/blockcount",
      apiKey: API_KEY,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// GET /blockhash
server.tool(
  "latest_blockhash_get",
  "Get the hash of the latest block in the Bitcoin blockchain. Use this to retrieve the most recent block hash.",
  { random_string: z.string().optional() },
  async () => {
    const data = await proxyApiRequest({
      method: "GET",
      path: "/blockhash",
      apiKey: API_KEY,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// GET /blockhash/{block_height}
server.tool(
  "blockhash_by_height_get",
  "Get the hash of a specific Bitcoin block by its height. Use this to convert a block height to its corresponding block hash.",
  { block_height: z.number() },
  async (args: { block_height: number }) => {
    const { block_height } = args;
    const data = await proxyApiRequest({
      method: "GET",
      path: "/blockhash/{block_height}",
      pathParams: { block_height: block_height.toString() },
      apiKey: API_KEY,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// GET /blockheight
server.tool(
  "latest_block_height_get",
  "Get the current height of the Bitcoin blockchain. This returns the height of the latest block that has been processed.",
  { random_string: z.string().optional() },
  async () => {
    const data = await proxyApiRequest({
      method: "GET",
      path: "/blockheight",
      apiKey: API_KEY,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// GET /blocktime
server.tool(
  "latest_blocktime_get",
  "Get the timestamp of the latest block in the Bitcoin blockchain. This returns the UNIX timestamp of when the latest block was mined.",
  { random_string: z.string().optional() },
  async () => {
    const data = await proxyApiRequest({
      method: "GET",
      path: "/blocktime",
      apiKey: API_KEY,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// GET /block/raw/{identifier}/prevout
server.tool(
  "block_raw_prevout_get",
  "Get the full decoded representation of a specific Bitcoin block with prevout information by its hash or height. This provides extensive details about the block including input and output data.",
  { identifier: z.string() },
  async (args: { identifier: string }) => {
    const { identifier } = args;
    const data = await proxyApiRequest({
      method: "GET",
      path: "/block/raw/{identifier}/prevout",
      pathParams: { identifier },
      apiKey: API_KEY,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// GET /block/raw/{identifier}/summary
server.tool(
  "block_raw_summary_get",
  "Get a summary of a specific Bitcoin block by its hash or height. This provides a condensed view of block data without full transaction details.",
  { identifier: z.string() },
  async (args: { identifier: string }) => {
    const { identifier } = args;
    const data = await proxyApiRequest({
      method: "GET",
      path: "/block/raw/{identifier}/summary",
      pathParams: { identifier },
      apiKey: API_KEY,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// GET /inscription/{inscription_id}/{child_index}
server.tool(
  "inscription_child_get",
  "Get information about a specific child of a Bitcoin Ordinals inscription. Use this to retrieve metadata about nested or child inscriptions.",
  { 
    inscription_id: z.string(),
    child_index: z.number()
  },
  async (args: { 
    inscription_id: string;
    child_index: number;
  }) => {
    const { inscription_id, child_index } = args;
    const data = await proxyApiRequest({
      method: "GET",
      path: "/inscription/{inscription_id}/{child_index}",
      pathParams: { 
        inscription_id,
        child_index: child_index.toString()
      },
      apiKey: API_KEY,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// GET /tx/{txid}/raw/decode
server.tool(
  "tx_raw_decode_get",
  "Get a raw Bitcoin transaction with basic decoded information by its transaction ID. This provides the transaction structure and decoded script data.",
  { txid: z.string() },
  async (args: { txid: string }) => {
    const { txid } = args;
    const data = await proxyApiRequest({
      method: "GET",
      path: "/tx/{txid}/raw/decode",
      pathParams: { txid },
      apiKey: API_KEY,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// GET /tx/{txid}/raw/hex
server.tool(
  "tx_raw_hex_get",
  "Get the raw hexadecimal representation of a Bitcoin transaction by its transaction ID. This provides the complete serialized transaction data in hexadecimal format.",
  { txid: z.string() },
  async (args: { txid: string }) => {
    const { txid } = args;
    const data = await proxyApiRequest({
      method: "GET",
      path: "/tx/{txid}/raw/hex",
      pathParams: { txid },
      apiKey: API_KEY,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// GET /tx/{txid}/raw/prevout
server.tool(
  "tx_raw_prevout_get",
  "Get a raw Bitcoin transaction with prevout information by its transaction ID. This provides the transaction with details about the previous outputs being spent.",
  { txid: z.string() },
  async (args: { txid: string }) => {
    const { txid } = args;
    const data = await proxyApiRequest({
      method: "GET",
      path: "/tx/{txid}/raw/prevout",
      pathParams: { txid },
      apiKey: API_KEY,
    });
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

const transport = new StdioServerTransport();
server.connect(transport).then(() => {
  console.log(`MCP stdio server running (Satstream API proxy)`);
}); 