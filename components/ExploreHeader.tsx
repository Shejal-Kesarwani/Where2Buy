import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity, Modal, Image, Dimensions, Button } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const categories = [
  {
    name: 'Shoe Stores',
    icon: 'store',
    images: [
      'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/shoes-discount-sale-video-ads-design-template-5b8bd6b5421a0f223fef251a21fb41e9_screen.jpg?ts=1681109963',
      'https://cdn.create.vista.com/downloads/538df486-9dc5-46e8-b032-c1386496245e_640.jpeg',
      'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/new-arrival-discount-offer-on-shoes-poster-ad-design-template-20e8be063593e460ec1eadf156df2a71_screen.jpg?ts=1607504280'
    ],
  },
  {
    name: 'Clothing',
    icon: 'store',
    images: [
      'https://cdn.confect.io/uploads/media/10.webp',
      'https://i.pinimg.com/564x/cd/54/b3/cd54b3b85ac45a759ed010142c830df3.jpg',
      'https://templates.mediamodifier.com/5d9f0a841e443d3ad53ca8db/mens-fashion-sale-banner-maker.jpg'
    ]
  },
  {
    name: 'Kids Store Offer',
    icon: 'child-friendly',
    images: [
      'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/kids-fashion-limited-time-sale-banner-design-template-bf52bcf63371f6006a98e226335a3109_screen.jpg?ts=1608128068',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaGpqmlqHuojG3kT8e0exp_3ff54CYstIZ6w&s'
    ]
  },
  {
    name: 'Grocery',
    icon: 'local-grocery-store',
    images: [
      'https://www.spencers.in/media/wysiwyg/websiteCreative.jpg',
      'https://img.freepik.com/free-vector/hand-drawn-grocery-shopping-sale-banner_23-2151031432.jpg'
    ]
  },

];

const ExploreHeader = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const showPopup = (images: string[]) => {
    setSelectedImages(images);
    setCurrentImageIndex(0);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedImages([]);
    setModalVisible(false);
  };

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);

    if (index === selectedImages.length) {
      // If the user scrolls past the last image, reset to the first image
      setCurrentImageIndex(0);
      scrollViewRef.current?.scrollTo({ x: 0, animated: false });
    } else {
      setCurrentImageIndex(index);
    }
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
            {categories.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoriesBtn}
                onPress={() => showPopup(item.images || [item.image])}>
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
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              ref={scrollViewRef}
            >
              {selectedImages.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={styles.popupImage}
                />
              ))}
            </ScrollView>
            
            <Button  title="Close" onPress={closeModal} color='#1F4E79'    />
            
          </View>
        </Modal> 
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerss: {
    backgroundColor: '#EAF0F7',
    height: 100,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginTop: 45,
    shadowOffset: {
      width: 1,
      height: 5,
    },
    paddingBottom: 10,
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
    paddingBottom: 10,
  },
  categoriesBtn: {
    alignItems: 'center',
    marginHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  circularIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1F4E79',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderColor: '#fff',
    borderWidth: 2,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'mon-sb',
    color: '#000',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popupImage: {
    width: screenWidth, // Adjust the image size to match the screen width
    height: '90%',
    borderRadius: 10,
    resizeMode: 'contain', // Ensure the image fits within the bounds
  },
 
});

export default ExploreHeader;