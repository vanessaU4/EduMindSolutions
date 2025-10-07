// Mock data service for when backend is not available
export class MockDataService {
  // Forum Categories
  static getForumCategories() {
    return [
      {
        id: 1,
        name: 'General Discussion',
        description: 'General mental health discussions and support',
        icon: 'MessageSquare',
        color: '#3B82F6',
        is_active: true,
        order: 1,
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Anxiety & Stress',
        description: 'Support and coping strategies for anxiety and stress',
        icon: 'Heart',
        color: '#EF4444',
        is_active: true,
        order: 2,
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        name: 'Depression Support',
        description: 'Community support for those dealing with depression',
        icon: 'Users',
        color: '#8B5CF6',
        is_active: true,
        order: 3,
        created_at: new Date().toISOString()
      },
      {
        id: 4,
        name: 'Coping Strategies',
        description: 'Share and learn healthy coping mechanisms',
        icon: 'Shield',
        color: '#10B981',
        is_active: true,
        order: 4,
        created_at: new Date().toISOString()
      },
      {
        id: 5,
        name: 'Success Stories',
        description: 'Share your recovery and success stories',
        icon: 'TrendingUp',
        color: '#F59E0B',
        is_active: true,
        order: 5,
        created_at: new Date().toISOString()
      }
    ];
  }

  // Forum Posts
  static getForumPosts() {
    return [
      {
        id: 1,
        title: 'Welcome to the Community',
        content: 'This is a safe space for sharing and support. Please be kind and respectful to everyone.',
        author: 1,
        author_display_name: 'Community Admin',
        category: 1,
        is_anonymous: false,
        is_pinned: true,
        is_locked: false,
        is_approved: true,
        view_count: 156,
        like_count: 23,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_activity: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Managing Daily Anxiety',
        content: 'I wanted to share some techniques that have helped me manage my daily anxiety...',
        author: 2,
        author_display_name: 'Anonymous User',
        category: 2,
        is_anonymous: true,
        is_pinned: false,
        is_locked: false,
        is_approved: true,
        view_count: 89,
        like_count: 15,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        last_activity: new Date(Date.now() - 3600000).toISOString()
      }
    ];
  }

  // Peer Support Matches
  static getPeerSupportMatches() {
    return [
      {
        id: 1,
        requester: 1,
        matched_user: 2,
        status: 'pending' as const,
        interests: ['anxiety', 'coping strategies'],
        preferred_topics: ['anxiety', 'coping strategies'],
        age_range: '18-25',
        created_at: new Date().toISOString()
      }
    ];
  }

  // Chat Rooms
  static getChatRooms() {
    return [
      {
        id: 1,
        name: 'General Support',
        description: 'General mental health support chat',
        is_active: true,
        participant_count: 12,
        max_participants: 50,
        is_moderated: true,
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Anxiety Support',
        description: 'Support group for anxiety management',
        is_active: true,
        participant_count: 8,
        max_participants: 25,
        is_moderated: true,
        created_at: new Date().toISOString()
      }
    ];
  }

