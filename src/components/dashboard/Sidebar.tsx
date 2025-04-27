import React from 'react';
import { Calendar, Mail, CheckSquare, Coffee, Settings, LayoutDashboard, Clock, LogOut, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth, UserButton, SignInButton, SignOutButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const { isSignedIn } = useAuth();

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, path: '/dashboard' },
    { name: 'Calendar', icon: <Calendar className="h-5 w-5" />, path: '/calendar' },
    { name: 'Email', icon: <Mail className="h-5 w-5" />, path: '/email' },
    { name: 'Tasks', icon: <CheckSquare className="h-5 w-5" />, path: '/tasks' },
    { name: 'Briefs', icon: <Coffee className="h-5 w-5" />, path: '/briefs' },
    // { name: 'Follow-ups', icon: <Clock className="h-5 w-5" />, path: '/followups' },
  ];

  const settingsItem = { name: 'Settings', icon: <Settings className="h-5 w-5" />, path: '/settings' };

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="flex items-center h-16 border-b border-sidebar-border">
        <h1 className="text-3xl font-semibold ml-10" style={{color:'#4f46e5'}}>TINA</h1>
      </div>
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        <ul>
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "text-sidebar-accent-foreground bg-sidebar-accent" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Settings and Auth Buttons at the bottom */}
      <div className="p-2 border-t border-sidebar-border mt-auto">
        <ul className="space-y-1">
          <li>
            <NavLink
              to={settingsItem.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "text-sidebar-accent-foreground bg-sidebar-accent" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              {settingsItem.icon}
              <span>{settingsItem.name}</span>
            </NavLink>
          </li>
          <li>
            {isSignedIn ? (
              <div className="flex items-center justify-between p-2">
                <UserButton afterSignOutUrl="/" />
                <SignOutButton>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors text-sidebar-foreground hover:bg-sidebar-accent/50"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </Button>
                </SignOutButton>
              </div>
            ) : (
              <SignInButton mode="modal">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-sidebar-foreground hover:bg-sidebar-accent/50"
                >
                  <User className="h-5 w-5" />
                  <span>Sign In</span>
                </Button>
              </SignInButton>
            )}
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
