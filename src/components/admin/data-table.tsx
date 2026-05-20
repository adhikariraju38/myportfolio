"use client";

import type { ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowKey?: (row: T) => string;
  empty?: ReactNode;
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  rowKey,
  empty,
  onRowClick,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-bg-secondary p-10 text-center text-sm text-text-secondary">
        {empty ?? "No entries yet."}
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-bg-secondary">
      <table className="w-full text-left text-xs">
        <thead className="bg-bg-tertiary/40 text-[10px] uppercase tracking-wider text-text-tertiary">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-3 py-2 font-medium">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const key = rowKey ? rowKey(row) : String((row as { id?: string }).id ?? Math.random());
            return (
              <tr
                key={key}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={
                  "border-t border-border " +
                  (onRowClick ? "cursor-pointer transition-colors hover:bg-bg-tertiary/30" : "")
                }
              >
                {columns.map((c) => (
                  <td key={c.key} className={"px-3 py-3 align-top text-text " + (c.className ?? "")}>
                    {c.render ? c.render(row) : (row[c.key] as ReactNode) ?? ""}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
