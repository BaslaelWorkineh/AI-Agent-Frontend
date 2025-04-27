import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const EmailSummary = () => {
  const { getToken } = useAuth();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['email-summary'],
    queryFn: async () => {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/email/summary`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch email summary');
      return res.json();
    }
  });
  const emails = data?.emails || [];
  const unreadCount = emails.length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Email Updates</CardTitle>
          <Badge variant="outline" className="ml-2">
            {isLoading ? '...' : unreadCount} unread
          </Badge>
        </div>
        <CardDescription>
          Important emails that need your attention
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div>Loading...</div>
          ) : isError ? (
            <div className="text-destructive">Failed to load emails</div>
          ) : emails.length > 0 ? (
            emails.slice(0, 4).map((email) => (
              <div key={email.id} className={cn(
                "flex items-start gap-3 p-3 rounded-lg bg-assistant-light"
              )}>
                <div className="flex-shrink-0">
                  <Flag className="h-4 w-4 text-destructive" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <p className={cn("font-medium truncate font-semibold")}>{email.payload?.headers?.find(h => h.name === 'From')?.value || 'Unknown'}</p>
                    <p className="text-xs text-muted-foreground">{email.payload?.headers?.find(h => h.name === 'Date')?.value ? new Date(email.payload.headers.find(h => h.name === 'Date').value).toLocaleDateString() : ''}</p>
                  </div>
                  <p className="text-sm font-medium truncate">{email.payload?.headers?.find(h => h.name === 'Subject')?.value || '(No subject)'}</p>
                  {/* No preview from backend yet */}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No priority emails</p>
            </div>
          )}
          <div className="text-center mt-2">
            <a href="/email" className="text-sm text-assistant hover:underline">
              View all emails
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailSummary;