  // Wellness Data
  static getWellnessData() {
    return {
      currentStreak: 7,
      totalPoints: 1250,
      weeklyGoal: 5,
      weeklyProgress: 4,
      recentMoods: [
        { date: new Date(Date.now() - 86400000 * 0).toISOString().split('T')[0], mood: 8, note: 'Feeling good today' },
        { date: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0], mood: 6, note: 'Okay day' },
        { date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], mood: 7, note: 'Pretty good' },
        { date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0], mood: 5, note: 'Neutral' },
        { date: new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0], mood: 9, note: 'Great day!' }
      ],
      achievements: [
        {
          id: '1',
          title: 'First Steps',
          description: 'Complete your first mood check-in',
          earned: true,
          date: '2024-01-01'
        },
        {
          id: '2',
          title: 'Week Warrior',
          description: 'Complete 7 days in a row',
          earned: true,
          date: '2024-01-06'
        },
        {
          id: '3',
          title: 'Mood Master',
          description: 'Track mood for 30 days',
          earned: false
        }
      ],
      todaysChallenge: {
        id: 'daily-1',
        title: 'Gratitude Practice',
        description: 'Write down 3 things you\'re grateful for today',
        completed: false
      }
    };
  }

  // Daily Challenges
  static getDailyChallenges() {
    return [
      {
        id: 1,
        title: 'Gratitude Practice',
        description: 'Write down 3 things you\'re grateful for today',
        challenge_type: 'mindfulness',
        instructions: '1. Find a quiet space\n2. Think of 3 things you\'re grateful for\n3. Write them down\n4. Reflect on why you\'re grateful',
        points_reward: 10,
        target_value: 3,
        duration_minutes: 5,
        is_active: true,
        created_at: new Date().toISOString(),
        is_completed_today: false
      },
      {
        id: 2,
        title: 'Deep Breathing',
        description: 'Practice 5 minutes of deep breathing',
        challenge_type: 'breathing',
        instructions: '1. Sit comfortably\n2. Breathe in for 4 counts\n3. Hold for 4 counts\n4. Breathe out for 6 counts\n5. Repeat for 5 minutes',
        points_reward: 15,
        target_value: 5,
        duration_minutes: 5,
        is_active: true,
        created_at: new Date().toISOString(),
        is_completed_today: false
      }
    ];
  }

  // Content Data
  static getArticles() {
    return [
      {
        id: 1,
        title: 'Understanding Anxiety: A Beginner\'s Guide',
        description: 'Learn the basics of anxiety and how it affects your daily life.',
        author_name: 'Dr. Sarah Johnson',
        category_name: 'Mental Health Basics',
        is_published: true,
        view_count: 245,
        like_count: 34,
        created_at: new Date().toISOString(),
        featured_image: null
      },
      {
        id: 2,
        title: '10 Effective Coping Strategies for Stress',
        description: 'Practical techniques you can use to manage stress in your daily life.',
        author_name: 'Mental Health Team',
        category_name: 'Coping Strategies',
        is_published: true,
        view_count: 189,
        like_count: 28,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        featured_image: null
      }
    ];
  }

  static getVideos() {
    return [
      {
        id: 1,
        title: 'Guided Meditation for Anxiety Relief',
        description: 'A 10-minute guided meditation to help reduce anxiety and promote relaxation.',
        author_name: 'Meditation Guide',
        category_name: 'Self-Care',
        is_published: true,
        view_count: 567,
        like_count: 89,
        created_at: new Date().toISOString(),
        thumbnail_image: null
      }
    ];
  }

  static getAudioContent() {
    return [
      {
        id: 1,
        title: 'Sleep Meditation: Peaceful Night',
        description: 'A calming meditation to help you fall asleep peacefully.',
        author_name: 'Sleep Specialist',
        category_name: 'Self-Care',
        is_published: true,
        play_count: 423,
        like_count: 67,
        created_at: new Date().toISOString(),
        thumbnail_image: null
      }
    ];
  }

  static getResources() {
    return [
      {
        id: 1,
        name: 'National Suicide Prevention Lifeline',
        description: 'Free and confidential emotional support',
        resource_type: 'crisis_line',
        phone_number: '988',
        website: 'https://suicidepreventionlifeline.org',
        is_24_7: true,
        is_active: true
      },
      {
        id: 2,
        name: 'Crisis Text Line',
        description: 'Text-based crisis support',
        resource_type: 'crisis_line',
        phone_number: '741741',
        website: 'https://crisistextline.org',
        is_24_7: true,
        is_active: true
      }
    ];
  }

  // Content Statistics
  static getContentStats() {
    return {
      total_articles: 15,
      published_articles: 12,
      total_videos: 8,
      published_videos: 6,
      total_audio: 10,
      published_audio: 8,
      pending_approval: 5,
      total_categories: 4,
      total_engagements: 156
    };
  }

  // Guide Clients
  static getClients() {
    return [
      {
        id: 1,
        name: 'Client A',
        email: 'client.a@example.com',
        status: 'active',
        last_session: new Date(Date.now() - 86400000 * 2).toISOString(),
        created_at: new Date(Date.now() - 86400000 * 30).toISOString()
      },
      {
        id: 2,
        name: 'Client B',
        email: 'client.b@example.com',
        status: 'active',
        last_session: new Date(Date.now() - 86400000 * 5).toISOString(),
        created_at: new Date(Date.now() - 86400000 * 45).toISOString()
      }
    ];
  }
}
