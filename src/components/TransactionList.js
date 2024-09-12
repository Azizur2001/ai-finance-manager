// import React, { useState, useEffect } from 'react';
// import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore'; // Import Firestore methods
// import { db, auth } from '../firebase';
// import { Box, Typography, List, ListItem, ListItemText, Paper, Button } from '@mui/material';

// const TransactionList = ({ onEdit }) => { // onEdit prop for editing
//   const [transactions, setTransactions] = useState([]);

//   useEffect(() => {
//     const fetchTransactions = async () => {
//       const currentUser = auth.currentUser;
//       if (!currentUser) return;

//       // Query Firestore to fetch transactions for the logged-in user
//       const q = query(
//         collection(db, 'transactions'),
//         where('userId', '==', currentUser.uid) // Only fetch transactions for this user
//       );

//       const querySnapshot = await getDocs(q);
//       const transactionData = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));

//       setTransactions(transactionData);
//     };

//     fetchTransactions();
//   }, []);

//   const handleDelete = async (transactionId) => {
//     try {
//       await deleteDoc(doc(db, 'transactions', transactionId)); // Deletes the transaction by ID
//       setTransactions(transactions.filter((transaction) => transaction.id !== transactionId)); // Removes from UI
//       alert('Transaction deleted successfully!');
//     } catch (err) {
//       console.error('Error deleting transaction:', err);
//     }
//   };

//   return (
//     <Box mt={4} maxWidth="600px" mx="auto"> {/* Centering the transaction list */}
//       <Typography variant="h5" align="center" gutterBottom>
//         Recent Transactions
//       </Typography>
//       <List>
//         {transactions.map((transaction) => (
//           <ListItem key={transaction.id} sx={{ mb: 2 }}> {/* Adds space between items */}
//             <Paper elevation={3} sx={{ p: 2, width: '100%' }}> {/* Adds a card-like design */}
//               <ListItemText
//                 primary={`${
//                   transaction.type === 'income' ? '+' : '-'
//                 }$${transaction.amount}`}
//                 primaryTypographyProps={{ variant: 'h6', color: transaction.type === 'income' ? 'green' : 'red' }} // Colors for income/expense
//                 secondary={`Category: ${transaction.category}, Date: ${transaction.date.toDate().toDateString()}`}
//               />
//               {/* Edit and Delete Buttons */}
//               <Box mt={2}>
//                 <Button 
//                   variant="contained" 
//                   color="primary" 
//                   onClick={() => onEdit(transaction)} // Pass transaction to edit
//                   sx={{ mr: 2 }}
//                 >
//                   Edit
//                 </Button>
//                 <Button 
//                   variant="contained" 
//                   color="secondary" 
//                   onClick={() => handleDelete(transaction.id)} // Deletes the transaction
//                 >
//                   Delete
//                 </Button>
//               </Box>
//             </Paper>
//           </ListItem>
//         ))}
//       </List>
//     </Box>
//   );
// };

// export default TransactionList;


import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore'; // Import Firestore methods
import { db, auth } from '../firebase';
import { Box, Typography, List, ListItem, ListItemText, Paper, Button } from '@mui/material';

const TransactionList = ({ onDelete, onEdit }) => { // Accept the onDelete and onEdit props
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      // Query Firestore to fetch transactions for the logged-in user
      const q = query(
        collection(db, 'transactions'),
        where('userId', '==', currentUser.uid) // Only fetch transactions for this user
      );

      const querySnapshot = await getDocs(q);
      const transactionData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTransactions(transactionData);
    };

    fetchTransactions();
  }, []);

  return (
    <Box mt={4} maxWidth="600px" mx="auto"> {/* Centering the transaction list */}
      <Typography variant="h5" align="center" gutterBottom>
        Recent Transactions
      </Typography>
      <List>
        {transactions.map((transaction) => (
          <ListItem key={transaction.id} sx={{ mb: 2 }}> {/* Adds space between items */}
            <Paper elevation={3} sx={{ p: 2, width: '100%' }}> {/* Adds a card-like design */}
              <ListItemText
                primary={`${
                  transaction.type === 'income' ? '+' : '-'
                }$${transaction.amount}`}
                primaryTypographyProps={{ variant: 'h6', color: transaction.type === 'income' ? 'green' : 'red' }} // Colors for income/expense
                secondary={`Category: ${transaction.category}, Date: ${transaction.date.toDate().toDateString()}`}
              />
              {/* Edit Button */}
              <Button
                variant="contained"
                color="primary"
                sx={{ mr: 2 }}
                onClick={() => onEdit(transaction)} // Call the onEdit handler
              >
                Edit
              </Button>
              {/* Delete Button */}
              <Button
                variant="contained"
                color="secondary"
                onClick={() => onDelete(transaction.id)} // Call the onDelete handler
              >
                Delete
              </Button>
            </Paper>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TransactionList;
