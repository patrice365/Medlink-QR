import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

interface VisitPaginationProps {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
  onPage: (page: number) => void;
  onPageSize: (size: number) => void;
}

const PAGE_SIZES = [5, 10, 20];

export function VisitPagination({ page, pageCount, pageSize, total, onPage, onPageSize }: VisitPaginationProps) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  const navBtn =
  'grid h-11 w-11 place-items-center rounded-full text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-royal/20 disabled:pointer-events-none disabled:opacity-40';

  return (
    <nav
      aria-label="Visit pages"
      className="flex flex-col gap-4 rounded-2xl border border-line bg-white px-5 py-3 shadow-card sm:flex-row sm:items-center sm:justify-between">
      
      <div className="flex items-center gap-4 text-sm text-ink-soft">
        <span>
          {start}–{end} of {total}
        </span>
        <label className="flex items-center gap-2">
          Rows per page
          <select
            value={pageSize}
            onChange={(e) => onPageSize(Number(e.target.value))}
            className="h-11 cursor-pointer rounded-[10px] border border-line bg-white px-3 text-sm text-ink focus:border-brand-royal focus:outline-none focus:ring-4 focus:ring-brand-royal/15">
            
            {PAGE_SIZES.map((s) =>
            <option key={s} value={s}>
                {s}
              </option>
            )}
          </select>
        </label>
      </div>
      <div className="flex items-center gap-1">
        <button type="button" className={`${navBtn} text-ink hover:bg-tint`} onClick={() => onPage(page - 1)} disabled={page <= 1} aria-label="Previous page">
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        {pages.map((p) =>
        <button
          key={p}
          type="button"
          onClick={() => onPage(p)}
          aria-current={p === page ? 'page' : undefined}
          aria-label={`Page ${p}`}
          className={`${navBtn} ${p === page ? 'bg-brand-royal text-white' : 'text-ink hover:bg-tint hover:text-brand-royal'}`}>
          
            {p}
          </button>
        )}
        <button
          type="button"
          className={`${navBtn} text-ink hover:bg-tint`}
          onClick={() => onPage(page + 1)}
          disabled={page >= pageCount}
          aria-label="Next page">
          
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </nav>);

}