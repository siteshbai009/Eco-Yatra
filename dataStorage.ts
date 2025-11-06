import { supabase } from './lib/supabase';

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

export const loadGrievances = async (): Promise<GrievanceItem[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('No authenticated user found');
      return [];
    }

    const { data, error } = await supabase
      .from('grievances')
      .select(`
        *,
        grievance_timeline (
          status,
          description,
          completed,
          created_at
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading grievances:', error);
      return [];
    }

    return data.map(item => ({
      id: item.id,
      title: item.title,
      category: item.category,
      status: item.status,
      priority: item.priority,
      date: formatDate(item.created_at),
      description: item.description,
      timeline: item.grievance_timeline?.map((t: any) => ({
        status: t.status,
        date: new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        time: new Date(t.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        description: t.description,
        completed: t.completed
      }))
    }));
  } catch (error) {
    console.error('Error loading grievances:', error);
    return [];
  }
};

export const saveGrievance = async (newGrievance: Omit<GrievanceItem, 'id' | 'date' | 'timeline'>): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user - cannot save grievance');
      throw new Error('User not authenticated');
    }

    console.log('Saving grievance for user:', user.id);

    const { error } = await supabase
      .from('grievances')
      .insert([{
        user_id: user.id,
        title: newGrievance.title,
        category: newGrievance.category,
        subcategory: (newGrievance as any).subcategory || null, // Add subcategory
        description: newGrievance.description,
        status: 'Submitted',
        priority: newGrievance.priority || 'Medium',
        attachment_count: (newGrievance as any).attachmentCount || 0 // Add attachment count
      }]);

    if (error) {
      console.error('Error saving grievance:', error);
      throw error;
    }

    console.log('Grievance saved successfully');
  } catch (error) {
    console.error('Error saving grievance:', error);
    throw error;
  }
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
