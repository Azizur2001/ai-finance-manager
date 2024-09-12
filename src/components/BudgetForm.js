// src/components/BudgetForm.js
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, MenuItem } from '@mui/material';
import { collection, setDoc, doc } from 'firebase/firestore'; // Firestore methods
import { db, auth } from '../firebase';

const BudgetForm = () => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const categories = ['Food', 'Transport', 'Entertainment', 'Rent', 'Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !category) {
      setError('Please fill in all fields.');
      return;
    }

    const currentUser = auth.currentUser;

    try {
      // Add or update the user's budget for the selected category
      await setDoc(doc(db, 'budgets', `${currentUser.uid}_${category}`), {
        userId: currentUser.uid,
        category,
        amount: parseFloat(amount),
      });
      setAmount('');
      setCategory('');
      setError('');
      alert('Budget set successfully!');
    } catch (err) {
      console.error('Error setting budget:', err);
      setError('Error setting budget.');
    }
  };

  return (
    <Box mt={4} maxWidth="400px" mx="auto">
      <Typography variant="h5" align="center">
        Set Budget
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
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
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          margin="normal"
        />
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Set Budget
        </Button>
      </form>
    </Box>
  );
};

export default BudgetForm;
