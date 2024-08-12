import React, { useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity, Modal, Image, Button, TextInput, FlatList } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const categories = [
  {
    name: 'Shoe Stores',
    icon: 'store',
    image: 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/shoes-discount-sale-video-ads-design-template-5b8bd6b5421a0f223fef251a21fb41e9_screen.jpg?ts=1681109963',
  },
  {
    name: 'Clothing',
    icon: 'store',
    image: 'https://cdn.confect.io/uploads/media/10.webp',
  },
  {
    name: 'Kids Store Offer',
    icon: 'child-friendly',
    image: 'https://i.pinimg.com/736x/80/56/1e/80561e0b40d3b3270ae86e6667d95482.jpg',
  },
  {
    name: 'Grocery',
    icon: 'local-grocery-store',
    image: 'https://spencers.in/media/wysiwyg/websiteCreative.jpg',
  }
  // Add more categories as needed
];

const ExploreHeader = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const navigation = useNavigation(); // Use navigation hook

  const showPopup = (image: string) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setModalVisible(false);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setSuggestionsVisible(true);
    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  const handleKeyPress = (event: any) => {
    if (event.nativeEvent.key === 'Enter') {
      const selectedCategory = filteredCategories.find(category =>
        category.name.toLowerCase() === searchQuery.toLowerCase()
      );
      if (selectedCategory) {
        navigation.navigate('CategoryScreen', { category: selectedCategory.name }); // Navigate to the category screen
      }
    }
  };

  const handleSuggestionPress = (categoryName: string) => {
    navigation.navigate('CategoryScreen', { category: categoryName }); // Navigate to the category screen
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <View style={styles.containerss}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              alignItems: 'center',
              paddingHorizontal: 16,
            }}>
            {filteredCategories.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoriesBtn}
                onPress={() => showPopup(item.image)}>
                <View style={styles.circularIcon}>
                  <MaterialIcons
                    name={item.icon as any}
                    size={24}
                    color='#fff'
                  />
                </View>
                <Text style={styles.categoryText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}>
          <View style={styles.modalView}>
            <Image source={{ uri: selectedImage }} style={styles.popupImage} />
            <Button title="Close" onPress={closeModal} />
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerss: {
    backgroundColor: '#fff',
    height: 80,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginTop: 60,
    shadowOffset: {
      width: 1,
      height: 5,
    },
  },
  container: {
    backgroundColor: '#fff',
    height: 140,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    },
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
    marginTop: 60,
  },
  searchBtn: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    gap: 10,
    padding: 14,
    alignItems: 'center',
    width: 280,
    height: 50,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#c2c2c2',
    borderRadius: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  categoriesBtn: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  circularIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'purple',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'mon-sb',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popupImage: {
    width: 400,
    height: 400,
    borderRadius: 10,
  },
  suggestionsList: {
    position: 'absolute',
    top: 60, // Adjust based on the height of your search bar
    left: 24,
    right: 24,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#c2c2c2',
    borderRadius: 8,
    elevation: 2,
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#c2c2c2',
  },
});

export default ExploreHeader;
