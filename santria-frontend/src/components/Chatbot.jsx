import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Divider,
  Collapse,
  Alert,
} from "@mui/material";
import {
  Send,
  Chat,
  Close,
  SmartToy,
  Person,
  ExpandMore,
  ExpandLess,
  Help,
  Event,
  People,
  Dashboard,
  CalendarToday,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      setTimeout(() => {
        addBotMessage(
          "Hello! I'm Santria, your healthcare assistant. I can help you with:\n\n" +
            "• Patient registration and management\n" +
            "• Appointment booking and scheduling\n" +
            "• Calendar navigation and viewing\n" +
            "• Dashboard analytics and insights\n" +
            "• General system guidance\n\n" +
            "How can I assist you today?"
        );
      }, 500);
    }
  }, [isOpen]);

  const addBotMessage = (text, suggestions = []) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text,
        sender: "bot",
        timestamp: new Date(),
        suggestions,
      },
    ]);
  };

  const addUserMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text,
        sender: "user",
        timestamp: new Date(),
      },
    ]);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    addUserMessage(userMessage);
    setInputValue("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      processUserMessage(userMessage);
      setIsTyping(false);
    }, 1000);
  };

  const processUserMessage = (message) => {
    const lowerMessage = message.toLowerCase();

    // Patient-related queries
    if (
      lowerMessage.includes("patient") ||
      lowerMessage.includes("register") ||
      lowerMessage.includes("add patient")
    ) {
      addBotMessage(
        "I can help you register a new patient! Here's what you need to know:\n\n" +
          "📋 **Required Information:**\n" +
          "• First Name and Last Name\n" +
          "• Date of Birth\n" +
          "• Gender\n" +
          "• Phone Number\n" +
          "• Email Address\n" +
          "• Address\n" +
          "• Emergency Contact\n\n" +
          "Would you like me to navigate you to the patient registration page?",
        [
          {
            text: "Go to Patient Registration",
            action: () => navigate("/patients"),
          },
          { text: "Show me the form fields", action: () => showFormFields() },
        ]
      );
    }

    // Appointment-related queries
    else if (
      lowerMessage.includes("appointment") ||
      lowerMessage.includes("book") ||
      lowerMessage.includes("schedule")
    ) {
      addBotMessage(
        "Great! I can help you book an appointment. Here's what you need:\n\n" +
          "📅 **Appointment Details:**\n" +
          "• Patient (must be registered)\n" +
          "• Preferred Date and Time\n" +
          "• Doctor/Specialist\n" +
          "• Medical Specialty\n" +
          "• Duration\n" +
          "• Any notes or symptoms\n\n" +
          "Would you like to:\n" +
          "• Book a new appointment\n" +
          "• View the calendar\n" +
          "• Check available slots?",
        [
          { text: "Book Appointment", action: () => navigate("/appointments") },
          { text: "View Calendar", action: () => navigate("/calendar") },
          { text: "Check Availability", action: () => checkAvailability() },
        ]
      );
    }

    // Calendar-related queries
    else if (
      lowerMessage.includes("calendar") ||
      lowerMessage.includes("view") ||
      lowerMessage.includes("schedule")
    ) {
      addBotMessage(
        "The calendar view shows all appointments in a monthly format. You can:\n\n" +
          "📅 **Calendar Features:**\n" +
          "• View all appointments by month\n" +
          "• Click on any date to add new appointments\n" +
          "• Click on appointment chips to view/edit details\n" +
          "• Navigate between months\n" +
          "• See appointment status with color coding\n\n" +
          "Would you like me to take you to the calendar?",
        [
          { text: "Open Calendar", action: () => navigate("/calendar") },
          { text: "Show me how to use it", action: () => showCalendarGuide() },
        ]
      );
    }

    // Dashboard-related queries
    else if (
      lowerMessage.includes("dashboard") ||
      lowerMessage.includes("stats") ||
      lowerMessage.includes("analytics")
    ) {
      addBotMessage(
        "The dashboard provides comprehensive insights about your healthcare system:\n\n" +
          "📊 **Dashboard Features:**\n" +
          "• Today's appointment statistics\n" +
          "• Completion rates and trends\n" +
          "• Interactive charts and visualizations\n" +
          "• Performance metrics\n" +
          "• Quick action buttons\n\n" +
          "The dashboard updates in real-time with your data. Would you like to see it?",
        [
          { text: "Go to Dashboard", action: () => navigate("/") },
          { text: "Explain the charts", action: () => explainCharts() },
        ]
      );
    }

    // Help queries
    else if (
      lowerMessage.includes("help") ||
      lowerMessage.includes("how") ||
      lowerMessage.includes("what")
    ) {
      addBotMessage(
        "I'm here to help! Here are the main things I can assist you with:\n\n" +
          "🤖 **My Capabilities:**\n" +
          "• **Patient Management**: Register, view, and manage patients\n" +
          "• **Appointments**: Book, schedule, and track appointments\n" +
          "• **Calendar**: Navigate and manage the appointment calendar\n" +
          "• **Dashboard**: Understand analytics and statistics\n" +
          "• **Navigation**: Help you find what you're looking for\n\n" +
          "Just ask me about any of these topics!",
        [
          { text: "Patient Management", action: () => navigate("/patients") },
          { text: "Appointments", action: () => navigate("/appointments") },
          { text: "Calendar", action: () => navigate("/calendar") },
          { text: "Dashboard", action: () => navigate("/") },
        ]
      );
    }

    // General queries
    else {
      addBotMessage(
        "I understand you're asking about '" +
          message +
          "'. Let me help you better!\n\n" +
          "Here are some common things I can help with:\n" +
          "• Patient registration and management\n" +
          "• Appointment booking and scheduling\n" +
          "• Calendar navigation\n" +
          "• Dashboard analytics\n" +
          "• System navigation\n\n" +
          "Could you please rephrase your question or choose from the options below?",
        [
          { text: "Patient Help", action: () => navigate("/patients") },
          { text: "Appointment Help", action: () => navigate("/appointments") },
          { text: "Calendar Help", action: () => navigate("/calendar") },
          { text: "Dashboard Help", action: () => navigate("/") },
        ]
      );
    }
  };

  const showFormFields = () => {
    addBotMessage(
      "Here are the detailed form fields for patient registration:\n\n" +
        "**Personal Information:**\n" +
        "• First Name (required)\n" +
        "• Last Name (required)\n" +
        "• Date of Birth (required)\n" +
        "• Gender (required)\n\n" +
        "**Contact Information:**\n" +
        "• Phone Number (required)\n" +
        "• Email Address (required, must be unique)\n" +
        "• Address (required)\n\n" +
        "**Emergency Contact:**\n" +
        "• Emergency Contact Name\n" +
        "• Emergency Contact Phone\n" +
        "• Relationship to Patient\n\n" +
        "**Medical Information:**\n" +
        "• Medical History (optional)\n" +
        "• Insurance Provider (optional)\n" +
        "• Insurance Number (optional)\n\n" +
        "All required fields are marked with an asterisk (*)."
    );
  };

  const checkAvailability = () => {
    addBotMessage(
      "To check appointment availability:\n\n" +
        "1. **Go to Calendar View** - Click on the calendar icon in the navigation\n" +
        "2. **Select a Date** - Click on any date to see available slots\n" +
        "3. **View Existing Appointments** - See what's already scheduled\n" +
        "4. **Book New Appointment** - Click 'New Appointment' button\n\n" +
        "The system will automatically check for conflicts and show available times.\n\n" +
        "Would you like me to take you to the calendar now?",
      [
        { text: "Open Calendar", action: () => navigate("/calendar") },
        { text: "Book Appointment", action: () => navigate("/appointments") },
      ]
    );
  };

  const showCalendarGuide = () => {
    addBotMessage(
      "Here's how to use the calendar effectively:\n\n" +
        "📅 **Calendar Navigation:**\n" +
        "• Use arrow buttons to navigate between months\n" +
        "• Today's date is highlighted in blue\n" +
        "• Current month dates are in dark text\n" +
        "• Other month dates are in lighter text\n\n" +
        "📋 **Appointment Management:**\n" +
        "• Click any date to add a new appointment\n" +
        "• Click on appointment chips to view details\n" +
        "• Color-coded status: Blue (confirmed), Green (completed), Orange (pending), Red (cancelled)\n" +
        "• '+X more' indicates additional appointments\n\n" +
        "🎯 **Quick Actions:**\n" +
        "• 'New Appointment' button for quick booking\n" +
        "• Edit existing appointments by clicking on them\n" +
        "• View full appointment details in popup"
    );
  };

  const explainCharts = () => {
    addBotMessage(
      "The dashboard charts provide valuable insights:\n\n" +
        "📊 **Chart Types:**\n" +
        "• **Pie Chart**: Shows appointment status distribution\n" +
        "• **Area Chart**: Displays 7-day trend analysis\n" +
        "• **Bar Chart**: Status distribution overview\n" +
        "• **Progress Bars**: Completion rates and metrics\n\n" +
        "🎨 **Color Coding:**\n" +
        "• Blue: Confirmed appointments\n" +
        "• Green: Completed appointments\n" +
        "• Orange: Pending appointments\n" +
        "• Red: Cancelled appointments\n\n" +
        "📈 **Key Metrics:**\n" +
        "• Today's total appointments\n" +
        "• Completion rate percentage\n" +
        "• Pending reviews count\n" +
        "• System performance indicators"
    );
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.action) {
      suggestion.action();
    }
    addUserMessage(suggestion.text);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="chat"
        onClick={() => setIsOpen(true)}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 1000,
          background: "linear-gradient(45deg, #1976d2, #42a5f5)",
          boxShadow: "0 4px 20px rgba(25, 118, 210, 0.3)",
          "&:hover": {
            background: "linear-gradient(45deg, #1565c0, #1976d2)",
            transform: "scale(1.05)",
          },
        }}
      >
        <Chat />
      </Fab>

      {/* Chat Dialog */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            height: "80vh",
            maxHeight: "600px",
            borderRadius: 3,
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(45deg, #1976d2, #42a5f5)",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <SmartToy />
          <Typography variant="h6">Santria Healthcare Assistant</Typography>
          <IconButton
            onClick={() => setIsOpen(false)}
            sx={{ color: "white", ml: "auto" }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0, display: "flex", flexDirection: "column" }}>
          {/* Messages Area */}
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: "flex",
                  justifyContent:
                    message.sender === "user" ? "flex-end" : "flex-start",
                  mb: 1,
                }}
              >
                <Paper
                  sx={{
                    maxWidth: "80%",
                    p: 2,
                    borderRadius: 3,
                    background:
                      message.sender === "user"
                        ? "linear-gradient(45deg, #1976d2, #42a5f5)"
                        : "white",
                    color: message.sender === "user" ? "white" : "text.primary",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                    position: "relative",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        mr: 1,
                        bgcolor:
                          message.sender === "user" ? "white" : "#1976d2",
                        color: message.sender === "user" ? "#1976d2" : "white",
                      }}
                    >
                      {message.sender === "user" ? <Person /> : <SmartToy />}
                    </Avatar>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      {message.sender === "user" ? "You" : "Santria"}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      whiteSpace: "pre-line",
                      lineHeight: 1.5,
                    }}
                  >
                    {message.text}
                  </Typography>

                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <Box
                      sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}
                    >
                      {message.suggestions.map((suggestion, index) => (
                        <Chip
                          key={index}
                          label={suggestion.text}
                          size="small"
                          onClick={() => handleSuggestionClick(suggestion)}
                          sx={{
                            cursor: "pointer",
                            "&:hover": {
                              background: "rgba(25, 118, 210, 0.1)",
                            },
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Paper>
              </Box>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    background: "white",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar sx={{ width: 24, height: 24, bgcolor: "#1976d2" }}>
                      <SmartToy />
                    </Avatar>
                    <Typography variant="caption">
                      Santria is typing...
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            )}

            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box sx={{ p: 2, borderTop: "1px solid #e0e0e0" }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                  },
                }}
              />
              <IconButton
                onClick={handleSend}
                disabled={!inputValue.trim()}
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                  "&:disabled": {
                    bgcolor: "#e0e0e0",
                    color: "#757575",
                  },
                }}
              >
                <Send />
              </IconButton>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Chatbot;
