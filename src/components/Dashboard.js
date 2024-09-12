// // src/components/Dashboard.js
// import React, { useEffect, useState } from 'react';
// import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import { auth, db } from '../firebase';
// import TransactionForm from './TransactionForm';
// import TransactionList from './TransactionList';
// import BudgetForm from './BudgetForm';
// import BudgetTracker from './BudgetTracker';
// import Chatbot from './Chatbot'; // Import Chatbot

// const Dashboard = () => {
//   const [totalIncome, setTotalIncome] = useState(0);
//   const [totalExpenses, setTotalExpenses] = useState(0);
//   const [categoryBreakdown, setCategoryBreakdown] = useState({});
//   const [spendingData, setSpendingData] = useState([]);

//   useEffect(() => {
//     const fetchTransactions = async () => {
//       const currentUser = auth.currentUser;
//       if (!currentUser) return;

//       // Query to fetch user transactions
//       const q = query(
//         collection(db, 'transactions'),
//         where('userId', '==', currentUser.uid)
//       );

//       const querySnapshot = await getDocs(q);
//       const transactions = querySnapshot.docs.map((doc) => doc.data());

//       // Calculate total income, expenses, and breakdown by category
//       let income = 0;
//       let expenses = 0;
//       const categoryTotals = {};
//       const spending = [];

//       transactions.forEach((transaction) => {
//         if (transaction.type === 'income') {
//           income += transaction.amount;
//         } else {
//           expenses += transaction.amount;
//         }

//         spending.push({
//           category: transaction.category,
//           amount: transaction.amount,
//         });

//         if (!categoryTotals[transaction.category]) {
//           categoryTotals[transaction.category] = 0;
//         }
//         categoryTotals[transaction.category] += transaction.amount;
//       });

//       setTotalIncome(income);
//       setTotalExpenses(expenses);
//       setCategoryBreakdown(categoryTotals);
//       setSpendingData(spending); // Store spending data for chatbot
//     };

//     fetchTransactions();
//   }, []);

//   const totalSavings = totalIncome - totalExpenses;

//   return (
//     <Box mt={4}>
//       <Typography variant="h4" align="center" gutterBottom>
//         Financial Overview
//       </Typography>

//       {/* Financial Overview Section */}
//       <Grid container spacing={3} justifyContent="center">
//         <Grid item xs={12} md={4}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6">Total Income</Typography>
//               <Typography variant="h4">${totalIncome}</Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6">Total Expenses</Typography>
//               <Typography variant="h4">${totalExpenses}</Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6">Total Savings</Typography>
//               <Typography variant="h4">${totalSavings}</Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Category Breakdown Section */}
//       <Box mt={5}>
//         <Typography variant="h5" align="center">
//           Category Breakdown
//         </Typography>
//         <Grid container spacing={2} justifyContent="center">
//           {Object.keys(categoryBreakdown).map((category) => (
//             <Grid item xs={12} md={3} key={category}>
//               <Card>
//                 <CardContent>
//                   <Typography variant="h6">{category}</Typography>
//                   <Typography variant="h5">
//                     ${categoryBreakdown[category]}
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Box>

//       {/* Add Transaction Form */}
//       <Box mt={5}>
//         <TransactionForm />
//       </Box>

//       {/* Transaction List */}
//       <Box mt={5}>
//         <TransactionList />
//       </Box>

//       {/* Set Budget Form */}
//       <Box mt={5}>
//         <BudgetForm />
//       </Box>

//       {/* Budget Tracker */}
//       <Box mt={5}>
//         <BudgetTracker />
//       </Box>

//       {/* AI Chatbot Section */}
//       <Box mt={5}>
//         {/* <Chatbot spendingData={spendingData} /> */}
//         <Chatbot />
//       </Box>
//     </Box>
//   );
// };

// export default Dashboard;



import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import BudgetForm from './BudgetForm';
import BudgetTracker from './BudgetTracker';
import Chatbot from './Chatbot';

const Dashboard = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [categoryBreakdown, setCategoryBreakdown] = useState({});
  const [spendingData, setSpendingData] = useState([]);
  const [transactionToEdit, setTransactionToEdit] = useState(null); // Used for editing a transaction

  useEffect(() => {
    const fetchTransactions = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      // Query to fetch user transactions
      const q = query(
        collection(db, 'transactions'),
        where('userId', '==', currentUser.uid)
      );

      const querySnapshot = await getDocs(q);
      const transactions = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Calculate total income, expenses, and breakdown by category
      let income = 0;
      let expenses = 0;
      const categoryTotals = {};
      const spending = [];

      transactions.forEach((transaction) => {
        if (transaction.type === 'income') {
          income += transaction.amount;  // Track total income
        } else {
          expenses += transaction.amount; // Track total expenses

          // Only include expenses in the category breakdown
          if (!categoryTotals[transaction.category]) {
            categoryTotals[transaction.category] = 0;
          }
          categoryTotals[transaction.category] += transaction.amount;
        }

        spending.push({
          category: transaction.category,
          amount: transaction.amount,
        });
      });

      setTotalIncome(income);
      setTotalExpenses(expenses);
      setCategoryBreakdown(categoryTotals);  // Updated to only include expenses
      setSpendingData(spending);  // Store spending data for chatbot
    };

    fetchTransactions();
  }, []);

  const totalSavings = totalIncome - totalExpenses;

  // Handler for deleting a transaction
  const handleDeleteTransaction = async (transactionId) => {
    try {
      await deleteDoc(doc(db, 'transactions', transactionId)); // Deletes the transaction from Firestore
      // Optionally, re-fetch the transactions after deletion or remove from state directly
      setSpendingData((prev) => prev.filter((trans) => trans.id !== transactionId));
      alert('Transaction deleted successfully.');
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  return (
    <Box mt={4}>
      <Typography variant="h4" align="center" gutterBottom>
        Financial Overview
      </Typography>

      {/* Financial Overview Section */}
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Income</Typography>
              <Typography variant="h4">${totalIncome}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Expenses</Typography>
              <Typography variant="h4">${totalExpenses}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Savings</Typography>
              <Typography variant="h4">${totalSavings}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Category Breakdown Section */}
      <Box mt={5}>
        <Typography variant="h5" align="center">
          Category Breakdown
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {Object.keys(categoryBreakdown).map((category) => (
            <Grid item xs={12} md={3} key={category}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{category}</Typography>
                  <Typography variant="h5">
                    ${categoryBreakdown[category]}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Add Transaction Form or Edit Transaction Form */}
      <Box mt={5}>
        <TransactionForm transactionToEdit={transactionToEdit} setTransactionToEdit={setTransactionToEdit} />
      </Box>

      {/* Transaction List */}
      <Box mt={5}>
        <TransactionList onDelete={handleDeleteTransaction} onEdit={setTransactionToEdit} /> {/* Pass onDelete */}
      </Box>

      {/* Set Budget Form */}
      <Box mt={5}>
        <BudgetForm />
      </Box>

      {/* Budget Tracker */}
      <Box mt={5}>
        <BudgetTracker />
      </Box>

      {/* AI Chatbot Section */}
      <Box mt={5}>
        <Chatbot />
      </Box>
    </Box>
  );
};

export default Dashboard;
