import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { saveGrievance } from '../../dataStorage';

const CATEGORIES = [
  { id: '1', name: 'Technical', icon: 'cpu', color: '#6366F1' },
  { id: '2', name: 'Administrative', icon: 'file-text', color: '#F59E0B' },
  { id: '3', name: 'Academics', icon: 'book', color: '#8B5CF6' },
  { id: '4', name: 'Hostel', icon: 'user', color: '#06B6D4' }
];

const PRIORITIES = [
  { id: '1', name: 'Low', color: '#10B981' },
  { id: '2', name: 'Medium', color: '#F59E0B' },
  { id: '3', name: 'High', color: '#EF4444' }
];

interface AttachmentItem {
  id: string;
  uri: string;
  type: 'image' | 'document';
  name: string;
  size?: number;
}

export default function SubmitGrievanceScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [isAttachmentModalVisible, setAttachmentModalVisible] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSelectCategory = (selectedCategory: string) => {
    setCategory(selectedCategory);
    setCategoryModalVisible(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // ✅ Clear form function
  const clearForm = () => {
    setTitle('');
    setCategory('');
    setDescription('');
    setPriority('Medium');
    setIsAnonymous(false);
    setAttachments([]);
  };

  const handleSubmit = async () => {
    if (!title || !category || !description) {
      Alert.alert("Missing Information", "Please fill out all required fields.");
      return;
    }

    // ✅ Store values before clearing
    const submittedData = {
      title,
      category,
      priority,
      description,
      attachmentCount: attachments.length
    };

    try {
      // Save to local storage
      await saveGrievance({
        title,
        category,
        priority,
        description
      });

      // ✅ Clear form IMMEDIATELY after successful save
      clearForm();

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      Alert.alert(
        "Success! 🎉",
        `Your grievance has been submitted successfully.\n\n📋 Title: ${submittedData.title}\n📂 Category: ${submittedData.category}\n⚡ Priority: ${submittedData.priority}\n📎 Attachments: ${submittedData.attachmentCount}\n\nYou can track its progress in the Track tab.`,
        [
          { 
            text: "View in Track", 
            onPress: () => {
              router.push('/track');
            }
          },
          {
            text: "Submit Another",
            onPress: () => {
              // Form is already cleared, ready for next submission!
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to submit grievance. Please try again.");
    }
  };

  const pickImageFromCamera = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "Camera permission is required to take photos.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const newAttachment: AttachmentItem = {
        id: Date.now().toString(),
        uri: result.assets[0].uri,
        type: 'image',
        name: `Photo_${Date.now()}.jpg`,
        size: result.assets[0].fileSize,
      };
      setAttachments([...attachments, newAttachment]);
      setAttachmentModalVisible(false);
    }
  };

  const pickImageFromGallery = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "Gallery permission is required to select photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const newAttachment: AttachmentItem = {
        id: Date.now().toString(),
        uri: result.assets[0].uri,
        type: 'image',
        name: `Image_${Date.now()}.jpg`,
        size: result.assets[0].fileSize,
      };
      setAttachments([...attachments, newAttachment]);
      setAttachmentModalVisible(false);
    }
  };

  const removeAttachment = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAttachments(attachments.filter(item => item.id !== id));
  };

  const getCategoryIcon = (categoryName: string) => {
    const cat = CATEGORIES.find(c => c.name === categoryName);
    return cat ? cat.icon : 'tag';
  };

  const getCategoryColor = (categoryName: string) => {
    const cat = CATEGORIES.find(c => c.name === categoryName);
    return cat ? cat.color : '#6366F1';
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      <View style={styles.background}>
        <SafeAreaView style={styles.safeArea}>
          <Animated.View 
            style={[
              styles.content,
              { opacity: fadeAnim }
            ]}
          >
            
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Submit Grievance</Text>
              <Text style={styles.headerSubtitle}>
                We're here to help resolve your concerns
              </Text>
            </View>

            <ScrollView 
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
            >
              
              {/* Title Input */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Title *</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Brief description of your issue"
                    placeholderTextColor="#94A3B8"
                    value={title}
                    onChangeText={setTitle}
                  />
                </View>
              </View>

              {/* Category Selection */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Category *</Text>
                <TouchableOpacity 
                  style={styles.categorySelector}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setCategoryModalVisible(true);
                  }}
                >
                  <View style={styles.categoryContent}>
                    {category ? (
                      <View style={styles.selectedCategory}>
                        <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(category) + '15' }]}>
                          <Feather name={getCategoryIcon(category) as any} size={20} color={getCategoryColor(category)} />
                        </View>
                        <Text style={styles.categoryText}>{category}</Text>
                      </View>
                    ) : (
                      <Text style={styles.categoryPlaceholder}>Select Category</Text>
                    )}
                    <Feather name="chevron-down" size={20} color="#94A3B8" />
                  </View>
                </TouchableOpacity>
              </View>

              {/* Priority Selection */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Priority Level</Text>
                <View style={styles.priorityContainer}>
                  {PRIORITIES.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.priorityButton,
                        priority === item.name && { 
                          backgroundColor: item.color + '15',
                          borderColor: item.color + '30'
                        }
                      ]}
                      onPress={() => {
                        setPriority(item.name);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                    >
                      <View style={[styles.priorityDot, { backgroundColor: item.color }]} />
                      <Text style={[
                        styles.priorityLabel,
                        priority === item.name && { color: item.color, fontWeight: '600' }
                      ]}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Description Input */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Description *</Text>
                <View style={[styles.inputContainer, styles.descriptionContainer]}>
                  <TextInput
                    style={[styles.textInput, styles.descriptionInput]}
                    placeholder="Provide detailed information about your grievance..."
                    placeholderTextColor="#94A3B8"
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                    value={description}
                    onChangeText={setDescription}
                  />
                </View>
                <Text style={styles.characterCount}>{description.length}/500</Text>
              </View>

              {/* Enhanced Attachments Section */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>
                  Attachments ({attachments.length})
                  {attachments.length > 0 && <Text style={styles.optionalText}> • Tap to view</Text>}
                </Text>
                
                {/* Attachment Preview */}
                {attachments.length > 0 && (
                  <View style={styles.attachmentPreview}>
                    {attachments.map((attachment) => (
                      <View key={attachment.id} style={styles.attachmentItem}>
                        <Image source={{ uri: attachment.uri }} style={styles.attachmentImage} />
                        <View style={styles.attachmentInfo}>
                          <Text style={styles.attachmentName}>{attachment.name}</Text>
                          <Text style={styles.attachmentSize}>{formatFileSize(attachment.size)}</Text>
                        </View>
                        <TouchableOpacity 
                          style={styles.removeButton}
                          onPress={() => removeAttachment(attachment.id)}
                        >
                          <Feather name="x" size={16} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}

                <TouchableOpacity 
                  style={styles.attachmentButton} 
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setAttachmentModalVisible(true);
                  }}
                >
                  <View style={styles.attachmentContent}>
                    <Feather name="camera" size={24} color="#6366F1" />
                    <Text style={styles.attachmentText}>Add Photos</Text>
                    <Text style={styles.attachmentSubtext}>Camera or Gallery</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Anonymous Toggle */}
              <View style={styles.toggleSection}>
                <View style={styles.toggleContainer}>
                  <View>
                    <Text style={styles.toggleTitle}>Submit Anonymously</Text>
                    <Text style={styles.toggleSubtitle}>Your identity will be kept private</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.toggle, isAnonymous && styles.toggleActive]}
                    onPress={() => {
                      setIsAnonymous(!isAnonymous);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <View style={[styles.toggleThumb, isAnonymous && styles.toggleThumbActive]} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <View style={styles.submitContent}>
                  <Feather name="send" size={20} color="white" />
                  <Text style={styles.submitText}>Submit Grievance</Text>
                </View>
              </TouchableOpacity>

            </ScrollView>
          </Animated.View>
        </SafeAreaView>
      </View>

      {/* Category Modal */}
      <Modal
        visible={isCategoryModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setCategoryModalVisible(false)}>
                <Feather name="x" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.categoryList}>
              {CATEGORIES.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.categoryOption}
                  onPress={() => handleSelectCategory(item.name)}
                >
                  <View style={[styles.categoryIcon, { backgroundColor: item.color + '15' }]}>
                    <Feather name={item.icon as any} size={20} color={item.color} />
                  </View>
                  <Text style={styles.categoryOptionText}>{item.name}</Text>
                  <Feather name="chevron-right" size={16} color="#94A3B8" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Attachment Options Modal */}
      <Modal
        visible={isAttachmentModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Photo</Text>
              <TouchableOpacity onPress={() => setAttachmentModalVisible(false)}>
                <Feather name="x" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.attachmentOptions}>
              <TouchableOpacity style={styles.attachmentOptionButton} onPress={pickImageFromCamera}>
                <View style={[styles.attachmentOptionIcon, { backgroundColor: '#EF444415' }]}>
                  <Feather name="camera" size={32} color="#EF4444" />
                </View>
                <Text style={styles.attachmentOptionTitle}>Take Photo</Text>
                <Text style={styles.attachmentOptionSubtitle}>Use camera to capture evidence</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.attachmentOptionButton} onPress={pickImageFromGallery}>
                <View style={[styles.attachmentOptionIcon, { backgroundColor: '#6366F115' }]}>
                  <Feather name="image" size={32} color="#6366F1" />
                </View>
                <Text style={styles.attachmentOptionTitle}>Choose from Gallery</Text>
                <Text style={styles.attachmentOptionSubtitle}>Select existing photos</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  optionalText: {
    color: '#64748B',
    fontWeight: '400',
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  textInput: {
    padding: 16,
    fontSize: 16,
    color: '#1E293B',
    minHeight: 56,
  },
  descriptionContainer: {
    marginBottom: 8,
  },
  descriptionInput: {
    minHeight: 120,
  },
  characterCount: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'right',
  },
  categorySelector: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  selectedCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  categoryPlaceholder: {
    fontSize: 16,
    color: '#94A3B8',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  priorityLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  attachmentPreview: {
    marginBottom: 12,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  attachmentImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  attachmentInfo: {
    flex: 1,
  },
  attachmentName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 2,
  },
  attachmentSize: {
    fontSize: 12,
    color: '#64748B',
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachmentButton: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  attachmentContent: {
    alignItems: 'center',
    padding: 24,
    gap: 8,
  },
  attachmentText: {
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '600',
  },
  attachmentSubtext: {
    fontSize: 12,
    color: '#94A3B8',
  },
  toggleSection: {
    marginBottom: 32,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  toggleSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: '#6366F1',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  submitButton: {
    marginBottom: 40,
    borderRadius: 16,
    backgroundColor: '#6366F1',
    shadowColor: '#6366F1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  submitContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    gap: 12,
  },
  submitText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  categoryList: {
    maxHeight: 400,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  categoryOptionText: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  attachmentOptions: {
    padding: 20,
    gap: 16,
  },
  attachmentOptionButton: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  attachmentOptionIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  attachmentOptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  attachmentOptionSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
});
