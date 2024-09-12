// // src/components/TransactionForm.js
// import React, { useState } from 'react';
// import { Box, TextField, Button, Typography, MenuItem } from '@mui/material';
// import { collection, addDoc, Timestamp } from 'firebase/firestore'; // Import Firestore methods
// import { db, auth } from '../firebase'; // Firebase setup

// const TransactionForm = () => {
//   const [amount, setAmount] = useState('');
//   const [type, setType] = useState('income');
//   const [category, setCategory] = useState('');
//   const [error, setError] = useState('');

//   const categories = ['Food', 'Transport', 'Entertainment', 'Rent', 'Other'];

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!amount || !category) {
//       setError('Please fill in all fields.');
//       return;
//     }

//     const currentUser = auth.currentUser;

//     try {
//       // Add transaction to Firestore
//       await addDoc(collection(db, 'transactions'), {
//         userId: currentUser.uid,  // Store the current user's UID
//         amount: parseFloat(amount),
//         type, // 'income' or 'expense'
//         category,
//         date: Timestamp.now(),  // Store the current timestamp
//       });
//       setAmount('');
//       setCategory('');
//       setError('');
//       alert('Transaction added successfully!');
//     } catch (err) {
//       console.error('Error adding transaction:', err);
//       setError('Error adding transaction.');
//     }
//   };

//   return (
//     <Box mt={4} maxWidth="400px" mx="auto">
//       <Typography variant="h5" align="center">
//         Add Transaction
//       </Typography>
//       {error && <Typography color="error">{error}</Typography>}
//       <form onSubmit={handleSubmit}>
//         <TextField
//           fullWidth
//           label="Amount"
//           type="number"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//           margin="normal"
//         />
//         <TextField
//           fullWidth
//           select
//           label="Category"
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//           margin="normal"
//         >
//           {categories.map((option) => (
//             <MenuItem key={option} value={option}>
//               {option}
//             </MenuItem>
//           ))}
//         </TextField>
//         <TextField
//           fullWidth
//           select
//           label="Type"
//           value={type}
//           onChange={(e) => setType(e.target.value)}
//           margin="normal"
//         >
//           <MenuItem value="income">Income</MenuItem>
//           <MenuItem value="expense">Expense</MenuItem>
//         </TextField>
//         <Button variant="contained" color="primary" type="submit" fullWidth>
//           Add Transaction
//         </Button>
//       </form>
//     </Box>
//   );
// };

// export default TransactionForm;



import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, MenuItem } from '@mui/material';
import { collection, addDoc, Timestamp, doc, updateDoc } from 'firebase/firestore'; // Import Firestore methods
import { db, auth } from '../firebase'; // Firebase setup

const TransactionForm = ({ transactionToEdit, setTransactionToEdit }) => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  const categories = ['Food', 'Transport', 'Entertainment', 'Rent', 'Other'];

  useEffect(() => {
    if (transactionToEdit) {
      setAmount(transactionToEdit.amount);
      setType(transactionToEdit.type);
      setCategory(transactionToEdit.category);
    }
  }, [transactionToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !category) {
      setError('Please fill in all fields.');
      return;
    }

    const currentUser = auth.currentUser;

    try {
      if (transactionToEdit) {
        // Update the transaction in Firestore
        await updateDoc(doc(db, 'transactions', transactionToEdit.id), {
          amount: parseFloat(amount),
          type,
          category,
        });
        alert('Transaction updated successfully!');
        setTransactionToEdit(null); // Reset the form after edit
      } else {
        // Add transaction to Firestore
        await addDoc(collection(db, 'transactions'), {
          userId: currentUser.uid,  // Store the current user's UID
          amount: parseFloat(amount),
          type, // 'income' or 'expense'
          category,
          date: Timestamp.now(),  // Store the current timestamp
        });
        alert('Transaction added successfully!');
      }

      // Reset form fields
      setAmount('');
      setCategory('');
      setType('income');
      setError('');
    } catch (err) {
      console.error('Error adding/updating transaction:', err);
      setError('Error adding/updating transaction.');
    }
  };

  return (
    <Box mt={4} maxWidth="400px" mx="auto">
      <Typography variant="h5" align="center">
        {transactionToEdit ? 'Edit Transaction' : 'Add Transaction'}
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          margin="normal"
        >
          {categories.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          select
          label="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          margin="normal"
        >
          <MenuItem value="income">Income</MenuItem>
          <MenuItem value="expense">Expense</MenuItem>
        </TextField>
        <Button variant="contained" color="primary" type="submit" fullWidth>
          {transactionToEdit ? 'Update Transaction' : 'Add Transaction'}
        </Button>
      </form>
    </Box>
  );
};

export default TransactionForm;
