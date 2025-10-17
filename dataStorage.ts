import AsyncStorage from '@react-native-async-storage/async-storage';

// Interface matching your existing data structure
export interface GrievanceItem {
  id: string;
  title: string;
  category: string;
  status: string;
  priority: string;
  date: string;
  description: string;
  timeline?: any[];
}

// Demo data (matching your current data)
const defaultGrievances: GrievanceItem[] = [
  {
    id: '1',
    title: 'WiFi Connection Issues',
    category: 'Technical',
    status: 'Resolved',
    priority: 'High',
    date: '2 days ago',
    description: 'Unable to connect to campus WiFi in library',
    timeline: [
      { status: 'Submitted', date: 'Oct 8', time: '10:30 AM', description: 'Grievance submitted successfully', completed: true },
      { status: 'Under Review', date: 'Oct 9', time: '2:15 PM', description: 'IT team reviewing the issue', completed: true },
      { status: 'In Progress', date: 'Oct 10', time: '9:00 AM', description: 'Technician assigned to fix the issue', completed: true },
      { status: 'Resolved', date: 'Oct 12', time: '4:00 PM', description: 'WiFi issue resolved successfully', completed: true }
    ]
  },
  {
    id: '2',
    title: 'Mess Food Quality',
    category: 'Facilities',
    status: 'In Progress',
    priority: 'Medium',
    date: '5 hours ago',
    description: 'Poor quality food served in hostel mess',
    timeline: [
      { status: 'Submitted', date: 'Oct 9', time: '3:45 PM', description: 'Complaint registered', completed: true },
      { status: 'Under Review', date: 'Oct 10', time: '11:30 AM', description: 'Management reviewing complaint', completed: true },
      { status: 'In Progress', date: 'Oct 11', time: '9:00 AM', description: 'Kitchen staff meeting scheduled', completed: true }
    ]
  },
  {
    id: '3',
    title: 'Library Timing Extension',
    category: 'Administrative',
    status: 'Resolved',
    priority: 'Low',
    date: '1 week ago',
    description: 'Request to extend library hours during exams',
    timeline: [
      { status: 'Submitted', date: 'Oct 5', time: '1:20 PM', description: 'Request submitted', completed: true },
      { status: 'Under Review', date: 'Oct 6', time: '10:00 AM', description: 'Administration reviewing request', completed: true },
      { status: 'Approved', date: 'Oct 7', time: '4:30 PM', description: 'Request approved', completed: true },
      { status: 'Resolved', date: 'Oct 8', time: '9:00 AM', description: 'Extended hours implemented', completed: true }
    ]
  },
  {
    id: '4',
    title: 'Broken AC in Classroom',
    category: 'Infrastructure',
    status: 'Submitted',
    priority: 'High',
    date: '3 days ago',
    description: 'AC not working in Room 301, Block A',
    timeline: [
      { status: 'Submitted', date: 'Oct 1', time: '11:00 AM', description: 'AC repair request submitted', completed: true }
    ]
  },
  {
    id: '5',
    title: 'Parking Space Issues',
    category: 'Infrastructure',
    status: 'Submitted',
    priority: 'Medium',
    date: '1 day ago',
    description: 'Insufficient parking space for students',
    timeline: [
      { status: 'Submitted', date: 'Oct 11', time: '2:30 PM', description: 'Parking complaint submitted', completed: true }
    ]
  }
];

// Storage functions
export const loadGrievances = async (): Promise<GrievanceItem[]> => {
  try {
    const stored = await AsyncStorage.getItem('grievances');
    if (stored) {
      return JSON.parse(stored);
    } else {
      // First time - save default data
      await AsyncStorage.setItem('grievances', JSON.stringify(defaultGrievances));
      return defaultGrievances;
    }
  } catch (error) {
    console.error('Error loading grievances:', error);
    return defaultGrievances;
  }
};

export const saveGrievance = async (newGrievance: Omit<GrievanceItem, 'id' | 'status' | 'timeline' | 'date'>): Promise<void> => {
  try {
    const existingGrievances = await loadGrievances();
    
    const grievanceWithDetails: GrievanceItem = {
      ...newGrievance,
      id: Date.now().toString(),
      status: 'Submitted',
      date: 'Just now',
      timeline: [
        {
          status: 'Submitted',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
          description: 'Grievance submitted successfully',
          completed: true
        }
      ]
    };
    
    const updatedGrievances = [grievanceWithDetails, ...existingGrievances];
    await AsyncStorage.setItem('grievances', JSON.stringify(updatedGrievances));
  } catch (error) {
    console.error('Error saving grievance:', error);
    throw error;
  }
};

export const getGrievanceStats = (grievances: GrievanceItem[]) => {
  const total = grievances.length;
  const resolved = grievances.filter(g => g.status === 'Resolved').length;
  const pending = total - resolved;
  
  return { total, resolved, pending };
};
