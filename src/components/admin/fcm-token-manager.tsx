'use client';

import { useEffect, useState } from 'react';
import { getMessagingToken, requestPermission } from '@/firebase/messaging';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Copy, BellRing } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

export function FcmTokenManager() {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<string>('default');
  const { toast } = useToast();

  useEffect(() => {
    setNotificationPermission(Notification.permission);
  }, []);

  const handleRequestPermission = () => {
    requestPermission().then(permission => {
      setNotificationPermission(permission);
      if (permission === 'granted') {
        handleGetToken();
      } else {
        setError('Notification permission was denied. You must allow notifications to get a token.');
      }
    });
  };

  const handleGetToken = async () => {
    setError(null);
    try {
      const currentToken = await getMessagingToken();
      if (currentToken) {
        setToken(currentToken);
      } else {
        setError('Could not retrieve FCM token. Ensure notifications are enabled and your browser is supported.');
      }
    } catch (err) {
      console.error('An error occurred while retrieving token. ', err);
      setError('An error occurred while trying to get the token. See the console for more details.');
    }
  };

  useEffect(() => {
    if (notificationPermission === 'granted') {
      handleGetToken();
    }
  }, [notificationPermission]);

  const copyToClipboard = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      toast({
        title: 'Token Copied!',
        description: 'The FCM token has been copied to your clipboard.',
      });
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Push Notification Test Token</CardTitle>
        <CardDescription>
          Use this FCM registration token to send test push notifications to this specific browser from the Firebase Console.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {notificationPermission !== 'granted' && (
          <Alert>
            <BellRing className="h-4 w-4" />
            <AlertTitle>Enable Notifications</AlertTitle>
            <AlertDescription>
              You need to grant notification permission in your browser to get a test token.
              <Button onClick={handleRequestPermission} className="ml-4">
                Allow Notifications
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {error && (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        <div>
          <h3 className="font-semibold mb-2">Your Device's FCM Token</h3>
          <div className="flex items-center gap-2">
            <Input
              readOnly
              value={token || 'No token available. Grant notification permissions first.'}
              placeholder="FCM Registration Token will appear here"
              className="font-mono text-xs"
            />
            <Button size="icon" onClick={copyToClipboard} disabled={!token}>
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy Token</span>
            </Button>
          </div>
        </div>

        <div>
            <h3 className="font-semibold mb-2">How to Use</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Click the "Copy" button to copy the token above.</li>
                <li>Go to the <a href={`https://console.firebase.google.com/project/studio-9989645986-f96da/notification/compose`} target="_blank" rel="noopener noreferrer" className="underline text-primary">Firebase Console Notification Composer</a>.</li>
                <li>Write your test message.</li>
                <li>Click the "Send test message" button on the right panel.</li>
                <li>Paste the copied token into the "Add an FCM registration token" field and click "Add".</li>
                <li>Click the "Test" button to send the notification.</li>
            </ol>
        </div>
      </CardContent>
    </Card>
  );
}
