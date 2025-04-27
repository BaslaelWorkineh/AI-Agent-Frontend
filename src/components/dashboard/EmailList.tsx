import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const EmailList = () => {
  const { getToken } = useAuth();
  const [pageToken, setPageToken] = useState<string | null>(null);
  const [prevTokens, setPrevTokens] = useState<string[]>([]); // For going back
  const pageSize = 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['emails', pageToken],
    queryFn: async () => {
      const token = await getToken();
      const url = new URL(`${API_URL}/api/email/summary`);
      url.searchParams.append('pageSize', String(pageSize));
      if (pageToken) url.searchParams.append('pageToken', pageToken);
      const res = await fetch(url.toString(), {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch emails');
      return res.json();
    },
    keepPreviousData: true,
  });
  const emails = data?.emails || [];
  const nextPageToken = data?.nextPageToken || null;

  const handleNext = () => {
    if (nextPageToken) {
      setPrevTokens((prev) => [...prev, pageToken || '']);
      setPageToken(nextPageToken);
    }
  };
  const handlePrev = () => {
    if (prevTokens.length > 0) {
      const prev = [...prevTokens];
      const last = prev.pop();
      setPrevTokens(prev);
      setPageToken(last || null);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>All Emails</CardTitle>
          <Badge variant="outline">{emails.length} emails</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div>Loading...</div>
          ) : isError ? (
            <div className="text-destructive">Failed to load emails</div>
          ) : emails.length === 0 ? (
            <div className="text-muted-foreground">No emails found.</div>
          ) : emails.map((email) => (
            <div
              key={email.id}
              className={cn(
                "flex items-start gap-3 p-4 rounded-lg border cursor-pointer hover:bg-accent",
                // No read/unread info from backend yet
                "bg-background"
              )}
            >
              <div className="flex-shrink-0">
                {/* No priority/starred info from backend yet */}
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <p className="font-medium">{email.payload?.headers?.find(h => h.name === 'From')?.value || 'Unknown'}</p>
                  <p className="text-xs text-muted-foreground">
                    {email.payload?.headers?.find(h => h.name === 'Date')?.value ? new Date(email.payload.headers.find(h => h.name === 'Date').value).toLocaleDateString() : ''}
                  </p>
                </div>
                <p className="text-sm font-medium">{email.payload?.headers?.find(h => h.name === 'Subject')?.value || '(No subject)'}</p>
                {/* No preview from backend yet */}
              </div>
            </div>
          ))}
          <div className="flex justify-between mt-4">
            <button onClick={handlePrev} disabled={prevTokens.length === 0} className="btn btn-outline">Previous</button>
            <button onClick={handleNext} disabled={!nextPageToken} className="btn btn-outline">Next</button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailList;
