import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TextInput, Button, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch(
        'https://www.themealdb.com/api/json/v1/1/filter.php?i'
      );
      const data = await response.json();
      setRecipes(data.meals);
      setFilteredRecipes(data.meals);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      setFilteredRecipes(recipes);
    } else {
      const filtered = recipes.filter((recipe) =>
        recipe.strMeal.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRecipes(filtered);
    }
  };

  const renderRecipeItem = ({ item }) => (
    <View style={styles.recipeItem}>
      <Image source={{ uri: item.strMealThumb }} style={styles.thumbnail} />
      <Text style={styles.title}>{item.strMeal}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -200} 
    >
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search recipes"
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
        />
        <Button title="Search" onPress={handleSearch} />
      </View>
      <FlatList
        data={filteredRecipes}
        renderItem={renderRecipeItem}
        keyExtractor={(item) => item.idMeal}
        style={styles.flatList}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginRight: 10,
    paddingHorizontal: 10,
  },
  recipeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  flatList: {
    flex: 1,
  },
});

export default App;
