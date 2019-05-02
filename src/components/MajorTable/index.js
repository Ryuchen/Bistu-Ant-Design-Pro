import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Form, Badge, Table } from 'antd';

import styles from './index.less';

@connect(({ colleges, loading }) => ({
  colleges,
  collegesLoading: loading.effects['colleges/fetchAcademy'],
}))
@Form.create()
class MajorTable extends PureComponent {
  componentDidMount() {
    const { defaultFilter, dispatch } = this.props;

    const { academy: uuid } = defaultFilter;

    dispatch({
      type: 'colleges/fetchAcademy',
      payload: uuid || '1000000000',
    });
  }

  previewItem = id => {
    router.push(`/major/${id}`);
  };

  render() {
    const {
      colleges: {
        academy: { majors },
      },
      collegesLoading,
    } = this.props;

    const majorColumns = [
      {
        title: '学科专业编号',
        dataIndex: 'maj_code',
        render: val => `${val}`,
      },
      {
        title: '专业方向名称',
        dataIndex: 'maj_name',
        render: val => `${val}`,
      },
      {
        title: '类型',
        dataIndex: 'maj_type',
        render: val => `${val}`,
      },
      {
        title: '开设时间',
        dataIndex: 'maj_setup_time',
        render: val => `${val}`,
      },
      {
        title: '学位类型',
        dataIndex: 'maj_degree',
        render: val => `${val}`,
      },
      {
        title: '一级学科',
        dataIndex: 'maj_first',
        render: value => <Badge status={value ? 'success' : 'error'} style={{ marginLeft: 5 }} />,
      },
      {
        title: '二级学科',
        dataIndex: 'maj_second',
        render: value => <Badge status={value ? 'success' : 'error'} style={{ marginLeft: 5 }} />,
      },
      {
        title: '学科人数',
        dataIndex: 'student_count',
        render: val => `${val}`,
      },
      {
        title: '操作',
        width: 60,
        render: (val, record) => <a onClick={() => this.previewItem(record.uuid)}>详情</a>,
      },
    ];

    return (
      <div className={styles.standardTable}>
        <div className={styles.tableList}>
          <Table
            columns={majorColumns}
            rowKey={record => record.uuid}
            dataSource={majors}
            pagination={false}
            loading={collegesLoading}
          />
        </div>
      </div>
    );
  }
}

export default MajorTable;
