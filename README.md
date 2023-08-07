# TransactionHistoryComponent
The "TransactionHistoryComponent" is a React component that fetches and displays the transaction history of a given Ethereum address. It uses the Alchemy SDK to fetch the transaction data and renders it in a paginated list. Users can click on a transaction to view more details in a modal.

Here's how the code works:

The component fetches transaction history using the Alchemy SDK in the useEffect hook.

It uses state variables to manage the fetched data, loading state, current page, and selected transaction.

Transactions are displayed in a paginated list, and users can click on a transaction to view more details in a modal.

The pagination buttons allow users to navigate through the transaction history.

The TransactionModal component displays detailed information about a selected transaction.

Overall, the "TransactionHistoryComponent" provides a simple and user-friendly way to view and explore the transaction history of an Ethereum address.





