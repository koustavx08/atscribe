'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Upload, Link } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface LinkedInImportProps {
  onImport: (data: any) => void;
}

export default function LinkedInImport({ onImport }: LinkedInImportProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const urlRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    const formData = new FormData();
    const url = urlRef.current?.value?.trim();
    const file = fileRef.current?.files?.[0];
    
    if (url) {
      formData.append('url', url);
    } else if (file) {
      formData.append('file', file);
    } else {
      setError('Please provide either a LinkedIn URL or upload a PDF file.');
      setLoading(false);
      return;
    }
    
    try {
      const res = await fetch('/api/linkedin-import', {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        setSuccess('LinkedIn profile imported successfully!');
        onImport(data);
        // Clear form
        if (urlRef.current) urlRef.current.value = '';
        if (fileRef.current) fileRef.current.value = '';
      } else {
        setError(data.error || 'Import failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('Import error:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Import LinkedIn Profile
        </CardTitle>
        <CardDescription>
          Import your LinkedIn profile data to automatically populate your resume
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="linkedin-url">LinkedIn Profile URL</Label>
            <Input
              id="linkedin-url"
              ref={urlRef}
              type="url"
              placeholder="https://linkedin.com/in/your-profile"
              disabled={loading}
            />
          </div>
          
          <div className="flex items-center justify-center">
            <Separator className="flex-1" />
            <span className="px-3 text-sm text-muted-foreground">or</span>
            <Separator className="flex-1" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="linkedin-pdf">Upload LinkedIn PDF</Label>
            <div className="flex items-center gap-2">
              <Input
                id="linkedin-pdf"
                ref={fileRef}
                type="file"
                accept="application/pdf"
                disabled={loading}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium"
              />
              <Upload className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              Maximum file size: 10MB. Only PDF files are supported.
            </p>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              'Import from LinkedIn'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
