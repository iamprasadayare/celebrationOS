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

  // Format master date
  const masterDateFormatted = new Date(targetDate).toLocaleDateString('en-US', {
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
    <div className="bg-[#ffffff] p-4 sm:p-6 rounded-xl border border-[#c7c4d7] shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 pb-3">
          <div>
            <h2 className="text-lg font-bold text-[#131b2e] font-headline">
              Chronological Timeline
            </h2>
            <p className="text-xs text-[#464554] mt-0.5">
              Critical countdown path to {masterDateFormatted}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onTriggerRunSheetAI}
              aria-label="Generate AI Hourly Run-Sheet"
              className="inline-flex items-center gap-1 h-9 px-2.5 rounded-lg border border-[#c7c4d7] bg-[#ffffff] hover:bg-[#f2f3ff] text-[#4338ca] text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-[#4338ca]"
              title="AI Run-Sheet Generator"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AI Run-Sheet</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              aria-label="Add new timeline task"
              className="inline-flex items-center gap-1 h-9 px-3 rounded-lg bg-[#e2e7ff] hover:bg-[#dae2fd] text-[#2a14b4] text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-[#4338ca] shrink-0"
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
          className="flex items-center gap-1 overflow-x-auto py-2 border-b border-[#eaedff]"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedPhase === 'all'}
            onClick={() => setSelectedPhase('all')}
            className={`px-2.5 py-1 text-center text-xs rounded-lg transition-colors whitespace-nowrap font-medium ${
              selectedPhase === 'all'
                ? 'bg-[#4338ca] text-white font-bold shadow-xs'
                : 'text-[#464554] hover:bg-[#eaedff]'
            }`}
          >
            All
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={selectedPhase === '6_months_out'}
            onClick={() => setSelectedPhase('6_months_out')}
            className={`px-2.5 py-1 text-center text-xs rounded-lg transition-colors whitespace-nowrap font-medium ${
              selectedPhase === '6_months_out'
                ? 'bg-[#4338ca] text-white font-bold shadow-xs'
                : 'text-[#464554] hover:bg-[#eaedff]'
            }`}
          >
            6+ Mos
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={selectedPhase === '3_months_out'}
            onClick={() => setSelectedPhase('3_months_out')}
            className={`px-2.5 py-1 text-center text-xs rounded-lg transition-colors whitespace-nowrap font-medium ${
              selectedPhase === '3_months_out'
                ? 'bg-[#4338ca] text-white font-bold shadow-xs'
                : 'text-[#464554] hover:bg-[#eaedff]'
            }`}
          >
            3 Mos
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={selectedPhase === '1_month_out'}
            onClick={() => setSelectedPhase('1_month_out')}
            className={`px-2.5 py-1 text-center text-xs rounded-lg transition-colors whitespace-nowrap font-medium ${
              selectedPhase === '1_month_out'
                ? 'bg-[#4338ca] text-white font-bold shadow-xs'
                : 'text-[#464554] hover:bg-[#eaedff]'
            }`}
          >
            1 Mo (Active)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={selectedPhase === 'week_of'}
            onClick={() => setSelectedPhase('week_of')}
            className={`px-2.5 py-1 text-center text-xs rounded-lg transition-colors whitespace-nowrap font-medium ${
              selectedPhase === 'week_of'
                ? 'bg-[#4338ca] text-white font-bold shadow-xs'
                : 'text-[#464554] hover:bg-[#eaedff]'
            }`}
          >
            Week Of
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={selectedPhase === 'day_of'}
            onClick={() => setSelectedPhase('day_of')}
            className={`px-2.5 py-1 text-center text-xs rounded-lg transition-colors whitespace-nowrap font-medium ${
              selectedPhase === 'day_of'
                ? 'bg-[#4338ca] text-white font-bold shadow-xs'
                : 'text-[#464554] hover:bg-[#eaedff]'
            }`}
          >
            Day-Of
          </button>
        </div>

        {/* Milestone Task List */}
        <div className="mt-3 flex flex-col gap-2.5 overflow-y-auto max-h-[380px] pr-1">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#464554]">
              No tasks in this phase milestone. Click "+ Task" to add one.
            </div>
          ) : (
            filteredTasks.map((task) => {
              const dateInfo = computeTaskDueDate(targetDate, task.daysBeforeEvent);
              const isUrgent = !task.completed && task.priority === 'high';

              return (
                <div
                  key={task.id}
                  className={`p-3 rounded-lg transition-all ${
                    task.completed
                      ? 'bg-[#f2f3ff] opacity-75'
                      : isUrgent
                      ? 'bg-[#ffffff] shadow-xs border border-[#ffdbca] ring-1 ring-[#873b00]/20'
                      : 'bg-[#f2f3ff]'
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
                        className="w-4 h-4 mt-0.5 rounded text-[#4338ca] focus:ring-[#4338ca] shrink-0 cursor-pointer"
                      />
                      <div className="min-w-0">
                        <label
                          htmlFor={`task-${task.id}`}
                          className={`text-xs text-[#131b2e] cursor-pointer block leading-snug ${
                            task.completed ? 'line-through text-[#464554]' : isUrgent ? 'font-bold' : 'font-semibold'
                          }`}
                        >
                          {task.title}
                        </label>

                        {/* Metadata line */}
                        <div className="font-mono-data text-[11px] text-[#464554] mt-0.5 flex items-center gap-1.5 flex-wrap">
                          {task.dueTimeOfDay ? (
                            <span className="text-[#4338ca] font-semibold">{task.dueTimeOfDay}</span>
                          ) : (
                            <span>T-{task.daysBeforeEvent} Days</span>
                          )}

                          {task.assignedVendorOrLead && (
                            <>
                              <span>•</span>
                              <span className="truncate">{task.assignedVendorOrLead}</span>
                            </>
                          )}

                          {isUrgent && (
                            <span className="text-[#873b00] font-semibold flex items-center gap-1">
                              <AlarmClock className="w-3 h-3 text-[#632900]" />
                              Due soon
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0">
                      {task.completed ? (
                        <span className="px-2 py-0.5 rounded bg-[#eaedff] text-[#464554] text-[10px] font-bold uppercase">
                          Done
                        </span>
                      ) : task.priority === 'high' ? (
                        <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] text-[10px] font-bold uppercase">
                          High Pri
                        </span>
                      ) : task.priority === 'medium' ? (
                        <span className="px-2 py-0.5 rounded bg-[#ffdbca] text-[#331200] text-[10px] font-semibold uppercase">
                          Medium
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-[#eaedff] text-[#464554] text-[10px] font-semibold uppercase">
                          Low
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Optional Action / Metric sub-row (as shown in stitch design) */}
                  {(task.metrics || task.actionLabel) && !task.completed && (
                    <div className="flex items-center justify-between gap-2 pt-2 mt-2 border-t border-[#eaedff]">
                      <span className="text-[11px] text-[#464554]">
                        {task.metrics || dateInfo.formattedDate}
                      </span>
                      {task.actionLabel && (
                        <button
                          type="button"
                          onClick={() => alert(`Simulated: ${task.actionLabel} initiated for "${task.title}".`)}
                          className="inline-flex items-center gap-1 text-[11px] text-[#4338ca] hover:underline font-semibold"
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
        <div className="fixed inset-0 z-50 bg-[#131b2e]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#c7c4d7] shadow-lg w-full max-w-md p-5 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-[#131b2e] font-headline">Add Milestone Task</h3>
            <p className="text-xs text-[#464554] mt-0.5">Attach a relative deadline and responsibility lead.</p>

            <form onSubmit={handleSaveTask} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#131b2e] mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Confirm floral centerpiece proofing"
                  className="w-full h-9 px-3 text-xs rounded-lg border border-[#c7c4d7] focus:ring-2 focus:ring-[#4338ca] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#131b2e] mb-1">Phase Bucket</label>
                  <select
                    value={newPhase}
                    onChange={(e) => setNewPhase(e.target.value as TaskBucket)}
                    className="w-full h-9 px-2.5 text-xs rounded-lg border border-[#c7c4d7] focus:ring-2 focus:ring-[#4338ca] focus:outline-none bg-white"
                  >
                    <option value="6_months_out">6+ Months Out</option>
                    <option value="3_months_out">3 Months Out</option>
                    <option value="1_month_out">1 Month Out</option>
                    <option value="week_of">Week Of</option>
                    <option value="day_of">Day-Of</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#131b2e] mb-1">Days Before Event (T-)</label>
                  <input
                    type="number"
                    min={0}
                    max={365}
                    required
                    value={newDaysOffset}
                    onChange={(e) => setNewDaysOffset(Number(e.target.value))}
                    className="w-full h-9 px-2.5 text-xs rounded-lg border border-[#c7c4d7] focus:ring-2 focus:ring-[#4338ca] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#131b2e] mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as PriorityLevel)}
                    className="w-full h-9 px-2.5 text-xs rounded-lg border border-[#c7c4d7] focus:ring-2 focus:ring-[#4338ca] focus:outline-none bg-white"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#131b2e] mb-1">Lead / Vendor</label>
                  <input
                    type="text"
                    value={newVendor}
                    onChange={(e) => setNewVendor(e.target.value)}
                    placeholder="e.g. Chef Raghu"
                    className="w-full h-9 px-2.5 text-xs rounded-lg border border-[#c7c4d7] focus:ring-2 focus:ring-[#4338ca] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#c7c4d7]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="h-8 px-3 rounded-lg border border-[#c7c4d7] text-xs font-medium text-[#464554] hover:bg-[#f2f3ff]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-4 rounded-lg bg-[#4338ca] text-white text-xs font-semibold hover:bg-[#372abf]"
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
