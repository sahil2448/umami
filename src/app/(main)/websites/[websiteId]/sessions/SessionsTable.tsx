import { DataColumn, DataTable, type DataTableProps } from '@umami/react-zen';
import { Avatar } from '@/components/common/Avatar';
import { DateDistance } from '@/components/common/DateDistance';
import Link from '@/components/common/Link';
import { TypeIcon } from '@/components/common/TypeIcon';
import { useFormat, useMessages, useSessionColumns } from '@/components/hooks';

export function SessionsTable({
  websiteId,
  getSessionHref,
  visibleColumns,
  ...props
}: DataTableProps & {
  websiteId: string;
  getSessionHref?: (row: any) => string;
  visibleColumns?: string[];
}) {
  const { t, labels } = useMessages();
  const { formatValue } = useFormat();

  const allColumns = useSessionColumns();
  const columnIds = Object.keys(allColumns);
  const visibleColumnIds = visibleColumns ? visibleColumns.split(',') : columnIds;
  const visibleColumnConfigs = columnIds
    .filter(id => visibleColumnIds.includes(id))
    .reduce((acc, id) => {
      acc[id] = allColumns[id];
      return acc;
    }, {});

  return (
    <DataTable {...props}>
      {Object.entries(visibleColumnConfigs).map(([id, config]) => (
        <DataColumn key={id} id={id} label={t(config.label)} width={config.width}>
          {(row: any) => <span>{config.render(row)}</span>}
        </DataColumn>
      ))}
    </DataTable>
  );
}

export function SessionsDataTable({ websiteId }: { websiteId: string }) {
  const queryResult = useWebsiteSessionsQuery(websiteId);
  const { visibleColumns, setVisibleColumns } = useColumnSelection(
    'umami.sessions.columns',
    Object.keys(useSessionColumns()),
    Object.keys(useSessionColumns()),
  );

  return (
    <DataGrid
      query={queryResult}
      allowPaging
      allowSearch
      renderActions={() => (
        <ColumnPicker
          columns={Object.entries(useSessionColumns()).map(([id, config]) => ({
            id,
            label: config.label,
            width: config.width,
          }))}
          selectedColumns={visibleColumns}
          onColumnToggle={(id: string, checked: boolean) =>
            setVisibleColumns(
              visibleColumns.includes(id)
                ? visibleColumns.filter(cid => cid !== id)
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
          visibleColumns={visibleColumns}
        />
      )}
    </DataGrid>
  );
}
