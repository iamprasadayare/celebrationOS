/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { TimelineTask, TaskBucket, PriorityLevel } from '../types/event';
import { computeTaskDueDate } from '../utils/timelineMath';
import {
  Clock,
  Plus,
  AlarmClock,
  Send,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface ChronologicalTimelineProps {
  tasks: TimelineTask[];
  targetDate: string;
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: Omit<TimelineTask, 'id'>) => void;
  onTriggerRunSheetAI: () => void;
}

export const ChronologicalTimeline: React.FC<ChronologicalTimelineProps> = ({
  tasks,
  targetDate,
  onToggleTask,
  onAddTask,
  onTriggerRunSheetAI,
}) => {
  const [selectedPhase, setSelectedPhase] = useState<TaskBucket | 'all'>('1_month_out');
  const [priorityFilter, setPriorityFilter] = useState<'all' | PriorityLevel>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDaysOffset, setNewDaysOffset] = useState(30);
  const [newPriority, setNewPriority] = useState<PriorityLevel>('high');
  const [newVendor, setNewVendor] = useState('');
  const [newPhase, setNewPhase] = useState<TaskBucket>('1_month_out');

  // Format master date in en-IN
  const masterDateFormatted = new Date(targetDate).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Filter tasks based on selected phase tab and priority filter
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (selectedPhase !== 'all' && task.phase !== selectedPhase) {
        return false;
      }
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
        return false;
      }
      return true;
    });
  }, [tasks, selectedPhase, priorityFilter]);

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle.trim(),
      phase: newPhase,
      daysBeforeEvent: Number(newDaysOffset),
      priority: newPriority,
      completed: false,
      assignedVendorOrLead: newVendor.trim() || undefined,
      details: `T-${newDaysOffset} Days Offset`,
    });

    setNewTitle('');
    setNewDaysOffset(30);
    setNewVendor('');
    setShowAddModal(false);
  };

  return (
    <div className="bg-[#ffffff] p-4 sm:p-6 rounded-2xl border border-[#e5ddcf] shadow-[0_2px_12px_rgba(255,94,20,0.03)] flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 pb-3">
          <div>
            <h2 className="text-lg font-bold text-[#18122b] font-headline">
              Chronological Timeline
            </h2>
            <p className="text-xs text-[#544c60] mt-0.5">
              Critical countdown path to {masterDateFormatted}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onTriggerRunSheetAI}
              aria-label="Generate AI Hourly Run-Sheet"
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-[#fed7aa] bg-[#fff1eb] hover:bg-[#fed7aa] text-[#c2410c] text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-[#ff5e14]"
              title="AI Run-Sheet Generator"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ff5e14]" />
              <span className="hidden sm:inline">AI Run-Sheet</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              aria-label="Add new timeline task"
              className="inline-flex items-center gap-1 h-9 px-3.5 rounded-xl bg-gradient-to-r from-[#6d28d9] to-[#4f46e5] hover:from-[#581c87] hover:to-[#4338ca] text-white text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-[#6d28d9] shrink-0 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Task</span>
            </button>
          </div>
        </div>

        {/* Phase Tabs */}
        <div
          role="tablist"
          aria-label="Timeline Phases"
          className="flex items-center gap-1 overflow-x-auto py-2 border-b border-[#f0eae1]"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedPhase === 'all'}
            onClick={() => setSelectedPhase('all')}
            className={`px-3 py-1 text-center text-xs rounded-xl transition-all whitespace-nowrap font-bold ${
              selectedPhase === 'all'
                ? 'bg-gradient-to-r from-[#6d28d9] to-[#4f46e5] text-white shadow-xs'
                : 'text-[#544c60] hover:bg-[#fff1eb] hover:text-[#ff5e14]'
            }`}
          >
            All
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={selectedPhase === '6_months_out'}
            onClick={() => setSelectedPhase('6_months_out')}
            className={`px-3 py-1 text-center text-xs rounded-xl transition-all whitespace-nowrap font-bold ${
              selectedPhase === '6_months_out'
                ? 'bg-gradient-to-r from-[#6d28d9] to-[#4f46e5] text-white shadow-xs'
                : 'text-[#544c60] hover:bg-[#fff1eb] hover:text-[#ff5e14]'
            }`}
          >
            6+ Mos
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={selectedPhase === '3_months_out'}
            onClick={() => setSelectedPhase('3_months_out')}
            className={`px-3 py-1 text-center text-xs rounded-xl transition-all whitespace-nowrap font-bold ${
              selectedPhase === '3_months_out'
                ? 'bg-gradient-to-r from-[#6d28d9] to-[#4f46e5] text-white shadow-xs'
                : 'text-[#544c60] hover:bg-[#fff1eb] hover:text-[#ff5e14]'
            }`}
          >
            3 Mos
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={selectedPhase === '1_month_out'}
            onClick={() => setSelectedPhase('1_month_out')}
            className={`px-3 py-1 text-center text-xs rounded-xl transition-all whitespace-nowrap font-bold ${
              selectedPhase === '1_month_out'
                ? 'bg-gradient-to-r from-[#ff5e14] to-[#ff8a00] text-white shadow-xs'
                : 'text-[#544c60] hover:bg-[#fff1eb] hover:text-[#ff5e14]'
            }`}
          >
            1 Mo (Active)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={selectedPhase === 'week_of'}
            onClick={() => setSelectedPhase('week_of')}
            className={`px-3 py-1 text-center text-xs rounded-xl transition-all whitespace-nowrap font-bold ${
              selectedPhase === 'week_of'
                ? 'bg-gradient-to-r from-[#6d28d9] to-[#4f46e5] text-white shadow-xs'
                : 'text-[#544c60] hover:bg-[#fff1eb] hover:text-[#ff5e14]'
            }`}
          >
            Week Of
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={selectedPhase === 'day_of'}
            onClick={() => setSelectedPhase('day_of')}
            className={`px-3 py-1 text-center text-xs rounded-xl transition-all whitespace-nowrap font-bold ${
              selectedPhase === 'day_of'
                ? 'bg-gradient-to-r from-[#ec4899] to-[#f43f5e] text-white shadow-xs'
                : 'text-[#544c60] hover:bg-[#ffe4e6] hover:text-[#ec4899]'
            }`}
          >
            Day-Of (Shaadi)
          </button>
        </div>

        {/* Milestone Task List */}
        <div className="mt-3 flex flex-col gap-2.5 overflow-y-auto max-h-[380px] pr-1">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#544c60]">
              No tasks in this phase milestone. Click "+ Task" to add one.
            </div>
          ) : (
            filteredTasks.map((task) => {
              const dateInfo = computeTaskDueDate(targetDate, task.daysBeforeEvent);
              const isUrgent = !task.completed && task.priority === 'high';

              return (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-xl transition-all border ${
                    task.completed
                      ? 'bg-[#f8f4ed] border-[#e5ddcf] opacity-80'
                      : isUrgent
                      ? 'bg-[#ffffff] shadow-xs border-[#fed7aa] ring-2 ring-[#ff5e14]/20'
                      : 'bg-[#f8f4ed] border-[#e5ddcf]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => onToggleTask(task.id)}
                        id={`task-${task.id}`}
                        aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
                        className="w-4 h-4 mt-0.5 rounded text-[#ff5e14] focus:ring-[#ff5e14] shrink-0 cursor-pointer accent-[#ff5e14]"
                      />
                      <div className="min-w-0">
                        <label
                          htmlFor={`task-${task.id}`}
                          className={`text-xs text-[#18122b] cursor-pointer block leading-snug ${
                            task.completed ? 'line-through text-[#544c60]' : isUrgent ? 'font-bold' : 'font-semibold'
                          }`}
                        >
                          {task.title}
                        </label>

                        {/* Metadata line */}
                        <div className="font-mono-data text-[11px] text-[#544c60] mt-0.5 flex items-center gap-1.5 flex-wrap">
                          {task.dueTimeOfDay ? (
                            <span className="text-[#6d28d9] font-bold bg-[#ede9fe] px-1.5 py-0.2 rounded">{task.dueTimeOfDay}</span>
                          ) : (
                            <span className="font-semibold">T-{task.daysBeforeEvent} Days</span>
                          )}

                          {task.assignedVendorOrLead && (
                            <>
                              <span>•</span>
                              <span className="truncate">{task.assignedVendorOrLead}</span>
                            </>
                          )}

                          {isUrgent && (
                            <span className="text-[#c2410c] font-bold flex items-center gap-1">
                              <AlarmClock className="w-3.5 h-3.5 text-[#ff5e14]" />
                              Due soon
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0">
                      {task.completed ? (
                        <span className="px-2 py-0.5 rounded-full bg-[#d1fae5] text-[#065f46] text-[10px] font-bold uppercase border border-[#a7f3d0]">
                          Done
                        </span>
                      ) : task.priority === 'high' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#ffe4e6] text-[#9f1239] text-[10px] font-bold uppercase border border-[#fecdd3]">
                          High Pri
                        </span>
                      ) : task.priority === 'medium' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#fff1eb] text-[#c2410c] text-[10px] font-bold uppercase border border-[#fed7aa]">
                          Medium
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-[#f8f4ed] text-[#544c60] text-[10px] font-bold uppercase border border-[#e5ddcf]">
                          Low
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Optional Action / Metric sub-row */}
                  {(task.metrics || task.actionLabel) && !task.completed && (
                    <div className="flex items-center justify-between gap-2 pt-2 mt-2 border-t border-[#f0eae1]">
                      <span className="text-[11px] text-[#544c60] font-medium">
                        {task.metrics || dateInfo.formattedDate}
                      </span>
                      {task.actionLabel && (
                        <button
                          type="button"
                          onClick={() => alert(`Simulated: ${task.actionLabel} initiated for "${task.title}".`)}
                          className="inline-flex items-center gap-1 text-[11px] text-[#ff5e14] hover:underline font-bold"
                        >
                          <span>{task.actionLabel}</span>
                          <Send className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#18122b]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#e5ddcf] shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-[#18122b] font-headline">Add Milestone Task</h3>
            <p className="text-xs text-[#544c60] mt-0.5">Attach a relative deadline and responsibility lead.</p>

            <form onSubmit={handleSaveTask} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#18122b] mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Confirm floral mandap sample with florist"
                  className="w-full h-10 px-3 text-xs rounded-xl border border-[#e5ddcf] focus:ring-2 focus:ring-[#ff5e14] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#18122b] mb-1">Phase Bucket</label>
                  <select
                    value={newPhase}
                    onChange={(e) => setNewPhase(e.target.value as TaskBucket)}
                    className="w-full h-10 px-2.5 text-xs rounded-xl border border-[#e5ddcf] focus:ring-2 focus:ring-[#ff5e14] focus:outline-none bg-white font-medium"
                  >
                    <option value="6_months_out">6+ Months Out</option>
                    <option value="3_months_out">3 Months Out</option>
                    <option value="1_month_out">1 Month Out</option>
                    <option value="week_of">Week Of</option>
                    <option value="day_of">Day-Of</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#18122b] mb-1">Days Before Event (T-)</label>
                  <input
                    type="number"
                    min={0}
                    max={365}
                    required
                    value={newDaysOffset}
                    onChange={(e) => setNewDaysOffset(Number(e.target.value))}
                    className="w-full h-10 px-2.5 text-xs rounded-xl border border-[#e5ddcf] focus:ring-2 focus:ring-[#ff5e14] focus:outline-none font-mono-data"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#18122b] mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as PriorityLevel)}
                    className="w-full h-10 px-2.5 text-xs rounded-xl border border-[#e5ddcf] focus:ring-2 focus:ring-[#ff5e14] focus:outline-none bg-white font-medium"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#18122b] mb-1">Lead / Vendor</label>
                  <input
                    type="text"
                    value={newVendor}
                    onChange={(e) => setNewVendor(e.target.value)}
                    placeholder="e.g. Panditji / Chef Raghu"
                    className="w-full h-10 px-2.5 text-xs rounded-xl border border-[#e5ddcf] focus:ring-2 focus:ring-[#ff5e14] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e5ddcf]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="h-9 px-4 rounded-xl border border-[#e5ddcf] text-xs font-semibold text-[#544c60] hover:bg-[#f8f4ed]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-5 rounded-xl bg-gradient-to-r from-[#6d28d9] to-[#4f46e5] text-white text-xs font-bold hover:from-[#581c87] hover:to-[#4338ca] shadow-xs"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
