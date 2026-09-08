// lib/api.ts
import { API_BASE_URL as BASE_URL } from '@/lib/config';

const API_BASE_URL = `${BASE_URL}/api`;

export async function fetchMeetings() {
  const res = await fetch(`${API_BASE_URL}/meetings`);
  if (!res.ok) throw new Error('Failed to fetch meetings');
  return res.json();
}

export async function createMeeting(data: { title: string; duration_seconds?: number }) {
  const res = await fetch(`${API_BASE_URL}/meetings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create meeting');
  return res.json();
}

export async function updateMeeting(meetingId: string | number, data: { title?: string }) {
  const res = await fetch(`${API_BASE_URL}/meetings/${meetingId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update meeting');
  return res.json();
}

export async function deleteMeeting(meetingId: string | number) {
  const res = await fetch(`${API_BASE_URL}/meetings/${meetingId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete meeting');
  return true;
}

export async function uploadTranscript(meetingId: string | number, file: File) {
  const formData = new FormData();
  formData.append('file', file);
  
  const res = await fetch(`${API_BASE_URL}/meetings/${meetingId}/transcript/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload transcript');
  return res.json();
}