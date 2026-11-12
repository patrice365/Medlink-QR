import { useMemo, useState } from 'react';
import type { VisitFilters, VisitRecord, VisitView } from '../types/visit';
import { EMPTY_VISIT_FILTERS, matchesFilters, sortVisitsNewest } from '../utils/visit';

export function useVisitHistory(visits: VisitRecord[]) {
  const [filters, setFilters] = useState<VisitFilters>(EMPTY_VISIT_FILTERS);
  const [view, setView] = useState<VisitView>('timeline');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(5);

  const sorted = useMemo(() => sortVisitsNewest(visits), [visits]);
  const mostRecentId = sorted[0]?.id;

  const physicians = useMemo(
    () => Array.from(new Set(visits.map((v) => v.clinical.physician).filter(Boolean))).sort(),
    [visits]
  );

  const filtered = useMemo(() => sorted.filter((v) => matchesFilters(v, filters)), [sorted, filters]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const activeFilterCount = [
  filters.query.trim(),
  filters.from || filters.to,
  filters.physician,
  filters.status !== 'All' ? filters.status : ''].
  filter(Boolean).length;

  const updateFilters = (patch: Partial<VisitFilters>) => {
    setFilters((f) => ({ ...f, ...patch }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters(EMPTY_VISIT_FILTERS);
    setPage(1);
  };

  const setPageSize = (size: number) => {
    setPageSizeState(size);
    setPage(1);
  };

  return {
    filters,
    updateFilters,
    clearFilters,
    activeFilterCount,
    view,
    setView,
    page: currentPage,
    setPage,
    pageSize,
    setPageSize,
    pageCount,
    total: visits.length,
    filtered,
    paged,
    physicians,
    mostRecentId
  };
}