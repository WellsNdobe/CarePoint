import { useState } from "react";
import {
  FlatList,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import DoctorCard from "@/components/DoctorCard";
import { doctors } from "@/services/mockDoctors";
import { Ionicons } from "@expo/vector-icons";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    specialization: "",
    minPrice: "",
    maxPrice: "",
  });

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation = filters.location
      ? doctor.location.toLowerCase().includes(filters.location.toLowerCase())
      : true;

    const matchesSpecialization = filters.specialization
      ? doctor.specialization.toLowerCase() ===
        filters.specialization.toLowerCase()
      : true;

    return matchesSearch && matchesLocation && matchesSpecialization;
  });

  const specializations = Array.from(
    new Set(doctors.map((doc) => doc.specialization))
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search doctors by name or specialization..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filters Section */}
      <View style={styles.filtersContainer}>
        <Text style={styles.filterTitle}>Filters</Text>
        <View style={styles.filterRow}>
          <TextInput
            style={styles.filterInput}
            placeholder="Location"
            placeholderTextColor="#999"
            value={filters.location}
            onChangeText={(text) => setFilters({ ...filters, location: text })}
          />
          <TextInput
            style={styles.filterInput}
            placeholder="Min Price"
            placeholderTextColor="#999"
            value={filters.minPrice}
            onChangeText={(text) => setFilters({ ...filters, minPrice: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.filterInput}
            placeholder="Max Price"
            placeholderTextColor="#999"
            value={filters.maxPrice}
            onChangeText={(text) => setFilters({ ...filters, maxPrice: text })}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.specializationContainer}>
          {specializations.map((spec) => (
            <TouchableOpacity
              key={spec}
              style={[
                styles.specializationButton,
                filters.specialization === spec && styles.activeSpecialization,
              ]}
              onPress={() =>
                setFilters({
                  ...filters,
                  specialization: filters.specialization === spec ? "" : spec,
                })
              }
            >
              <Text style={styles.specializationText}>{spec}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Doctor List */}
      <FlatList
        data={filteredDoctors}
        contentContainerStyle={{ padding: 16 }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <DoctorCard doctor={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No doctors found.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    paddingHorizontal: 16,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333",
  },
  filtersContainer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2A2A2A",
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  filterInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    fontSize: 14,
    color: "#333",
  },
  specializationContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  specializationButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  activeSpecialization: {
    backgroundColor: "#3B82F6",
  },
  specializationText: {
    fontSize: 14,
    color: "#333",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});
