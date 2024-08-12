import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { categories } from './path-to-categories-file'; // Adjust the path as needed

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const navigation = useNavigation();

  const handleSearch = (text: string) => {
    setQuery(text);
    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  const handleCategoryPress = (categoryName: string) => {
    navigation.navigate('CategoryDetailsScreen', { categoryName });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search categories"
        value={query}
        onChangeText={handleSearch}
      />
      <ScrollView>
        {filteredCategories.length > 0 ? (
          filteredCategories.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryItem}
              onPress={() => handleCategoryPress(item.name)}
            >
              <Text style={styles.categoryText}>{item.name}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text>No categories found.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  categoryItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  categoryText: {
    fontSize: 16,
  },
});

export default SearchScreen;
