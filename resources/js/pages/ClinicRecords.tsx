import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CameraIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  ScanLineIcon,
  SearchIcon,
  UserPlusIcon } from
'lucide-react';
import type { PatientRecord } from '../types/patient';
import { useRecords } from '../contexts/RecordsContext';
import { assessTriage } from '../utils/triage';
import type { TriageLevel, TriageResult } from '../utils/triage';
import { computeAge, fullName } from '../utils/patient';
import { PatientAvatar } from '../components/PatientAvatar';
import { TriageBadge } from '../components/TriageBadge';
import { ActionButton } from '../components/ActionButton';
import { PageHeader } from '../components/ui/PageHeader';
import { QrScannerModal } from '../components/QrScannerModal';

type Filter = 'all' | 'attention' | 'novisit';
type SortKey = 'name' | 'program' | 'triage' | 'registered';

const FILTERS: {id: Filter;label: string;}[] = [
{ id: 'all', label: 'All patients' },
{ id: 'attention', label: 'Needs attention' },
{ id: 'novisit', label: 'No visit yet' }];


const TRIAGE_RANK: Record<TriageLevel, number> = { Emergent: 0, Urgent: 1, 'Non-urgent': 2, Pending: 3 };

function compare(a: {p: PatientRecord;triage: TriageResult;}, b: {p: PatientRecord;triage: TriageResult;}, key: SortKey) {
  if (key === 'name') return a.p.surname.localeCompare(b.p.surname);
  if (key === 'program') return a.p.program.localeCompare(b.p.program);
  if (key === 'triage') return TRIAGE_RANK[a.triage.level] - TRIAGE_RANK[b.triage.level];
  return a.p.registeredAt.localeCompare(b.p.registeredAt);
}

