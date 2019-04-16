import { PaginationConfig, SorterResult, TableCurrentDataSource } from 'antd/lib/table';
import React from 'react';

export interface StandardTableProps {
  columns: any;
  displayAlert?: boolean;
  displayRowsSelect?: boolean;
  onSelectRow: (row: any) => void;
  data: any;
  rowKey?: string;
  selectedRows: any[];
  onChange?: (
    pagination: PaginationConfig,
    filters: Record<keyof any, string[]>,
    sorter: SorterResult<any>,
    extra?: TableCurrentDataSource<any>
  ) => void;
  loading?: boolean;
}

export default class StandardTable extends React.Component<StandardTableProps, any> {}
