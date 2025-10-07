import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/store';
import { logout } from '@/features/auth/authSlice';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Heart,
  Shield,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Phone,
  AlertTriangle,
  Lock,
  ChevronDown,
  ChevronRight,
  Home,
  Brain,
  Users,
  Activity,
  BookOpen,
  FileText,
  LifeBuoy,
  UserCheck,
  BarChart3,
  MessageSquare,
  Target,
  Award,
  Calendar,
  Stethoscope,
  UserCog,
  Database,
  Minimize2,
  Maximize2,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  requireAuth?: boolean;
  requireOnboarding?: boolean;
  children?: NavigationItem[];
}

const HealthcareSidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggleCollapse }) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['dashboard']);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionName) 
        ? prev.filter(s => s !== sectionName)
        : [...prev, sectionName]
    );
  };

  // Navigation structure based on user role
  const getNavigationItems = (): NavigationItem[] => {
    const baseItems: NavigationItem[] = [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: Home,
        requireAuth: true,
        requireOnboarding: true,
      },
      {
        name: 'Assessments',
        href: '/assessments',
        icon: Brain,
        requireAuth: true,
        requireOnboarding: true,
        children: [
          { name: 'Assessment Center', href: '/assessments', icon: Brain },
          { name: 'Take Assessment', href: '/assessments/take/anxiety', icon: FileText },
          { name: 'Results History', href: '/assessments/history', icon: BarChart3 },
        ],
      },
      {
        name: 'Community',
        href: '/community',
        icon: Users,
        requireAuth: true,
        requireOnboarding: true,
        children: [
          { name: 'Community Hub', href: '/community', icon: Users },
          { name: 'Forums', href: '/community/forums', icon: MessageSquare },
          { name: 'Peer Support', href: '/community/peer-support', icon: Heart },
          { name: 'Chat Rooms', href: '/community/chat', icon: MessageSquare },
        ],
      },
      {
        name: 'Wellness',
        href: '/wellness',
        icon: Activity,
        requireAuth: true,
        requireOnboarding: true,
        children: [
          { name: 'Wellness Center', href: '/wellness', icon: Activity },
          { name: 'Mood Tracker', href: '/wellness/mood-tracker', icon: Target },
          { name: 'Daily Challenges', href: '/wellness/challenges', icon: Calendar },
          { name: 'Achievements', href: '/wellness/achievements', icon: Award },
        ],
      },
      {
        name: 'Education',
        href: '/education',
        icon: BookOpen,
        requireAuth: true,
        requireOnboarding: true,
      },
      {
        name: 'Resources',
        href: '/resources',
        icon: FileText,
        requireAuth: true,
        requireOnboarding: true,
      },
      {
        name: 'Crisis Support',
        href: '/crisis',
        icon: LifeBuoy,
        requireAuth: true,
      },
      {
        name: 'Safety Planning',
        href: '/safety-plan',
        icon: Shield,
        requireAuth: true,
        requireOnboarding: true,
      },
    ];

    // Add role-specific items
    if (user?.role === 'guide') {
      baseItems.push({
        name: 'Guide Tools',
        href: '/guide',
        icon: Stethoscope,
        requireAuth: true,
        children: [
          { name: 'Guide Dashboard', href: '/guide', icon: BarChart3 },
          { name: 'Client Management', href: '/guide/clients', icon: UserCheck },
          { name: 'Crisis Alerts', href: '/guide/crisis-alerts', icon: AlertTriangle },
          { name: 'Content Moderation', href: '/guide/moderation', icon: Shield },
          { name: 'Analytics', href: '/guide/analytics', icon: BarChart3 },
        ],
      });
    }

    if (user?.role === 'admin') {
      baseItems.push({
        name: 'Users',
        href: '/admin/users',
        icon: UserCog,
        requireAuth: true,      
      });
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  const renderNavigationItem = (item: NavigationItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedSections.includes(item.name.toLowerCase());
    const isActive = isActivePath(item.href);
    const shouldShow = !item.requireAuth || (item.requireAuth && isAuthenticated);

    if (!shouldShow) return null;

    const itemClasses = `
      flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
      ${level > 0 ? 'ml-4 pl-6' : ''}
      ${isActive 
        ? 'bg-healthcare-primary text-white shadow-sm' 
        : 'text-gray-700 hover:bg-gray-100 hover:text-healthcare-primary'
      }
      ${isCollapsed && level === 0 ? 'justify-center' : 'justify-start'}
    `;

    if (hasChildren) {
      return (
        <Collapsible
          key={item.name}
          open={isExpanded}
          onOpenChange={() => toggleSection(item.name.toLowerCase())}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={itemClasses}
              aria-expanded={isExpanded}
              aria-label={`Toggle ${item.name} section`}
            >
              <item.icon className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4 mr-3'}`} />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">{item.name}</span>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </>
              )}
            </Button>
          </CollapsibleTrigger>
          {!isCollapsed && (
            <CollapsibleContent className="space-y-1">
              {item.children?.map(child => renderNavigationItem(child, level + 1))}
            </CollapsibleContent>
          )}
        </Collapsible>
      );
    }

    return (
      <Link
        key={item.name}
        to={item.href}
        className={itemClasses}
        aria-label={item.name}
      >
        <item.icon className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4 mr-3'}`} />
        {!isCollapsed && <span>{item.name}</span>}
      </Link>
    );
  };

  return (
    <aside
      className={`
        fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 shadow-lg transition-all duration-300
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}
      aria-label="Healthcare platform navigation"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-healthcare-primary rounded-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900">EduMindSolutions</span>
              <span className="text-xs text-gray-500">Mental Health Platform</span>
            </div>
          </Link>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="p-2"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
        </Button>
      </div>

      {/* HIPAA Compliance Badge */}
      {!isCollapsed && (
        <div className="px-4 py-2">
          <Badge variant="outline" className="w-full justify-center hipaa-compliant">
            <Lock className="w-3 h-3 mr-1" />
            HIPAA Compliant
          </Badge>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigationItems.map(item => renderNavigationItem(item))}
      </nav>

    </aside>
  );
};

export default HealthcareSidebar;