export function ClinicRecords() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { patients, getPatient } = useRecords();
  const [query, setQuery] = useState(params.get('q') ?? '');

  useEffect(() => {
    setQuery(params.get('q') ?? '');
  }, [params]);
  const [filter, setFilter] = useState<Filter>('all');
  const [scanInput, setScanInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [sort, setSort] = useState<{key: SortKey;dir: 'asc' | 'desc';}>({ key: 'registered', dir: 'desc' });

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return patients.
    map((p) => ({ p, triage: assessTriage(p) })).
    filter(({ p }) =>
    !q ? true : [fullName(p), p.surname, p.clinicNo, p.id, p.program, p.studentNo ?? ''].some((v) => v.toLowerCase().includes(q))
    ).
    filter(({ triage }) => {
      if (filter === 'attention') return triage.level === 'Emergent' || triage.level === 'Urgent';
      if (filter === 'novisit') return triage.level === 'Pending';
      return true;
    }).
    sort((a, b) => compare(a, b, sort.key) * (sort.dir === 'asc' ? 1 : -1));
  }, [patients, query, filter, sort]);

  const toggleSort = (key: SortKey) =>
  setSort((s) => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' });

  const openById = useCallback(
    (raw: string) => {
      const id = raw.trim().split('/p/').pop()?.split(/[?#]/)[0].trim() ?? '';
      const found = id ? getPatient(id) : undefined;
      if (!found) {
        toast.error('No record matches that QR code or ID');
        return false;
      }
      navigate(`/clinic/records/${found.id}`);
      return true;
    },
    [getPatient, navigate]
  );

  const openScanned = (e: React.FormEvent) => {
    e.preventDefault();
    openById(scanInput);
  };

  const handleDetected = useCallback(
    (text: string) => {
      setScanning(false);
      setScanInput(text);
      openById(text);
    },
    [openById]
  );

  const SortHeader = ({ label, sortKey }: {label: string;sortKey: SortKey;}) => {
    const active = sort.key === sortKey;
    const Icon = !active ? ChevronsUpDownIcon : sort.dir === 'asc' ? ArrowUpIcon : ArrowDownIcon;
    return (
      <th scope="col" aria-sort={active ? sort.dir === 'asc' ? 'ascending' : 'descending' : 'none'} className="px-5 py-3">
        <button
          type="button"
          onClick={() => toggleSort(sortKey)}
          className={`inline-flex items-center gap-1 uppercase tracking-[0.1em] transition-colors duration-150 hover:text-brand-royal ${
          active ? 'text-brand-royal' : ''}`
          }>
          
          {label}
          <Icon className={`h-3.5 w-3.5 ${active ? 'text-brand-royal' : 'text-ink-faint'}`} aria-hidden="true" />
        </button>
      </th>);

  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 lg:px-10 lg:py-10">
      <PageHeader
        eyebrow="Health Services Office"
        title="Patient records"
        description={`${patients.length} registered students`}
        actions={
        <ActionButton variant="secondary" icon={UserPlusIcon} onClick={() => navigate('/register')}>
            Register student
          </ActionButton>
        } />
      

      <form onSubmit={openScanned} className="mt-8 flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 shadow-card sm:flex-row sm:items-end sm:p-6">
        <div className="flex-1">
          <label htmlFor="scan-input" className="mb-1.5 block text-sm font-medium text-ink">
            Open a scanned QR code
          </label>
          <div className="relative">
            <ScanLineIcon className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-brand-royal" aria-hidden="true" />
            <input
              id="scan-input"
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              placeholder="Scan the QR or type the record ID (ML-…)"
              className="h-11 w-full rounded-[10px] border border-line bg-white pl-11 pr-3 text-[15px] text-ink placeholder:text-ink-faint focus:border-brand-royal focus:outline-none focus:ring-4 focus:ring-brand-royal/15" />
            
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ActionButton type="button" icon={CameraIcon} onClick={() => setScanning(true)}>
            Scan QR
          </ActionButton>
          <ActionButton type="submit" variant="secondary" icon={ChevronRightIcon}>
            Open record
          </ActionButton>
        </div>
      </form>

      <QrScannerModal open={scanning} onClose={() => setScanning(false)} onDetected={handleDetected} />

      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white shadow-card">
        <div className="flex flex-col gap-4 border-b border-line p-5 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
            <input
              type="search"
              aria-label="Search patients"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, clinic no., program"
              className="h-11 w-full rounded-[10px] border border-line bg-white pl-10 pr-3 text-[15px] text-ink placeholder:text-ink-faint focus:border-brand-royal focus:outline-none focus:ring-4 focus:ring-brand-royal/15" />
            
          </div>
          <div role="tablist" aria-label="Filter patients" className="flex gap-1 rounded-[10px] bg-canvas p-1">
            {FILTERS.map((f) =>
            <button
              key={f.id}
              role="tab"
              type="button"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`h-9 whitespace-nowrap rounded-lg px-3.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-royal/20 ${
              filter === f.id ? 'bg-white text-brand-royal shadow-card ring-1 ring-line' : 'text-ink-soft hover:text-ink'}`
              }>
              
                {f.label}
              </button>
            )}
          </div>
        </div>

        <div className="max-h-[640px] overflow-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="sticky top-0 z-10 border-b border-line bg-canvas text-[11px] font-semibold text-ink-soft">
              <tr>
                <SortHeader label="Patient" sortKey="name" />
                <SortHeader label="Program" sortKey="program" />
                <th scope="col" className="px-5 py-3 uppercase tracking-[0.1em]">Age · Sex</th>
                <th scope="col" className="px-5 py-3 uppercase tracking-[0.1em]">Mobile</th>
                <SortHeader label="Triage" sortKey="triage" />
                <SortHeader label="Registered" sortKey="registered" />
                <th scope="col" className="px-5 py-3"><span className="sr-only">Open</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map(({ p, triage }) =>
              <tr
                key={p.id}
                onClick={() => navigate(`/clinic/records/${p.id}`)}
                className="cursor-pointer transition-colors duration-150 hover:bg-tint/50">
                
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <PatientAvatar patient={p} />
                      <div>
                        <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/clinic/records/${p.id}`);
                        }}
                        className="text-[15px] font-medium text-brand-navy hover:text-brand-royal focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-royal/20">
                        
                          {fullName(p)}
                        </button>
                        <p className="text-xs text-ink-soft">No. {p.clinicNo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-ink">{p.program || '—'}</td>
                  <td className="px-5 py-3.5 text-ink">
                    {computeAge(p.dateOfBirth) ?? '—'} · {p.sex || '—'}
                  </td>
                  <td className="px-5 py-3.5 text-ink">{p.contactNo}</td>
                  <td className="px-5 py-3.5">
                    <TriageBadge level={triage.level} />
                  </td>
                  <td className="px-5 py-3.5 text-ink-soft">
                    {p.registeredAt ? format(parseISO(p.registeredAt), 'MMM d, yyyy') : '—'}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <ChevronRightIcon className="ml-auto h-4 w-4 text-ink-faint" aria-hidden="true" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {rows.length === 0 &&
          <div className="flex flex-col items-center px-6 py-14 text-center">
              <p className="font-semibold text-brand-navy">No patients match</p>
              <p className="mt-1 text-sm text-ink-soft">Try a different name or clear the filter.</p>
            </div>
          }
        </div>
      </div>
    </div>);

}