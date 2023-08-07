import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import getTransactionHistory from "./TransactionHistoryApi";
import "./TransactionStyles.css";

/**
 * TransactionHistoryComponent displays a list of transaction history for a given address.
 *
 * @param {Object} props - The component's props.
 * @param {string} props.address - The address for which the transaction history will be fetched.
 * @returns {JSX.Element} - The JSX element representing the TransactionHistoryComponent.
 */
const TransactionHistoryComponent = ({ address }) => {
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const transactionsPerPage = 12;

  // Fetch transaction history data when the component mounts or when the address prop changes.
  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        const history = await getTransactionHistory(address);
        setTransactionHistory(history);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching transaction history:", error);
      }
    };

    fetchTransactionHistory();
  }, [address]);

  /**
   * Handles the page change when the user clicks on the pagination buttons.
   * Ensures the current page does not go out of bounds.
   *
   * @param {number} pageNumber - The new page number.
   */
  const handlePageChange = (pageNumber) => {
    setCurrentPage((prevPage) => {
      if (pageNumber < 1) {
        return 1;
      } else if (
        pageNumber > Math.ceil(transactionHistory.length / transactionsPerPage)
      ) {
        return Math.ceil(transactionHistory.length / transactionsPerPage);
      } else {
        return pageNumber;
      }
    });
  };

  /**
   * Handles the click on a transaction item, displaying its details in a modal.
   *
   * @param {Object} transaction - The selected transaction object.
   */
  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
  };

  /**
   * Closes the transaction details modal.
   */
  const handleCloseModal = () => {
    setSelectedTransaction(null);
  };

  // Render a loading screen while fetching data.
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
      </div>
    );
  }

  // Calculate the range of transactions to display on the current page.
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;

  // Reverse the transaction history array to display newest transactions first.
  const reversedTransactionHistory = [...transactionHistory].reverse();

  // Get the transactions to display on the current page.
  const currentTransactions = reversedTransactionHistory.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  return (
    <div className="transaction-history">
      <div className="modal-heading-container">
        <h2 className="header">Transaction History</h2>
      </div>
      <div className="transaction-list">
        {currentTransactions.map((transaction, index) => (
          <div
            key={index}
            className="transaction-item"
            onClick={() => handleTransactionClick(transaction)}
          >
            <div className="transaction-details">
              {transaction.from && (
                <p className="address">From: {transaction.from}</p>
              )}
              {transaction.to && <p className="address">To: {transaction.to}</p>}
              {transaction.value && (
                <p>
                  Value: {transaction.value} {transaction.asset}
                </p>
              )}
            </div>
            {transaction.erc721TokenId && (
              <p className="erc-token">ERC721 Token</p>
            )}
            {transaction.erc1155Metadata &&
              transaction.erc1155Metadata.map((item) => (
                <p key={item.tokenId} className="erc-token">
                  ERC1155 Token
                </p>
              ))}
          </div>
        ))}
      </div>
      <div className="pagination">
        {currentPage > 1 && (
          <button onClick={() => handlePageChange(currentPage - 1)}>
            Previous
          </button>
        )}
        {Array.from({
          length: Math.ceil(transactionHistory.length / transactionsPerPage),
        }).map((_, index) => {
          if (
            index === 0 ||
            index === currentPage - 1 ||
            index === currentPage ||
            index === currentPage + 1 ||
            index ===
              Math.ceil(transactionHistory.length / transactionsPerPage) - 1
          ) {
            return (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={index + 1 === currentPage ? "active" : ""}
              >
                {index + 1}
              </button>
            );
          } else if (
            index === 1 ||
            index ===
              Math.ceil(transactionHistory.length / transactionsPerPage) - 2
          ) {
            return <span key={index}>...</span>;
          }
          return null;
        })}
        {currentPage <
          Math.ceil(transactionHistory.length / transactionsPerPage) && (
          <button onClick={() => handlePageChange(currentPage + 1)}>
            Next
          </button>
        )}
      </div>
      {selectedTransaction && (
        <TransactionModal
          transaction={selectedTransaction}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

TransactionHistoryComponent.propTypes = {
  address: PropTypes.string.isRequired,
};

/**
 * TransactionModal displays the details of a selected transaction in a modal.
 *
 * @param {Object} props - The component's props.
 * @param {Object} props.transaction - The selected transaction object.
 * @param {Function} props.onClose - Function to close the modal.
 * @returns {JSX.Element} - The JSX element representing the TransactionModal.
 */
const TransactionModal = ({ transaction, onClose }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-heading-container">
          <h3 className="header">Transaction Details</h3>
        </div>
        {transaction.blockNum && <p>Block Number: {transaction.blockNum}</p>}
        {transaction.erc721TokenId && <p className="erc-token">ERC721 Token</p>}
        {transaction.erc1155Metadata &&
          transaction.erc1155Metadata.map((item) => (
            <p key={item.tokenId} className="erc-token">
              ERC1155 Token
            </p>
          ))}
        {transaction.tokenId && (
          <p className="token-id">
            Token ID:{" "}
            <span className="token-id-value">{transaction.tokenId}</span>
          </p>
        )}
        {transaction.asset && <p>Asset: {transaction.asset}</p>}
        {transaction.rawContract && (
          <div className="contract-details">
            {transaction.rawContract.address && (
              <p className="contract-address">
                Contract Address: {transaction.rawContract.address}
              </p>
            )}
            {transaction.rawContract.value && (
              <p className="contract-address">
                Raw Transfer Value: {transaction.rawContract.value}
              </p>
            )}
            {transaction.rawContract.decimal && (
              <p>Contract Decimal: {transaction.rawContract.decimal}</p>
            )}
          </div>
        )}
        <div className="open-etherscan">
          <a
            href={`https://etherscan.io/tx/${transaction.hash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open tx in Etherscan
          </a>
        </div>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default TransactionHistoryComponent;
