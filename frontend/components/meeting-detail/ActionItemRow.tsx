'use client';

import { CheckSquare, Square } from 'lucide-react';

interface ActionItem {
  id: string | number;
  text: string;
  is_completed: boolean;
  assignee?: string;
}

interface ActionItemRowProps {
  item: ActionItem;
  onToggle: (id: string | number) => void;
}

export default function ActionItemRow({ item, onToggle }: ActionItemRowProps) {
  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-xl transition group border border-transparent hover:border-gray-100">
      <button 
        onClick={() => onToggle(item.id)} 
        className="mt-0.5 text-gray-400 hover:text-purple-600 transition shrink-0"
      >
        {item.is_completed ? (
          <CheckSquare className="w-4 h-4 text-purple-600" />
        ) : (
          <Square className="w-4 h-4" />
        )}
      </button>
      <div className="flex-1">
        <p className={`text-sm transition-colors ${item.is_completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
          {item.text}
        </p>
        {item.assignee && (
          <span className={`text-[10px] font-semibold mt-2 inline-block px-2 py-0.5 rounded-md uppercase tracking-wider ${item.is_completed ? 'bg-gray-100 text-gray-400' : 'bg-purple-50 text-purple-600'}`}>
            @{item.assignee}
          </span>
        )}
      </div>
    </div>
  );
}