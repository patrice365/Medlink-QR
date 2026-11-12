import React from 'react';
import type { VisitFilters, VisitStatus } from '../../types/visit';
import { VISIT_STATUSES } from '../../utils/visit';
import { DateRangeField } from '../forms/DateRangeField';
import { SelectField } from '../forms/SelectField';

interface VisitFilterFieldsProps {
  filters: VisitFilters;
  onChange: (patch: Partial<VisitFilters>) => void;
  physicians: string[];
  stacked?: boolean;
}

export function VisitFilterFields({ filters, onChange, physicians, stacked = false }: VisitFilterFieldsProps) {
  const fields =
  <>
      <DateRangeField label="Date range" from={filters.from} to={filters.to} onChange={(range) => onChange(range)} />
      <SelectField
      label="Physician"
      value={filters.physician}
      onChange={(physician) => onChange({ physician })}
      options={[{ value: '', label: 'All physicians' }, ...physicians.map((p) => ({ value: p, label: p }))]} />
    
      <SelectField
      label="Status"
      value={filters.status}
      onChange={(status) => onChange({ status: status as VisitStatus | 'All' })}
      options={[{ value: 'All', label: 'All statuses' }, ...VISIT_STATUSES.map((s) => ({ value: s, label: s }))]} />
    
    </>;


  return stacked ? <div className="space-y-5">{fields}</div> : fields;
}