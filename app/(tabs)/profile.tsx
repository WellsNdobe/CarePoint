// components/profile/ProfilePage.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "firebase/auth";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.email);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setFirstName(userData.firstName || "");
            setLastName(userData.lastName || "");
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!user) return;

    try {
      // Update Firestore document
      const userDocRef = doc(db, "users", user.email);
      await updateDoc(userDocRef, {
        firstName,
        lastName,
      });

      // Update Firebase Authentication display name
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });

      setEditing(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile: ", error);
      Alert.alert("Error", "Failed to update profile");
    }
  };

  const renderEditableField = (
    label: string,
    value: string,
    setter: (value: string) => void
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {editing ? (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setter}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      ) : (
        <Text style={styles.fieldValue}>{value || "Not set"}</Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Profile Header */}
        <View style={styles.header}>
          <Ionicons name="person-circle" size={80} color="#3B82F6" />
          <View style={styles.nameContainer}>
            {editing ? (
              <>
                <TextInput
                  style={[styles.nameInput, styles.editingName]}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="First Name"
                />
                <TextInput
                  style={[styles.nameInput, styles.editingName]}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Last Name"
                />
              </>
            ) : (
              <>
                <Text style={styles.name}>
                  {firstName} {lastName}
                </Text>
                <Text style={styles.email}>{user?.email}</Text>
              </>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {editing ? (
            <>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleUpdateProfile}
              >
                <Ionicons name="checkmark-circle" size={24} color="white" />
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditing(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEditing(true)}
            >
              <Ionicons name="pencil" size={20} color="white" />
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Profile Details */}
        <View style={styles.detailsContainer}>
          {renderEditableField("First Name", firstName, setFirstName)}
          {renderEditableField("Last Name", lastName, setLastName)}

          {/* Add more fields here as needed */}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out" size={24} color="#ef4444" />
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  nameContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1e293b",
  },
  editingName: {
    fontSize: 22,
    fontWeight: "600",
    marginVertical: 4,
  },
  email: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 4,
  },
  buttonContainer: {
    marginBottom: 30,
    alignItems: "center",
  },
  editButton: {
    flexDirection: "row",
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    gap: 8,
  },
  saveButton: {
    flexDirection: "row",
    backgroundColor: "#10b981",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  cancelButton: {
    padding: 8,
  },
  cancelButtonText: {
    color: "#64748b",
    fontWeight: "500",
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
  },
  detailsContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    color: "#64748b",
    fontSize: 14,
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: "#1e293b",
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f8fafc",
  },
  nameInput: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    width: "80%",
    textAlign: "center",
    backgroundColor: "#f8fafc",
  },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    gap: 8,
  },
  logoutButtonText: {
    color: "#ef4444",
    fontWeight: "500",
    fontSize: 16,
  },
});

export default ProfilePage;
