import { useState } from 'react';
import { DataGrid } from '@/components/common/DataGrid';
import { useNavigation, useWebsiteSessionsQuery } from '@/components/hooks';
import { SessionsTable } from './SessionsTable';

const ALL_COLUMN_IDS = [
  'id',
  'visits',
  'views',
  'events',
  'location',
  'browser',
  'os',
  'device',
  'distinctId',
  'lastAt',
];

const ALL_COLUMNS: Record<string, { label: string; width: string; render: (row: any) => any }> = {
  id: {
    label: '',
    width: '100px',
    render: (row: any) => <span>{row.id}</span>,
  },
  visits: {
    label: 'Visits',
    width: '80px',
    render: (row: any) => <span>{row.visits}</span>,
  },
  views: {
    label: 'Views',
    width: '80px',
    render: (row: any) => <span>{row.views}</span>,
  },
  events: {
    label: 'Events',
    width: '80px',
    render: (row: any) => <span>{row.events}</span>,
  },
  location: {
    label: 'Location',
    width: '200px',
    render: (row: any) => (
      <span>
        {row.country ? <span>{row.country}</span> : ''}
        {row.city ? `<span>, ${row.city}</span>` : ''}
      </span>
    ),
  },
  browser: {
    label: 'Browser',
    width: '140px',
    render: (row: any) => <span>{row.browser}</span>,
  },
  os: {
    label: 'OS',
    width: '140px',
    render: (row: any) => <span>{row.os}</span>,
  },
  device: {
    label: 'Device',
    width: '140px',
    render: (row: any) => <span>{row.device}</span>,
  },
  distinctId: {
    label: 'Distinct ID',
    width: '180px',
    render: (row: any) => <span>{row.distinctId}</span>,
  },
  lastAt: {
    label: 'Last Seen',
    width: '140px',
    render: (row: any) => <span>{row.lastAt}</span>,
  },
};

export function SessionsDataTable({ websiteId }: { websiteId: string }) {
  const queryResult = useWebsiteSessionsQuery(websiteId);
  const { updateParams } = useNavigation();

  const [visibleColumns, setVisibleColumns] = useState<typeof ALL_COLUMN_IDS>(ALL_COLUMN_IDS);

  useEffect(() => {
    const stored =
      typeof window !== 'undefined' ? localStorage.getItem('umami.sessions.columns') : null;
    if (stored) {
      const parsed = JSON.parse(stored);
      const valid = ALL_COLUMN_IDS.filter((id: string) => parsed.includes(id));
      if (valid.length > 0) {
        setVisibleColumns(valid);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('umami.sessions.columns', JSON.stringify(visibleColumns));
    }
  }, [visibleColumns]);

  return (
    <DataGrid
      query={queryResult}
      allowPaging
      allowSearch
      renderActions={() => (
        <ColumnPicker
          columns={Object.entries(ALL_COLUMNS).map(([id, config]) => ({
            id,
            label: config.label,
            width: config.width,
          }))}
          selectedColumns={visibleColumns}
          onColumnToggle={(id: string, checked: boolean) =>
            setVisibleColumns(
              visibleColumns.includes(id)
                ? visibleColumns.filter((cid: string) => cid !== id)
                : [...visibleColumns, id],
            )
          }
        />
      )}
    >
      {({ data }) => (
        <SessionsTable
          data={data}
          websiteId={websiteId}
          getSessionHref={row => ({ session: row.id })}
          visibleColumns={visibleColumns.join(',')}
        />
      )}
    </DataGrid>
  );
}