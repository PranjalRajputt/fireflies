'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createMeeting, uploadTranscript } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { UploadCloud, FileText, Loader2 } from 'lucide-react';

export default function NewMeeting() {
  const router = useRouter();
  const { addToast } = useToast();
  
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !file) {
      addToast('Please provide a title and transcript file.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const meeting = await createMeeting({ title, duration_seconds: 0 });
      await uploadTranscript(meeting.id, file);
      
      addToast('Meeting uploaded successfully!', 'success');
      router.push(`/meetings/${meeting.id}`);
    } catch (error) {
      console.error(error);
      addToast('Failed to create meeting. Check backend connection.', 'error');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Upload Transcript</h1>
        <p className="text-sm text-gray-500 mt-1">Upload a .txt, .vtt, or .json file to generate a meeting record.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 border rounded-xl shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none transition"
            placeholder="e.g., Q3 Product Roadmap Sync"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Transcript File</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 transition cursor-pointer relative">
            <input
              type="file"
              accept=".txt,.vtt,.json"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-1 text-center">
              <UploadCloud className="mx-auto h-10 w-10 text-gray-400" />
              <div className="flex text-sm text-gray-600 justify-center">
                <span className="relative rounded-md font-medium text-purple-600">
                  {file ? file.name : 'Upload a file'}
                </span>
                {!file && <p className="pl-1">or drag and drop</p>}
              </div>
              <p className="text-xs text-gray-500">TXT, VTT, JSON up to 10MB</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 mr-3"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
            {isSubmitting ? 'Processing...' : 'Upload & Process'}
          </button>
        </div>
      </form>
    </div>
  );
}