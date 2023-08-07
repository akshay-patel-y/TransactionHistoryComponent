import { Network, Alchemy } from "alchemy-sdk";

/**
 * Retrieves the transaction history for a given address using Alchemy's Transfers API.
 *
 * @param {string} address - The Ethereum address for which to fetch the transaction history.
 * @returns {Promise<Array>} - A Promise that resolves to an array of transactions.
 * @throws {Error} - If an error occurs during the API call or data retrieval.
 */
const getTransactionHistory = async (address) => {
  // Setting the API key and network for the Alchemy SDK
  const settings = {
    apiKey: "qKL9aZ009xCtz1nQCSIRPGfCM-Sqnnbu",
    network: Network.ETH_MAINNET,
  };
  const alchemy = new Alchemy(settings);

  try {
    // Fetching the transaction history for the given address using Alchemy's Transfers API
    const res = await alchemy.core.getAssetTransfers({
      fromBlock: "0x0",
      fromAddress: address,
      category: ["external", "internal", "erc20", "erc721", "erc1155"],
    });

    return res.transfers;
  } catch (e) {
    // Logging the error and throwing it to handle it in the calling code
    console.warn(e);
    throw e;
  }
};

export default getTransactionHistory;
