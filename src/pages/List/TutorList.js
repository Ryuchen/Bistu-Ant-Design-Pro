import React, { PureComponent } from 'react';
import TeacherTable from '@/components/TeacherTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Card } from 'antd';

class TableList extends PureComponent {
  render() {
    return (
      <PageHeaderWrapper title="教师列表">
        <Card bordered={false}>
          <TeacherTable displayAlert displaySearch displayRowsSelect />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
