import { getFinancialAdvice } from "./openaiService"; // OpenAI API handler
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const systemPrompt = `
Financial Manager AI System Prompt

You are an AI assistant designed to help users manage their finances by analyzing their spending data. Your primary goal is to provide personalized financial advice, help users budget, cut costs, and optimize their financial strategies.

Your Capabilities:
1. You have access to the user's transaction data, including categories such as rent, food, entertainment, and more.
2. You use this data to analyze spending patterns and suggest actionable steps for improving the user's financial health.

## Your Responses Should:
1. Be concise, informative, and focus on the user's spending habits.
2. Include specific suggestions for categories where the user can save or adjust their budget.
3. Highlight areas where the user is overspending or where improvements can be made.
`;

export const fetchTransactionsFromFirebase = async () => {
    let resultString = '';
    try {
        const transactionsCollection = collection(db, 'transactions');
        const q = query(transactionsCollection);
        const querySnapshot = await getDocs(q);
        const transactions = [];

        querySnapshot.forEach((doc) => {
            transactions.push(doc.data());
        });

        if (transactions.length > 0) {
            resultString += '\n\nTransaction Data:\n';
            transactions.forEach((transaction) => {
                resultString += `
                Category: ${transaction.category}
                Amount: $${transaction.amount}
                Date: ${transaction.date.toDate().toDateString()}\n\n`;
            });
        } else {
            resultString += '\n\nNo relevant transaction data found in Firebase.';
        }
    } catch (error) {
        console.error('Error fetching transactions from Firebase:', error);
        resultString += '\n\n(Failed to fetch transaction data from Firebase.)';
    }

    return resultString;
};

export const handleFinancialAdvice = async (userMessages) => {
    const lastMessage = userMessages[userMessages.length - 1];
    const transactionData = await fetchTransactionsFromFirebase();
    const messages = [
        { role: "system", content: systemPrompt },
        ...userMessages.slice(0, userMessages.length - 1),
        { role: "user", content: lastMessage.content + transactionData },
    ];

    try {
        const aiResponse = await getFinancialAdvice(messages);
        return aiResponse;
    } catch (error) {
        console.error("Error getting financial advice:", error);
        return "Error getting financial advice.";
    }
};
