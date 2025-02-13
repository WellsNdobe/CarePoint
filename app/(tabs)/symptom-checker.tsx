import { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: "sk-cd3c7b4e402949b1aa22a71d17fe6a31", // Get from DeepSeek platform
});

const exampleSymptoms = [
  "Headache",
  "Fever",
  "Cough",
  "Stomach pain",
  "Fatigue",
  "Dizziness",
  "Chest pain",
  "Shortness of breath",
  "Nausea",
  "Sore throat",
];

export default function SymptomCheckerScreen() {
  const [query, setQuery] = useState("");
  const [conversation, setConversation] = useState<
    { sender: "user" | "bot"; message: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = async () => {
    if (!query.trim()) return;

    Keyboard.dismiss();
    const userMessage = query;
    setConversation((prev) => [
      ...prev,
      { sender: "user", message: userMessage },
    ]);
    setQuery("");
    setLoading(true);

    try {
      const completion = await openai.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              "You are a medical assistant. Respond clearly and concisely. Include potential conditions, recommendations for professional care, and disclaimer that this is not medical advice.",
          },
          { role: "user", content: userMessage },
        ],
      });

      const answer =
        completion.choices[0]?.message?.content ||
        "I couldn't process that. Could you please rephrase?";
      setConversation((prev) => [...prev, { sender: "bot", message: answer }]);
    } catch (error) {
      console.error("API Error:", error);
      setConversation((prev) => [
        ...prev,
        {
          sender: "bot",
          message:
            "Insufficient Balance. Please top up your account for the API",
        },
      ]);
    } finally {
      setLoading(false);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  };

  const handleExampleSymptomClick = (symptom: string) => {
    setQuery(symptom);
  };

  const handleClearConversation = () => {
    setConversation([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Symptom Checker</Text>
        <Text style={styles.disclaimer}>
          Note: AI suggestions are not medical advice. Consult a doctor for
          serious concerns.
        </Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.conversationContainer}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {conversation.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              msg.sender === "user" ? styles.userBubble : styles.botBubble,
            ]}
          >
            <Text style={styles.messageText}>{msg.message}</Text>
          </View>
        ))}
        {loading && (
          <View style={[styles.messageBubble, styles.botBubble]}>
            <ActivityIndicator size="small" color="#666" />
          </View>
        )}
      </ScrollView>

      <View style={styles.exampleSymptomsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {exampleSymptoms.map((symptom, index) => (
            <TouchableOpacity
              key={index}
              style={styles.exampleSymptomButton}
              onPress={() => handleExampleSymptomClick(symptom)}
            >
              <Text style={styles.exampleSymptomText}>{symptom}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Describe your symptoms..."
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
          multiline
          editable={!loading}
        />
        <TouchableOpacity
          style={[styles.sendButton, loading && styles.disabledButton]}
          onPress={handleSend}
          disabled={loading}
        >
          <Text style={styles.sendButtonText}>➔</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.clearButton}
        onPress={handleClearConversation}
      >
        <Text style={styles.clearButtonText}>Clear Conversation</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#2A2A2A",
    marginBottom: 4,
  },
  disclaimer: {
    fontSize: 12,
    color: "#E74C3C",
    lineHeight: 16,
  },
  conversationContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContainer: {
    paddingTop: 16,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
    borderColor: "#B3DF85",
    borderWidth: 1,
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderColor: "#E0E0E0",
    borderWidth: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    color: "#333",
  },
  exampleSymptomsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#fff",
  },
  exampleSymptomButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#E3F2FD",
    marginRight: 8,
  },
  exampleSymptomText: {
    fontSize: 14,
    color: "#1976D2",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  input: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 120,
    marginRight: 8,
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#BDBDBD",
  },
  sendButtonText: {
    color: "white",
    fontSize: 20,
    marginLeft: 4,
  },
  clearButton: {
    alignSelf: "center",
    marginVertical: 16,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#FFEBEE",
  },
  clearButtonText: {
    color: "#D32F2F",
    fontSize: 14,
    fontWeight: "500",
  },
});
