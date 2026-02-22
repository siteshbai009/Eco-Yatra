// import { supabase } from './app/lib/supabase';

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

const mockGrievances: GrievanceItem[] = [
  {
    id: '1',
    title: 'Broken Chair',
    category: 'Infrastructure',
    status: 'Resolved',
    priority: 'High',
    date: '2023-10-20T10:00:00Z',
    description: 'The chair in lab 3 is broken.',
    timeline: [
      { status: 'Submitted', date: 'Oct 20', time: '10:00 AM', description: 'Grievance submitted', completed: true },
      { status: 'Resolved', date: 'Oct 22', time: '2:00 PM', description: 'Chair replaced', completed: true }
    ]
  },
  {
    id: '2',
    title: 'Water Leakage',
    category: 'Maintenance',
    status: 'In Progress',
    priority: 'Medium',
    date: '2023-10-23T09:00:00Z',
    description: 'Water is leaking from the ceiling in the corridor.',
    timeline: [
      { status: 'Submitted', date: 'Oct 23', time: '9:00 AM', description: 'Grievance submitted', completed: true },
      { status: 'In Progress', date: 'Oct 23', time: '11:00 AM', description: 'Maintenance team notified', completed: true }
    ]
  },
  {
    id: '3',
    title: 'Projector Not Working',
    category: 'IT Support',
    status: 'Submitted',
    priority: 'High',
    date: '2023-10-24T08:30:00Z',
    description: 'The projector in room 101 is not displaying colors correctly.',
    timeline: [
      { status: 'Submitted', date: 'Oct 24', time: '8:30 AM', description: 'Grievance submitted', completed: true }
    ]
  }
];

export const loadGrievances = async (): Promise<GrievanceItem[]> => {
  // Mock implementation
  console.log('Loading mock grievances');
  return new Promise((resolve) => {
    setTimeout(() => {
      const formattedGrievances = mockGrievances.map(item => ({
        ...item,
        date: formatDate(item.date),
        timeline: item.timeline // Keep timeline as is for mock
      }));
      resolve(formattedGrievances);
    }, 500);
  });
};

export const saveGrievance = async (newGrievance: Omit<GrievanceItem, 'id' | 'date' | 'timeline'>): Promise<void> => {
  // Mock implementation
  console.log('Saving mock grievance:', newGrievance);
  return new Promise((resolve) => {
    setTimeout(() => {
      const newItem: GrievanceItem = {
        id: Math.random().toString(36).substr(2, 9),
        ...newGrievance,
        date: new Date().toISOString(),
        status: 'Submitted',
        timeline: [{ status: 'Submitted', date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString(), description: 'Grievance submitted', completed: true }]
      };
      mockGrievances.unshift(newItem); // Add to mock list
      resolve();
    }, 500);
  });
};


const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

  if (diffDays === 0) {
    if (diffHours === 0) {
      return 'Just now';
    }
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffDays === 1) {
    return '1 day ago';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 14) {
    return '1 week ago';
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

export const getGrievanceStats = (grievances: GrievanceItem[]) => {
  const total = grievances.length;
  const resolved = grievances.filter(g => g.status === 'Resolved').length;
  const pending = total - resolved;
  return { total, resolved, pending };
};
