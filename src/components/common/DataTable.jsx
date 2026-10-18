import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LoadingState } from './LoadingState';
import { EmptyState } from './EmptyState';

export const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  emptyTitle,
  emptyDescription,
  pageSize = 8,
  searchPlaceholder,
  searchField, // Field name to search locally
  actions,
  className = ''
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Search filter locally
  const filteredData = React.useMemo(() => {
    if (!searchQuery || !searchField) return data;
    return data.filter(row => {
      const val = row[searchField];
      if (val === undefined || val === null) return false;
      return String(val).toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [data, searchQuery, searchField]);

  // 2. Pagination locally
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = React.useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return filteredData.slice(startIdx, startIdx + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Reset page on search
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  if (loading) {
    return <LoadingState message="Loading table content..." />;
  }

  return (
    <div className={`flex flex-col gap-4 w-full ${className}`}>
      {/* Search Header Bar */}
      {(searchPlaceholder && searchField || actions) && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          {searchPlaceholder && searchField && (
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={handleSearchChange}
              className="glass-input rounded-xl px-4 py-2 text-xs w-full sm:max-w-xs"
            />
          )}
          {actions && <div className="shrink-0 flex items-center gap-2">{actions}</div>}
        </div>
      )}

      {/* Table grid wrapper */}
      <div className="w-full overflow-x-auto rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
        <table className="w-full text-left border-collapse bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
          <thead>
            <tr className="border-b border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-950/20 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider select-none">
              {columns.map((col, idx) => (
                <th key={idx} className="px-3 sm:px-6 py-3 sm:py-4">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm font-medium text-slate-700 dark:text-slate-300">
            {paginatedData.map((row, rowIdx) => (
              <tr 
                key={row.id || rowIdx}
                className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-colors"
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="p-8">
            <EmptyState 
              title={emptyTitle || "No items found"} 
              description={emptyDescription || "There are no entries matching your parameters."}
            />
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400 px-2 mt-1 select-none">
          <span>
            Showing {Math.min(filteredData.length, (currentPage - 1) * pageSize + 1)}-{Math.min(filteredData.length, currentPage * pageSize)} of {filteredData.length} entries
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-slate-800 dark:text-slate-200">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default DataTable;
