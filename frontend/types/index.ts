export interface Participant {
  id: string;
  name: string;
  email?: string;
  avatar_color: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface MeetingListItem {
  id: string;
  title: string;
  date: string;
  duration_seconds: number;
  media_url: string;
  participants: Participant[];
  tags: Tag[];
}

export interface TranscriptSegment {
  id: string;
  speaker: string;
  text: string;
  start_time: number;
  end_time: number;
}

export interface Summary {
  id: string;
  overview: string;
}

export interface Topic {
  id: string;
  title: string;
  start_time: number;
}

export interface ActionItem {
  id: string;
  text: string;
  assignee?: string;
  is_completed: boolean;
}

export interface Meeting extends MeetingListItem {
  created_at: string;
  updated_at: string;
  segments: TranscriptSegment[];
  summary?: Summary;
  topics: Topic[];
  action_items: ActionItem[];
}