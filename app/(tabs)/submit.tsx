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

// Grievance Categories with Subcategories
const GRIEVANCE_CATEGORIES = [
  {
    id: 'academics',
    name: 'Academics',
    color: '#8B5CF6',
    icon: 'book',
    subcategories: [
      'Faculty behavior or teaching issues',
      'Attendance discrepancies',
      'Internal marks / lab marks disputes',
      'Syllabus coverage or delay',
      'Exam schedule or revaluation issues',
      'Subject change or elective confusion',
      'Class timing clash',
    ],
  },
  {
    id: 'administrative',
    name: 'Administrative',
    color: '#F59E0B',
    icon: 'file-text',
    subcategories: [
      'Fee payment or refund issues',
      'Bonafide / certificate requests',
      'ID card or document correction',
      'Department coordination issues',
      'Late form submissions',
      'Internship or training approvals',
    ],
  },
  {
    id: 'technical',
    name: 'Technical',
    color: '#6366F1',
    icon: 'cpu',
    subcategories: [
      'Website / portal login issues',
      'Server downtime / form not loading',
      'Email or Wi-Fi not working',
      'College ERP or attendance portal bugs',
      'Lab system malfunction',
      'Network connectivity issues',
    ],
  },
  {
    id: 'hostel',
    name: 'Hostel',
    color: '#06B6D4',
    icon: 'home',
    subcategories: [
      'Room allocation or change request',
      'Water or electricity issue',
      'Mess food quality or timing',
      'Warden / staff behavior',
      'Cleanliness or maintenance delay',
      'Security / curfew concerns',
    ],
  },
  {
    id: 'library',
    name: 'Library',
    color: '#10B981',
    icon: 'book-open',
    subcategories: [
      'Book availability or delay in issue',
      'Library card problems',
      'Fine disputes',
      'System login issues',
      'Reading area maintenance',
    ],
  },
  {
    id: 'transport',
    name: 'Transport',
    color: '#F43F5E',
    icon: 'truck',
    subcategories: [
      'Bus timing / delay',
      'Route change request',
      'Driver / staff behavior',
      'Vehicle condition / seating issue',
      'Pass renewal or lost pass',
    ],
  },
  {
    id: 'canteen',
    name: 'Canteen / Food',
    color: '#EAB308',
    icon: 'coffee',
    subcategories: [
      'Food quality or hygiene issue',
      'Overpricing or billing error',
      'Menu variety / nutrition concern',
      'Staff misbehavior',
      'Waste management',
    ],
  },
  {
    id: 'security',
    name: 'Security',
    color: '#3B82F6',
    icon: 'shield',
    subcategories: [
      'Lost belongings',
      'Entry / exit disputes',
      'ID verification problems',
      'Misbehavior / harassment complaint',
      'Emergency response delay',
    ],
  },
  {
    id: 'cleanliness',
    name: 'Cleanliness / Maintenance',
    color: '#22C55E',
    icon: 'trash-2',
    subcategories: [
      'Washroom cleaning',
      'Classroom / corridor cleaning',
      'Garden or campus waste',
      'Equipment repair delay',
      'Pest control needed',
    ],
  },
  {
    id: 'others',
    name: 'Others',
    color: '#94A3B8',
    icon: 'tag',
    subcategories: [
      'Suggestions / improvements',
      'Event management complaints',
      'Student club / fest issues',
      'Power cut or water outage',
      'Other unspecified concern',
    ],
  },
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
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [isSubcategoryModalVisible, setSubcategoryModalVisible] = useState(false);
  const [isAttachmentModalVisible, setAttachmentModalVisible] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const successFadeAnim = useRef(new Animated.Value(0)).current;
  const successScaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const currentCategory = GRIEVANCE_CATEGORIES.find(cat => cat.id === selectedCategory);

  // Check if form is valid for submit button
  // Title: minimum 5 words, Description: minimum 15 words
  const titleWords = title.trim().split(/\s+/).filter(w => w).length;
  const descriptionWords = description.trim().split(/\s+/).filter(w => w).length;

  const isFormValid =
    titleWords >= 5 &&
    selectedCategory &&
    selectedSubcategory &&
    descriptionWords >= 15;

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory('');
    setCategoryModalVisible(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSelectSubcategory = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
    setSubcategoryModalVisible(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const clearForm = () => {
    setTitle('');
    setSelectedCategory('');
    setSelectedSubcategory('');
    setDescription('');
    setAttachments([]);
  };

  const showSuccessModal = (data: any) => {
    setSubmittedData(data);
    setSuccessModalVisible(true);

    Animated.parallel([
      Animated.timing(successFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(successScaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideSuccessModal = () => {
    Animated.parallel([
      Animated.timing(successFadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(successScaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSuccessModalVisible(false);
      setSubmittedData(null);
      successFadeAnim.setValue(0);
      successScaleAnim.setValue(0.8);
    });
  };

  const handleSubmit = async () => {
    if (!isFormValid) {
      Alert.alert("Missing Information", "Please fill out all required fields.");
      return;
    }

    const dataToSubmit = {
      title,
      category: currentCategory?.name,
      subcategory: selectedSubcategory,
      description,
      attachmentCount: attachments.length
    };

    try {
      await saveGrievance({
        title,
        category: currentCategory?.name || '',
        description
      });

      clearForm();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showSuccessModal(dataToSubmit);
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

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <View style={styles.background}>
        <ScrollView style={styles.safeArea} showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Submit Grievance</Text>
              <Text style={styles.headerSubtitle}>We're here to help resolve your concerns</Text>
            </View>

            <View style={styles.scrollView}>
              {/* Title Input */}
              <View style={styles.inputSection}>
                <View style={styles.labelRow}>
                  <Text style={styles.inputLabel}>Title <Text style={styles.requiredText}>*</Text></Text>
                  <Text style={styles.charCount}>
                    {titleWords}/5 words
                  </Text>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Brief description of your issue (minimum 5 words)"
                    placeholderTextColor="#94A3B8"
                    value={title}
                    onChangeText={setTitle}
                    maxLength={100}
                  />
                </View>
              </View>

              {/* Category Selection */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Category <Text style={styles.requiredText}>*</Text></Text>
                <TouchableOpacity
                  style={styles.categorySelector}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setCategoryModalVisible(true);
                  }}
                >
                  <View style={styles.categoryContent}>
                    {selectedCategory ? (
                      <View style={styles.selectedCategory}>
                        <View style={[styles.categoryIcon, { backgroundColor: currentCategory?.color }]}>
                          <Feather name={currentCategory?.icon as any} size={20} color="white" />
                        </View>
                        <Text style={styles.categoryText}>{currentCategory?.name}</Text>
                      </View>
                    ) : (
                      <Text style={styles.categoryPlaceholder}>Select Category</Text>
                    )}
                    <Feather name="chevron-right" size={20} color="#94A3B8" />
                  </View>
                </TouchableOpacity>
              </View>

              {/* Subcategory Selection */}
              {selectedCategory && (
                <View style={styles.inputSection}>
                  <Text style={styles.inputLabel}>Subcategory <Text style={styles.requiredText}>*</Text></Text>
                  <TouchableOpacity
                    style={styles.categorySelector}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSubcategoryModalVisible(true);
                    }}
                  >
                    <View style={styles.categoryContent}>
                      {selectedSubcategory ? (
                        <Text style={styles.categoryText}>{selectedSubcategory}</Text>
                      ) : (
                        <Text style={styles.categoryPlaceholder}>Select Subcategory</Text>
                      )}
                      <Feather name="chevron-right" size={20} color="#94A3B8" />
                    </View>
                  </TouchableOpacity>
                </View>
              )}

              {/* Description Input */}
              <View style={styles.inputSection}>
                <View style={styles.labelRow}>
                  <Text style={styles.inputLabel}>Description <Text style={styles.requiredText}>*</Text></Text>
                  <Text style={styles.charCount}>
                    {descriptionWords}/15 words
                  </Text>
                </View>
                <View style={[styles.inputContainer, styles.descriptionContainer]}>
                  <TextInput
                    style={[styles.textInput, styles.descriptionInput]}
                    placeholder="Describe your issue in detail (minimum 15 words)..."
                    placeholderTextColor="#94A3B8"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    maxLength={500}
                  />
                </View>
              </View>

              {/* Attachments Section - OPTIONAL */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>
                  Attachments ({attachments.length})
                </Text>

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
                    <Text style={styles.attachmentText}>Add Photos (Optional)</Text>
                    <Text style={styles.attachmentSubtext}>Camera or Gallery</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Submit Button - DISABLED until all required fields are filled */}
              <TouchableOpacity
                style={[styles.submitButton, !isFormValid && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={!isFormValid}
              >
                <View style={styles.submitContent}>
                  <Feather name="send" size={20} color="white" />
                  <Text style={styles.submitText}>
                    {isFormValid ? 'Submit Grievance' : 'Fill All Fields'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </View>

      {/* Category Modal */}
      <Modal
        visible={isCategoryModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCategoryModalVisible(false)}
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
              {GRIEVANCE_CATEGORIES.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.categoryOption}
                  onPress={() => handleSelectCategory(item.id)}
                >
                  <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
                    <Feather name={item.icon as any} size={20} color="white" />
                  </View>
                  <Text style={styles.categoryOptionText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Subcategory Modal */}
      <Modal
        visible={isSubcategoryModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSubcategoryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Subcategory</Text>
              <TouchableOpacity onPress={() => setSubcategoryModalVisible(false)}>
                <Feather name="x" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.categoryList}>
              {currentCategory?.subcategories.map((subcat, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.categoryOption}
                  onPress={() => handleSelectSubcategory(subcat)}
                >
                  <View style={[styles.categoryIcon, { backgroundColor: currentCategory.color }]}>
                    <Feather name="tag" size={20} color="white" />
                  </View>
                  <Text style={styles.categoryOptionText}>{subcat}</Text>
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
        onRequestClose={() => setAttachmentModalVisible(false)}
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
                <View style={[styles.attachmentOptionIcon, { backgroundColor: '#DBEAFE' }]}>
                  <Feather name="camera" size={32} color="#3B82F6" />
                </View>
                <Text style={styles.attachmentOptionTitle}>Take Photo</Text>
                <Text style={styles.attachmentOptionSubtitle}>Use camera to capture evidence</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.attachmentOptionButton} onPress={pickImageFromGallery}>
                <View style={[styles.attachmentOptionIcon, { backgroundColor: '#F3E8FF' }]}>
                  <Feather name="image" size={32} color="#8B5CF6" />
                </View>
                <Text style={styles.attachmentOptionTitle}>Choose from Gallery</Text>
                <Text style={styles.attachmentOptionSubtitle}>Select existing photos</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* SUCCESS MODAL */}
      <Modal
        visible={isSuccessModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={hideSuccessModal}
      >
        <Animated.View
          style={[
            styles.successOverlay,
            { opacity: successFadeAnim }
          ]}
        >
          <Animated.View
            style={[
              styles.successModal,
              {
                opacity: successFadeAnim,
                transform: [{ scale: successScaleAnim }]
              }
            ]}
          >
            <View style={styles.successIconContainer}>
              <View style={styles.successIcon}>
                <Feather name="check" size={40} color="#fff" />
              </View>
            </View>

            <Text style={styles.successTitle}>Grievance Submitted! 🎉</Text>
            <Text style={styles.successMessage}>
              Your grievance has been submitted successfully and will be reviewed by our team.
            </Text>

            {submittedData && (
              <View style={styles.successDetails}>
                <View style={styles.successDetailRow}>
                  <Feather name="file-text" size={16} color="#6366F1" />
                  <Text style={styles.successDetailText}>{submittedData.title}</Text>
                </View>
                <View style={styles.successDetailRow}>
                  <Feather name="tag" size={16} color="#6366F1" />
                  <Text style={styles.successDetailText}>{submittedData.category}</Text>
                </View>
                <View style={styles.successDetailRow}>
                  <Feather name="info" size={16} color="#6366F1" />
                  <Text style={styles.successDetailText}>{submittedData.subcategory}</Text>
                </View>
                {submittedData.attachmentCount > 0 && (
                  <View style={styles.successDetailRow}>
                    <Feather name="paperclip" size={16} color="#6366F1" />
                    <Text style={styles.successDetailText}>{submittedData.attachmentCount} Attachment(s)</Text>
                  </View>
                )}
              </View>
            )}

            <View style={styles.successButtons}>
              <TouchableOpacity
                style={styles.successButtonSecondary}
                onPress={() => {
                  hideSuccessModal();
                  router.push('/track');
                }}
              >
                <Text style={styles.successButtonSecondaryText}>Track Progress</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.successButtonPrimary}
                onPress={hideSuccessModal}
              >
                <Text style={styles.successButtonPrimaryText}>Submit Another</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1, backgroundColor: '#F8FAFC' },
  safeArea: { flex: 1 },
  content: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 30 },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: '#1E293B', marginBottom: 8 },
  headerSubtitle: { fontSize: 16, color: '#64748B' },
  scrollView: { flex: 1, paddingHorizontal: 20 },
  inputSection: { marginBottom: 24 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  requiredText: { color: '#EF4444' },
  charCount: { fontSize: 12, color: '#94A3B8' },
  inputContainer: {
  backgroundColor: 'white',
  borderRadius: 16,
  borderWidth: 1,
  borderColor: '#E2E8F0',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 2,
  overflow: 'hidden',
},

  textInput: { 
  padding: 16, 
  fontSize: 16, 
  color: '#1E293B', 
  minHeight: 56,
  selectionColor: 'transparent',
  selectionHandleColor: 'transparent',
},

  descriptionContainer: { marginBottom: 8 },
  descriptionInput: { minHeight: 120, textAlignVertical: 'top' },
  categorySelector: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  selectedCategory: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  categoryIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  categoryText: { fontSize: 16, color: '#1E293B', fontWeight: '500' },
  categoryPlaceholder: { fontSize: 16, color: '#94A3B8' },
  attachmentPreview: { marginBottom: 12 },
  attachmentItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 12, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#E2E8F0', gap: 12 },
  attachmentImage: { width: 48, height: 48, borderRadius: 8 },
  attachmentInfo: { flex: 1 },
  attachmentName: { fontSize: 14, fontWeight: '500', color: '#1E293B', marginBottom: 2 },
  attachmentSize: { fontSize: 12, color: '#64748B' },
  removeButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FEF2F2', justifyContent: 'center', alignItems: 'center' },
  attachmentButton: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  attachmentContent: { alignItems: 'center', padding: 24, gap: 8 },
  attachmentText: { fontSize: 16, color: '#6366F1', fontWeight: '600' },
  attachmentSubtext: { fontSize: 12, color: '#94A3B8' },
  submitButton: {
    marginBottom: 100,
    borderRadius: 16,
    backgroundColor: '#6366F1',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#CBD5E1',
    shadowColor: '#CBD5E1',
    opacity: 0.6,
  },
  submitContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 18, gap: 12 },
  submitText: { fontSize: 16, fontWeight: 'bold', color: 'white' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '70%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1E293B' },
  categoryList: { maxHeight: 400 },
  categoryOption: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 16, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  categoryOptionText: { flex: 1, fontSize: 16, color: '#1E293B', fontWeight: '500' },
  attachmentOptions: { padding: 20, gap: 16 },
  attachmentOptionButton: { alignItems: 'center', padding: 24, backgroundColor: '#F8FAFC', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  attachmentOptionIcon: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  attachmentOptionTitle: { fontSize: 18, fontWeight: '600', color: '#1E293B', marginBottom: 4 },
  attachmentOptionSubtitle: { fontSize: 14, color: '#64748B', textAlign: 'center' },
  successOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  successModal: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    maxWidth: 350,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  successIconContainer: { marginBottom: 20 },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  successTitle: { fontSize: 24, fontWeight: 'bold', color: '#1E293B', marginBottom: 12, textAlign: 'center' },
  successMessage: { fontSize: 16, color: '#64748B', textAlign: 'center', lineHeight: 24, marginBottom: 24 },
  successDetails: { width: '100%', backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, marginBottom: 24, gap: 12 },
  successDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  successDetailText: { fontSize: 14, color: '#1E293B', fontWeight: '500', flex: 1 },
  successButtons: { flexDirection: 'row', gap: 12, width: '100%' },
  successButtonSecondary: { flex: 1, paddingVertical: 14, paddingHorizontal: 20, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center' },
  successButtonSecondaryText: { fontSize: 16, fontWeight: '600', color: '#6366F1' },
  successButtonPrimary: { flex: 1, paddingVertical: 14, paddingHorizontal: 20, borderRadius: 12, backgroundColor: '#6366F1', alignItems: 'center' },
  successButtonPrimaryText: { fontSize: 16, fontWeight: '600', color: 'white' },
});
