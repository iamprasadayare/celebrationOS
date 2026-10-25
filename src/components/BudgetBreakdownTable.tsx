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
  currencySymbol,
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
  const [newItemAllocated, setNewItemAllocated] = useState(1000);
  const [newItemActual, setNewItemActual] = useState(1000);
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
    setNewItemAllocated(1000);
    setNewItemActual(1000);
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

  // Dot color palette by category index
  const dotColors = [
    'bg-[#4338ca]',
    'bg-[#873b00]',
    'bg-[#006c4e]',
    'bg-[#ba1a1a]',
    'bg-[#5148d7]',
    'bg-[#007353]',
  ];

  return (
    <div className="bg-[#ffffff] p-4 sm:p-6 rounded-xl border border-[#c7c4d7] shadow-xs flex flex-col justify-between">
      <div>
        {/* Table Header & AI Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4">
          <div>
            <h2 className="text-lg font-bold text-[#131b2e] font-headline">
              Budget Breakdown & Cost Caps
            </h2>
            <p className="text-xs text-[#464554] mt-0.5">
              Real-time variance tracking against guaranteed initial caps
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <button
              type="button"
              onClick={() => setShowSlider(!showSlider)}
              aria-label="Toggle What-If Guest Count Scaler"
              className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-[#4338ca] ${
                showSlider
                  ? 'bg-[#4338ca] text-white shadow-xs'
                  : 'bg-[#f2f3ff] text-[#131b2e] border border-[#c7c4d7] hover:bg-[#eaedff]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>What-If Scaler</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              aria-label="Add new budget line item"
              className="inline-flex items-center gap-1 h-9 px-3 rounded-lg border border-[#c7c4d7] bg-[#ffffff] hover:bg-[#f2f3ff] text-[#131b2e] text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-[#4338ca]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Line</span>
            </button>

            <button
              type="button"
              onClick={onTriggerRebalance}
              aria-label="Trigger AI Budget Rebalance & Optimization"
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[#e2e7ff] hover:bg-[#dae2fd] text-[#2a14b4] text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-[#4338ca]"
            >
              <Sparkles className="w-4 h-4 text-[#4338ca]" />
              <span>AI Rebalance</span>
            </button>
          </div>
        </div>

        {/* What-If Guest Scaler Slider */}
        {showSlider && (
          <div className="mb-4 p-3.5 bg-[#f2f3ff] border border-[#c7c4d7] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#4338ca]" />
                <span className="text-xs font-bold text-[#131b2e]">
                  What-If Guest Scaler: <strong className="text-[#4338ca]">{guestCount} Guests</strong>
                </span>
              </div>
              <p className="text-[11px] text-[#464554] mt-0.5">
                Scales variable items (Catering, Bar, Favors) while preserving fixed venue caps.
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
                className="w-full accent-[#4338ca] cursor-pointer"
              />
              <span className="font-mono-data text-xs font-bold text-[#131b2e] w-12 text-right">
                {guestCount}
              </span>
            </div>
          </div>
        )}

        {/* Accessible Data Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[560px]">
            <caption className="sr-only">
              Celebration categorized budget caps, quoted commitments, payments disbursed, and variance
            </caption>
            <thead>
              <tr className="bg-[#f2f3ff] text-[#131b2e] text-[11px] font-semibold border-b border-[#c7c4d7]">
                <th scope="col" className="py-2.5 px-3 rounded-l-lg">Category & Item</th>
                <th scope="col" className="py-2.5 px-3 text-right">Allocated</th>
                <th scope="col" className="py-2.5 px-3 text-right">Quoted / Act.</th>
                <th scope="col" className="py-2.5 px-3 text-right">Paid</th>
                <th scope="col" className="py-2.5 px-3 text-center">Variance Status</th>
                <th scope="col" className="py-2.5 px-3 rounded-r-lg text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaedff]">
              {items.map((item, idx) => {
                const variance = item.allocated - item.quotedOrActual;
                const dotColor = dotColors[idx % dotColors.length];

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-[#f2f3ff]/60 transition-colors group"
                  >
                    <td className="py-3 px-3 text-[#131b2e] font-semibold">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${dotColor} shrink-0`} />
                        <div className="truncate">
                          <p className="truncate font-semibold">{item.name}</p>
                          <span className="text-[10px] text-[#464554] font-normal">{item.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-mono-data text-[#131b2e] font-medium">
                      {formatCurrency(item.allocated, currencySymbol, privacyMask)}
                    </td>
                    <td className={`py-3 px-3 text-right font-mono-data font-medium ${
                      item.status === 'over_budget' ? 'text-[#873b00] font-bold' : 'text-[#131b2e]'
                    }`}>
                      {formatCurrency(item.quotedOrActual, currencySymbol, privacyMask)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono-data text-[#464554]">
                      {formatCurrency(item.paid, currencySymbol, privacyMask)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {variance > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#97f5cc] text-[#007353] text-[11px] font-semibold">
                          <Check className="w-3 h-3" />
                          <span>-{formatCurrency(variance, currencySymbol, privacyMask)}</span>
                        </span>
                      )}
                      {variance < 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ffdbca] text-[#873b00] text-[11px] font-semibold">
                          <AlertTriangle className="w-3 h-3" />
                          <span>+{formatCurrency(Math.abs(variance), currencySymbol, privacyMask)}</span>
                        </span>
                      )}
                      {variance === 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#eaedff] text-[#131b2e] text-[11px] font-semibold">
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
                          className="text-[#464554] hover:text-[#4338ca] p-1 rounded hover:bg-[#eaedff] transition-colors focus-visible:ring-2 focus-visible:ring-[#4338ca]"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteItem(item.id)}
                          aria-label={`Delete ${item.name}`}
                          className="text-[#464554] hover:text-[#ba1a1a] p-1 rounded hover:bg-[#ffdad6] transition-colors focus-visible:ring-2 focus-visible:ring-[#ba1a1a]"
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
      <div className="mt-4 pt-3 bg-[#f2f3ff] rounded-lg p-3 flex flex-col sm:flex-row items-center justify-between gap-2 border border-[#c7c4d7]">
        <div className="flex items-center gap-2">
          <PiggyBank className="w-4 h-4 text-[#006c4e]" />
          <span className="text-xs text-[#131b2e] font-semibold">
            {summary.netConsolidatedSurplus >= 0
              ? `Net Consolidated Surplus: ${formatCurrency(summary.netConsolidatedSurplus, currencySymbol, privacyMask)} under initial ceiling`
              : `Net Variance Deficit: ${formatCurrency(Math.abs(summary.netConsolidatedSurplus), currencySymbol, privacyMask)} over initial ceiling`}
          </span>
        </div>
        <div className="flex items-center gap-4 text-right">
          <span className="text-xs text-[#464554]">
            Allocated: <strong className="text-[#131b2e] font-mono-data">{formatCurrency(summary.totalAllocated, currencySymbol, privacyMask)}</strong>
          </span>
          <span className="text-xs text-[#464554]">
            Actual: <strong className="text-[#4338ca] font-mono-data">{formatCurrency(summary.totalQuotedOrActual, currencySymbol, privacyMask)}</strong>
          </span>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#131b2e]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#c7c4d7] shadow-lg w-full max-w-md p-5 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-[#131b2e] font-headline">Add Budget Line Item</h3>
            <p className="text-xs text-[#464554] mt-0.5">Create a newly tracked expense with cap allocation.</p>

            <form onSubmit={handleSaveNewItem} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#131b2e] mb-1">Item Title</label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Acoustic Guitar Duo for Cocktail Hour"
                  className="w-full h-9 px-3 text-xs rounded-lg border border-[#c7c4d7] focus:ring-2 focus:ring-[#4338ca] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#131b2e] mb-1">Category</label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  className="w-full h-9 px-3 text-xs rounded-lg border border-[#c7c4d7] focus:ring-2 focus:ring-[#4338ca] focus:outline-none bg-white"
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
                  <label className="block text-[11px] font-semibold text-[#131b2e] mb-1">Allocated ($)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={newItemAllocated}
                    onChange={(e) => setNewItemAllocated(Number(e.target.value))}
                    className="w-full h-9 px-2.5 text-xs rounded-lg border border-[#c7c4d7] focus:ring-2 focus:ring-[#4338ca] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#131b2e] mb-1">Quoted ($)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={newItemActual}
                    onChange={(e) => setNewItemActual(Number(e.target.value))}
                    className="w-full h-9 px-2.5 text-xs rounded-lg border border-[#c7c4d7] focus:ring-2 focus:ring-[#4338ca] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#131b2e] mb-1">Paid ($)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={newItemPaid}
                    onChange={(e) => setNewItemPaid(Number(e.target.value))}
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
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-[#131b2e]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#c7c4d7] shadow-lg w-full max-w-md p-5 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-[#131b2e] font-headline">Edit Budget Item</h3>
            <p className="text-xs text-[#464554] mt-0.5">Update numbers for {editingItem.name}.</p>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#131b2e] mb-1">Item Title</label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full h-9 px-3 text-xs rounded-lg border border-[#c7c4d7] focus:ring-2 focus:ring-[#4338ca] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-[#131b2e] mb-1">Allocated ($)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={editingItem.allocated}
                    onChange={(e) => setEditingItem({ ...editingItem, allocated: Number(e.target.value) })}
                    className="w-full h-9 px-2.5 text-xs rounded-lg border border-[#c7c4d7] focus:ring-2 focus:ring-[#4338ca] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#131b2e] mb-1">Quoted ($)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={editingItem.quotedOrActual}
                    onChange={(e) => setEditingItem({ ...editingItem, quotedOrActual: Number(e.target.value) })}
                    className="w-full h-9 px-2.5 text-xs rounded-lg border border-[#c7c4d7] focus:ring-2 focus:ring-[#4338ca] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#131b2e] mb-1">Paid ($)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={editingItem.paid}
                    onChange={(e) => setEditingItem({ ...editingItem, paid: Number(e.target.value) })}
                    className="w-full h-9 px-2.5 text-xs rounded-lg border border-[#c7c4d7] focus:ring-2 focus:ring-[#4338ca] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#c7c4d7]">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="h-8 px-3 rounded-lg border border-[#c7c4d7] text-xs font-medium text-[#464554] hover:bg-[#f2f3ff]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-4 rounded-lg bg-[#4338ca] text-white text-xs font-semibold hover:bg-[#372abf]"
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
