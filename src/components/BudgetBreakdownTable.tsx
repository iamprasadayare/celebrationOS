/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BudgetItem, BudgetSummary } from '../types/event';
import { formatCurrency } from '../utils/budgetMath';
import {
  Sparkles,
  Check,
  AlertTriangle,
  Minus,
  PiggyBank,
  MoreVertical,
  Plus,
  Trash2,
  Edit2,
  Users,
} from 'lucide-react';

interface BudgetBreakdownTableProps {
  items: BudgetItem[];
  summary: BudgetSummary;
  currencySymbol: string;
  privacyMask: boolean;
  onTriggerRebalance: () => void;
  onAddItem: (item: Omit<BudgetItem, 'id'>) => void;
  onDeleteItem: (id: string) => void;
  onUpdateItem: (item: BudgetItem) => void;
  guestCount: number;
  onGuestCountChange: (count: number) => void;
}

export const BudgetBreakdownTable: React.FC<BudgetBreakdownTableProps> = ({
  items,
  summary,
  currencySymbol = '₹',
  privacyMask,
  onTriggerRebalance,
  onAddItem,
  onDeleteItem,
  onUpdateItem,
  guestCount,
  onGuestCountChange,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);
  const [showSlider, setShowSlider] = useState(false);

  // Form state
  const [newItemCategory, setNewItemCategory] = useState('Venue & Facilities');
  const [newItemName, setNewItemName] = useState('');
  const [newItemAllocated, setNewItemAllocated] = useState(100000);
  const [newItemActual, setNewItemActual] = useState(100000);
  const [newItemPaid, setNewItemPaid] = useState(0);

  const handleSaveNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    let status: 'under_budget' | 'on_cap' | 'over_budget' = 'on_cap';
    if (newItemAllocated > newItemActual) status = 'under_budget';
    else if (newItemAllocated < newItemActual) status = 'over_budget';

    onAddItem({
      category: newItemCategory,
      name: newItemName.trim(),
      allocated: Number(newItemAllocated),
      quotedOrActual: Number(newItemActual),
      paid: Number(newItemPaid),
      status,
      perHeadScalingRatio: 0.5,
    });

    setNewItemName('');
    setNewItemAllocated(100000);
    setNewItemActual(100000);
    setNewItemPaid(0);
    setShowAddModal(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    let status: 'under_budget' | 'on_cap' | 'over_budget' = 'on_cap';
    if (editingItem.allocated > editingItem.quotedOrActual) status = 'under_budget';
    else if (editingItem.allocated < editingItem.quotedOrActual) status = 'over_budget';

    onUpdateItem({
      ...editingItem,
      status,
    });
    setEditingItem(null);
  };

  // Trending Indian Festive Dot Colors
  const dotColors = [
    'bg-[#ff5e14]', // Royal Saffron
    'bg-[#6d28d9]', // Royal Violet
    'bg-[#00875a]', // Emerald
    'bg-[#ec4899]', // Gulabi Pink
    'bg-[#d97706]', // Royal Gold
    'bg-[#0284c7]', // Peacock Blue
  ];

  return (
    <div className="bg-[#ffffff] p-4 sm:p-6 rounded-2xl border border-[#e5ddcf] shadow-[0_2px_12px_rgba(255,94,20,0.03)] flex flex-col justify-between">
      <div>
        {/* Table Header & AI Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4">
          <div>
            <h2 className="text-lg font-bold text-[#18122b] font-headline">
              Budget & Kharcha Breakdown
            </h2>
            <p className="text-xs text-[#544c60] mt-0.5">
              Real-time variance tracking against guaranteed initial caps
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <button
              type="button"
              onClick={() => setShowSlider(!showSlider)}
              aria-label="Toggle What-If Guest Count Scaler"
              className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-[#ff5e14] ${
                showSlider
                  ? 'bg-gradient-to-r from-[#ff5e14] to-[#ff8a00] text-white shadow-xs'
                  : 'bg-[#f8f4ed] text-[#18122b] border border-[#e5ddcf] hover:bg-[#fff1eb] hover:border-[#fed7aa]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>What-If Scaler</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              aria-label="Add new budget line item"
              className="inline-flex items-center gap-1 h-9 px-3 rounded-xl border border-[#e5ddcf] bg-[#ffffff] hover:bg-[#f8f4ed] text-[#18122b] text-xs font-bold transition-colors focus-visible:ring-2 focus-visible:ring-[#6d28d9]"
            >
              <Plus className="w-3.5 h-3.5 text-[#ff5e14]" />
              <span>Add Line</span>
            </button>

            <button
              type="button"
              onClick={onTriggerRebalance}
              aria-label="Trigger AI Budget Rebalance & Optimization"
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-gradient-to-r from-[#fff1eb] to-[#fef3c7] hover:from-[#fed7aa] hover:to-[#fde68a] text-[#c2410c] border border-[#fed7aa] text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-[#ff5e14] shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-[#ff5e14]" />
              <span>AI Rebalance</span>
            </button>
          </div>
        </div>

        {/* What-If Guest Scaler Slider */}
        {showSlider && (
          <div className="mb-4 p-4 bg-gradient-to-r from-[#fff1eb]/60 to-[#fef3c7]/60 border border-[#fed7aa] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#ff5e14]" />
                <span className="text-xs font-bold text-[#18122b]">
                  What-If Guest Scaler: <strong className="text-[#ff5e14] font-headline">{guestCount} Guests</strong>
                </span>
              </div>
              <p className="text-[11px] text-[#544c60] mt-0.5">
                Scales variable catering and favor expenses while preserving fixed venue caps.
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-64">
              <input
                type="range"
                min={20}
                max={600}
                step={5}
                value={guestCount}
                onChange={(e) => onGuestCountChange(Number(e.target.value))}
                aria-label="Simulated guest count slider"
                className="w-full accent-[#ff5e14] cursor-pointer"
              />
              <span className="font-mono-data text-xs font-bold text-[#18122b] w-12 text-right">
                {guestCount}
              </span>
            </div>
          </div>
        )}

        {/* Accessible Data Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[560px]">
            <caption className="sr-only">
              Celebration categorized budget caps, quoted commitments, payments disbursed, and variance in Indian Rupees
            </caption>
            <thead>
              <tr className="bg-[#f8f4ed] text-[#18122b] text-[11px] font-bold border-b border-[#e5ddcf]">
                <th scope="col" className="py-2.5 px-3 rounded-l-xl">Category & Item</th>
                <th scope="col" className="py-2.5 px-3 text-right">Allocated</th>
                <th scope="col" className="py-2.5 px-3 text-right">Quoted / Act.</th>
                <th scope="col" className="py-2.5 px-3 text-right">Paid</th>
                <th scope="col" className="py-2.5 px-3 text-center">Variance Status</th>
                <th scope="col" className="py-2.5 px-3 rounded-r-xl text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0eae1]">
              {items.map((item, idx) => {
                const variance = item.allocated - item.quotedOrActual;
                const dotColor = dotColors[idx % dotColors.length];

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-[#fff1eb]/40 transition-colors group"
                  >
                    <td className="py-3 px-3 text-[#18122b] font-semibold">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${dotColor} shrink-0 shadow-xs`} />
                        <div className="truncate">
                          <p className="truncate font-bold text-[#18122b]">{item.name}</p>
                          <span className="text-[10px] text-[#544c60] font-medium">{item.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-mono-data text-[#18122b] font-medium">
                      {formatCurrency(item.allocated, currencySymbol, privacyMask)}
                    </td>
                    <td className={`py-3 px-3 text-right font-mono-data font-semibold ${
                      item.status === 'over_budget' ? 'text-[#c2410c] font-bold' : 'text-[#18122b]'
                    }`}>
                      {formatCurrency(item.quotedOrActual, currencySymbol, privacyMask)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono-data text-[#544c60]">
                      {formatCurrency(item.paid, currencySymbol, privacyMask)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {variance > 0 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#d1fae5] text-[#065f46] border border-[#a7f3d0] text-[11px] font-bold">
                          <Check className="w-3 h-3 text-[#059669]" />
                          <span>-{formatCurrency(variance, currencySymbol, privacyMask)}</span>
                        </span>
                      )}
                      {variance < 0 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ffe4e6] text-[#9f1239] border border-[#fecdd3] text-[11px] font-bold">
                          <AlertTriangle className="w-3 h-3" />
                          <span>+{formatCurrency(Math.abs(variance), currencySymbol, privacyMask)}</span>
                        </span>
                      )}
                      {variance === 0 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#f8f4ed] text-[#544c60] border border-[#e5ddcf] text-[11px] font-bold">
                          <Minus className="w-3 h-3" />
                          <span>On Cap</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setEditingItem(item)}
                          aria-label={`Edit ${item.name}`}
                          className="text-[#544c60] hover:text-[#ff5e14] p-1 rounded-lg hover:bg-[#fff1eb] transition-colors focus-visible:ring-2 focus-visible:ring-[#ff5e14]"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteItem(item.id)}
                          aria-label={`Delete ${item.name}`}
                          className="text-[#544c60] hover:text-[#e11d48] p-1 rounded-lg hover:bg-[#ffe4e6] transition-colors focus-visible:ring-2 focus-visible:ring-[#e11d48]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table Footer Summary */}
      <div className="mt-4 pt-3 bg-gradient-to-r from-[#f8f4ed] to-[#fff1eb]/60 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 border border-[#e5ddcf]">
        <div className="flex items-center gap-2">
          <PiggyBank className="w-4 h-4 text-[#00875a]" />
          <span className="text-xs text-[#18122b] font-bold">
            {summary.netConsolidatedSurplus >= 0
              ? `Net Consolidated Surplus: ${formatCurrency(summary.netConsolidatedSurplus, currencySymbol, privacyMask)} under initial ceiling`
              : `Net Variance Deficit: ${formatCurrency(Math.abs(summary.netConsolidatedSurplus), currencySymbol, privacyMask)} over initial ceiling`}
          </span>
        </div>
        <div className="flex items-center gap-4 text-right">
          <span className="text-xs text-[#544c60]">
            Allocated: <strong className="text-[#18122b] font-mono-data font-bold">{formatCurrency(summary.totalAllocated, currencySymbol, privacyMask)}</strong>
          </span>
          <span className="text-xs text-[#544c60]">
            Actual: <strong className="text-[#6d28d9] font-mono-data font-bold">{formatCurrency(summary.totalQuotedOrActual, currencySymbol, privacyMask)}</strong>
          </span>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#18122b]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#e5ddcf] shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-[#18122b] font-headline">Add Budget Line Item</h3>
            <p className="text-xs text-[#544c60] mt-0.5">Create a newly tracked expense in Indian Rupees (₹).</p>

            <form onSubmit={handleSaveNewItem} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#18122b] mb-1">Item Title</label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Shehnai Troupe for Varmala Arrival"
                  className="w-full h-10 px-3 text-xs rounded-xl border border-[#e5ddcf] focus:ring-2 focus:ring-[#ff5e14] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#18122b] mb-1">Category</label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  className="w-full h-10 px-3 text-xs rounded-xl border border-[#e5ddcf] focus:ring-2 focus:ring-[#ff5e14] focus:outline-none bg-white font-medium"
                >
                  <option value="Venue & Facilities">Venue & Facilities</option>
                  <option value="Catering & Bar">Catering & Bar</option>
                  <option value="Decor & Florals">Decor & Florals</option>
                  <option value="Photography & Cinema">Photography & Cinema</option>
                  <option value="Entertainment & Sound">Entertainment & Sound</option>
                  <option value="Logistics & Guest Transit">Logistics & Guest Transit</option>
                  <option value="Permits & Safety">Permits & Safety</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#18122b] mb-1">Allocated (₹)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={newItemAllocated}
                    onChange={(e) => setNewItemAllocated(Number(e.target.value))}
                    className="w-full h-10 px-2.5 text-xs rounded-xl border border-[#e5ddcf] focus:ring-2 focus:ring-[#ff5e14] focus:outline-none font-mono-data"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#18122b] mb-1">Quoted (₹)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={newItemActual}
                    onChange={(e) => setNewItemActual(Number(e.target.value))}
                    className="w-full h-10 px-2.5 text-xs rounded-xl border border-[#e5ddcf] focus:ring-2 focus:ring-[#ff5e14] focus:outline-none font-mono-data"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#18122b] mb-1">Paid (₹)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={newItemPaid}
                    onChange={(e) => setNewItemPaid(Number(e.target.value))}
                    className="w-full h-10 px-2.5 text-xs rounded-xl border border-[#e5ddcf] focus:ring-2 focus:ring-[#ff5e14] focus:outline-none font-mono-data"
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
                  className="h-9 px-5 rounded-xl bg-gradient-to-r from-[#ff5e14] to-[#ff8a00] text-white text-xs font-bold hover:from-[#ea580c] hover:to-[#f97316] shadow-xs"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-[#18122b]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#e5ddcf] shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-[#18122b] font-headline">Edit Budget Item</h3>
            <p className="text-xs text-[#544c60] mt-0.5">Update numbers for {editingItem.name}.</p>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#18122b] mb-1">Item Title</label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full h-10 px-3 text-xs rounded-xl border border-[#e5ddcf] focus:ring-2 focus:ring-[#ff5e14] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#18122b] mb-1">Allocated (₹)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={editingItem.allocated}
                    onChange={(e) => setEditingItem({ ...editingItem, allocated: Number(e.target.value) })}
                    className="w-full h-10 px-2.5 text-xs rounded-xl border border-[#e5ddcf] focus:ring-2 focus:ring-[#ff5e14] focus:outline-none font-mono-data"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#18122b] mb-1">Quoted (₹)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={editingItem.quotedOrActual}
                    onChange={(e) => setEditingItem({ ...editingItem, quotedOrActual: Number(e.target.value) })}
                    className="w-full h-10 px-2.5 text-xs rounded-xl border border-[#e5ddcf] focus:ring-2 focus:ring-[#ff5e14] focus:outline-none font-mono-data"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#18122b] mb-1">Paid (₹)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={editingItem.paid}
                    onChange={(e) => setEditingItem({ ...editingItem, paid: Number(e.target.value) })}
                    className="w-full h-10 px-2.5 text-xs rounded-xl border border-[#e5ddcf] focus:ring-2 focus:ring-[#ff5e14] focus:outline-none font-mono-data"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e5ddcf]">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="h-9 px-4 rounded-xl border border-[#e5ddcf] text-xs font-semibold text-[#544c60] hover:bg-[#f8f4ed]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-5 rounded-xl bg-gradient-to-r from-[#ff5e14] to-[#ff8a00] text-white text-xs font-bold hover:from-[#ea580c] hover:to-[#f97316] shadow-xs"
                >
                  Update Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
