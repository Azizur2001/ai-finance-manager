// src/components/BudgetTracker.js
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'; // Firestore methods
import { db, auth } from '../firebase';
import { Box, Typography, LinearProgress, Grid, Card, CardContent } from '@mui/material';

const BudgetTracker = () => {
  const [budgets, setBudgets] = useState([]);
  const [categorySpending, setCategorySpending] = useState({});

  useEffect(() => {
    const fetchBudgetsAndSpending = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      // Fetch budgets from Firestore
      const budgetsQuery = query(
        collection(db, 'budgets'),
        where('userId', '==', currentUser.uid)
      );
      const budgetsSnapshot = await getDocs(budgetsQuery);
      const budgetData = budgetsSnapshot.docs.map((doc) => ({
        category: doc.data().category,
        amount: doc.data().amount,
      }));
      setBudgets(budgetData);

      // Fetch spending for each category
      const spending = {};
      const transactionsQuery = query(
        collection(db, 'transactions'),
        where('userId', '==', currentUser.uid),
        where('type', '==', 'expense')
      );
      const transactionsSnapshot = await getDocs(transactionsQuery);
      transactionsSnapshot.forEach((doc) => {
        const { category, amount } = doc.data();
        if (!spending[category]) spending[category] = 0;
        spending[category] += amount;
      });
      setCategorySpending(spending);
    };

    fetchBudgetsAndSpending();
  }, []);

  return (
    <Box mt={4}>
      <Typography variant="h5" align="center">
        Budget Tracker
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {budgets.map((budget) => {
          const spent = categorySpending[budget.category] || 0;
          const progress = (spent / budget.amount) * 100;
          return (
            <Grid item xs={12} md={4} key={budget.category}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{budget.category}</Typography>
                  <Typography variant="body1">
                    Spent: ${spent} / ${budget.amount}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default BudgetTracker;
