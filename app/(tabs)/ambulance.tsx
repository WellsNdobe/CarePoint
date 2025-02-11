import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

export default function AmbulanceScreen() {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [eta, setEta] = useState<number | null>(null);
  const [ambulanceRequested, setAmbulanceRequested] = useState(false);
  const [ambulanceLocation, setAmbulanceLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [emergencyType, setEmergencyType] = useState("");
  const fadeAnim = useState(new Animated.Value(0))[0];

  // Request location permission and get current location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission not granted.");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  // Loop the ambulance marker animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Update ETA every minute once ambulance is requested
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (ambulanceRequested) {
      timer = setInterval(() => {
        setEta((prev) => (prev && prev > 0 ? prev - 1 : 0));
      }, 60000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [ambulanceRequested]);

  // Simulate ambulance movement toward the user's location every second
  useEffect(() => {
    let movementInterval: NodeJS.Timeout;
    if (ambulanceRequested && ambulanceLocation && userLocation) {
      movementInterval = setInterval(() => {
        setAmbulanceLocation((prev) => {
          if (!prev) return prev;
          const latDiff = userLocation.latitude - prev.latitude;
          const lonDiff = userLocation.longitude - prev.longitude;
          const factor = 0.05;
          // Snap to user location if very close
          if (Math.abs(latDiff) < 0.0001 && Math.abs(lonDiff) < 0.0001) {
            clearInterval(movementInterval);
            return userLocation;
          }
          return {
            latitude: prev.latitude + latDiff * factor,
            longitude: prev.longitude + lonDiff * factor,
          };
        });
      }, 1000);
    }
    return () => {
      if (movementInterval) clearInterval(movementInterval);
    };
  }, [ambulanceRequested, ambulanceLocation, userLocation]);

  const handleRequestAmbulance = () => {
    if (!emergencyType) {
      Alert.alert(
        "Select Emergency Type",
        "Please select an emergency type first."
      );
      return;
    }
    if (!userLocation) {
      Alert.alert("Location Error", "User location not available.");
      return;
    }
    setAmbulanceRequested(true);
    // Simulate the closest available ambulance starting from a fixed location
    setAmbulanceLocation({
      latitude: userLocation.latitude - 0.01,
      longitude: userLocation.longitude - 0.02,
    });
    setEta(8);
  };

  if (!userLocation) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text>Fetching your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker coordinate={userLocation}>
          <View style={styles.userMarker}>
            <MaterialIcons name="person-pin" size={32} color="#3B82F6" />
          </View>
        </Marker>

        {ambulanceRequested && ambulanceLocation && (
          <Marker coordinate={ambulanceLocation}>
            <Animated.View style={{ opacity: fadeAnim }}>
              <MaterialCommunityIcons
                name="ambulance"
                size={40}
                color="#DC2626"
              />
            </Animated.View>
          </Marker>
        )}
      </MapView>

      <View style={styles.emergencyPanel}>
        <Text style={styles.title}>Emergency Assistance</Text>

        {!ambulanceRequested ? (
          <>
            <View style={styles.emergencyTypeContainer}>
              {["Heart Attack", "Accident", "Stroke", "Other"].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.emergencyButton,
                    emergencyType === type && styles.selectedButton,
                  ]}
                  onPress={() => setEmergencyType(type)}
                >
                  <MaterialCommunityIcons
                    name={
                      type === "Heart Attack"
                        ? "heart-pulse"
                        : type === "Accident"
                        ? "car-brake-alert"
                        : type === "Stroke"
                        ? "brain"
                        : "alert"
                    }
                    size={24}
                    color="#DC2626"
                  />
                  <Text style={styles.buttonText}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.requestButton}
              onPress={handleRequestAmbulance}
            >
              <MaterialCommunityIcons
                name="ambulance"
                size={24}
                color="white"
              />
              <Text style={styles.requestButtonText}>Request Ambulance</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.etaContainer}>
              <Text style={styles.etaText}>Ambulance ETA: {eta} mins</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${100 - (eta! / 8) * 100}%` },
                  ]}
                />
              </View>
            </View>

            <View style={styles.ambulanceInfo}>
              <Text style={styles.infoText}>
                Paramedic Team: Dr. Alice & Team
              </Text>
              <Text style={styles.infoText}>
                Hospital: King Faisal Hospital
              </Text>
              <Text style={styles.infoText}>Vehicle: MEG 1234</Text>
            </View>

            <TouchableOpacity style={styles.callButton}>
              <MaterialCommunityIcons name="phone" size={24} color="white" />
              <Text style={styles.callButtonText}>Contact Paramedics</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { justifyContent: "center", alignItems: "center" },
  map: { flex: 1 },
  userMarker: {
    backgroundColor: "white",
    padding: 4,
    borderRadius: 20,
    borderColor: "#3B82F6",
    borderWidth: 2,
  },
  emergencyPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 5,
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  emergencyTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  emergencyButton: {
    flex: 1,
    alignItems: "center",
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DC2626",
  },
  selectedButton: { backgroundColor: "#FEE2E2" },
  buttonText: { fontSize: 12, marginTop: 4 },
  requestButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DC2626",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  requestButtonText: { color: "white", marginLeft: 8, fontSize: 16 },
  etaContainer: { marginBottom: 12 },
  etaText: { fontSize: 16, fontWeight: "bold" },
  progressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 4,
  },
  progressFill: {
    height: 8,
    backgroundColor: "#DC2626",
  },
  ambulanceInfo: { marginBottom: 12 },
  infoText: { fontSize: 14 },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3B82F6",
    padding: 12,
    borderRadius: 8,
  },
  callButtonText: { color: "white", marginLeft: 8, fontSize: 16 },
});
