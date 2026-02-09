"use client";

import { Role } from "@/lib/types";
import { Plus, Trash2, Users } from "lucide-react";
import { useState } from "react";

interface Props {
  roles: Role[];
  onAddRole: (label?: string, rate?: number) => void;
  onRemoveRole: (id: string) => void;
  onUpdateRole: (id: string, updates: Partial<Role>) => void;
}

export function RolesManager({ roles, onAddRole, onRemoveRole, onUpdateRole }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">Roles</span>
        </div>
        <button
          onClick={() => onAddRole()}
          className="flex items-center gap-1 px-2.5 py-1 text-xs text-primary hover:bg-primary-subtle rounded-md transition-colors"
        >
          <Plus className="w-3 h-3" />
          Add Role
        </button>
      </div>

      <div className="space-y-2">
        {roles.map((role) => (
          <div
            key={role.id}
            className="flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-2 group hover:border-primary/30 transition-colors"
          >
            {editingId === role.id ? (
              <>
                <input
                  type="text"
                  value={role.label}
                  onChange={(e) => onUpdateRole(role.id, { label: e.target.value })}
                  onBlur={() => setEditingId(null)}
                  onKeyDown={(e) => e.key === "Enter" && setEditingId(null)}
                  autoFocus
                  className="flex-1 bg-transparent text-sm font-medium focus:outline-none border-b border-primary px-0 py-0"
                />
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-muted">$/hr</span>
                  <input
                    type="number"
                    value={role.hourlyRate}
                    onChange={(e) => onUpdateRole(role.id, { hourlyRate: Number(e.target.value) })}
                    className="w-16 bg-background border border-border rounded px-2 py-0.5 text-xs text-center focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditingId(role.id)}
                  className="flex-1 text-left"
                >
                  <span className="text-sm font-medium">{role.label}</span>
                  <span className="text-xs text-muted ml-2">${role.hourlyRate}/hr</span>
                </button>
                {roles.length > 1 && (
                  <button
                    onClick={() => onRemoveRole(role.id)}
                    className="p-1 opacity-0 group-hover:opacity-100 hover:bg-danger-subtle rounded transition-all text-muted hover:text-danger"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
