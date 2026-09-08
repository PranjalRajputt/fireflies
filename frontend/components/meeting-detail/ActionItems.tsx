'use client';

import { useState } from 'react';
import { CheckSquare, Plus } from 'lucide-react';
import ActionItemRow from './ActionItemRow';

interface ActionItem {
  id: string | number;
  text: string;
  is_completed: boolean;
  assignee?: string;
}

interface ActionItemsProps {
  initialItems: ActionItem[];
}

export default function ActionItems({ initialItems }: ActionItemsProps) {
  const [items, setItems] = useState<ActionItem[]>(initialItems || []);
  const [newItemText, setNewItemText] = useState('');
  const [newItemAssignee, setNewItemAssignee] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleToggle = (id: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, is_completed: !item.is_completed } : item
    ));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    const newItem: ActionItem = {
      id: Date.now(),
      text: newItemText.trim(),
      is_completed: false,
      assignee: newItemAssignee.trim() || undefined,
    };

    setItems([...items, newItem]);
    setNewItemText('');
    setNewItemAssignee('');
    setIsAdding(false);
  };

  const completedCount = items.filter(i => i.is_completed).length;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="border-b border-gray-100 p-4 bg-gray-50/50 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 flex items-center">
          <CheckSquare className="w-4 h-4 mr-2 text-green-500" /> Action Items
        </h3>
        <div className="flex items-center space-x-3">
          <span className="text-xs font-medium text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded-md">
            {completedCount} / {items.length} Done
          </span>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="p-1 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition"
            title="Add task"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="p-3 border-b border-gray-100 bg-purple-50/30 space-y-2">
          <input 
            type="text"
            placeholder="Task description..."
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-purple-500"
            autoFocus
          />
          <div className="flex space-x-2">
            <input 
              type="text"
              placeholder="Assignee (optional)"
              value={newItemAssignee}
              onChange={(e) => setNewItemAssignee(e.target.value)}
              className="flex-1 px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs outline-none"
            />
            <button type="submit" className="px-3 py-1 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700">
              Add Task
            </button>
          </div>
        </form>
      )}

      <div className="p-2 overflow-y-auto flex-1">
        {items.length > 0 ? (
          items.map((item) => (
            <ActionItemRow key={item.id} item={item} onToggle={handleToggle} />
          ))
        ) : (
          <div className="py-10 text-center text-sm text-gray-400">No action items found.</div>
        )}
      </div>
    </div>
  );
}