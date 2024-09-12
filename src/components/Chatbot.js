import React, { useState } from "react";
import { Box, Typography, TextField, Button, CircularProgress } from "@mui/material";
import { handleFinancialAdvice } from "../services/financialService"; // Import the handler for OpenAI and Firebase

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi, I'm your AI Financial Advisor. How can I help you with your finances today?",
    },
  ]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    setMessages((prevMessages) => [...prevMessages, { role: "user", content: message }]);
    setMessage("");
    setLoading(true);

    try {
      const aiResponse = await handleFinancialAdvice([...messages, { role: "user", content: message }]);
      setMessages((prevMessages) => [...prevMessages, { role: "assistant", content: aiResponse }]);
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: "Error getting financial advice." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box mt={4} maxWidth="600px" mx="auto">
      <Typography variant="h5" align="center">
        AI Financial Advisor
      </Typography>
      <TextField
        fullWidth
        label="Ask me anything about your finances"
        variant="outlined"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={sendMessage}
        fullWidth
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "Send"}
      </Button>

      <Box mt={3}>
        {messages.map((msg, index) => (
          <Typography
            key={index}
            variant={msg.role === "user" ? "body1" : "body2"}
            color={msg.role === "user" ? "textPrimary" : "textSecondary"}
          >
            {msg.role === "user" ? "You: " : "AI: "}
            {msg.content}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default Chatbot;
