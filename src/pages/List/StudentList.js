import React, { PureComponent } from 'react';
import StudentTable from '@/components/StudentTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Card } from 'antd';

class TableList extends PureComponent {
  render() {
    return (
      <PageHeaderWrapper title="学生列表">
        <Card bordered={false}>
          <StudentTable displayAlert displaySearch displayRowsSelect />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
