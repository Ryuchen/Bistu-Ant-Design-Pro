import React, { PureComponent } from 'react';
import { stringify } from 'qs';
import { connect } from 'dva';
import moment from 'moment';
import { Button, Card, Col, notification, Row, Select, Table } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './index.less';

@connect(({ colleges, students, loading }) => ({
  colleges,
  students,
  currentUserLoading: loading.effects['user/fetchCurrent'],
  statisticLoading: loading.effects['students/fetchStatistics'],
}))
class ThesisStationTable extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      xlsYear: moment().year(),
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { xlsYear } = this.state;

    dispatch({
      type: 'students/fetchStatistics',
      payload: {
        year: xlsYear,
      },
    });
  }

  handleChange = value => {
    const { dispatch } = this.props;
    this.setState({
      xlsYear: value,
    });
    dispatch({
      type: 'students/fetchStatistics',
      payload: {
        year: value,
      },
    });
  };

  handleExport = () => {
    const { xlsYear } = this.state;
    const params = { year: xlsYear };
    const downloadUrl = `/api/students/create_xls/?${stringify(params)}`;
    fetch(downloadUrl, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then(res => res.blob())
      .then(blob => {
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        const filename = 'document.xls';
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(error => {
        notification.error({
          message: '下载出现问题',
          description: error,
        });
      });
  };

  render() {
    const {
      students: { statistics = [] },
      statisticLoading,
    } = this.props;
    const { xlsYear } = this.state;

    const dataSource = [];
    statistics.forEach(item => {
      const {
        academy_name: academyName,
        academy_total: academyTotal,
        academy_major: academyMajors = [],
      } = item;

      academyMajors.forEach(major => {
        dataSource.push({
          academyName,
          academyTotal,
          majorName: major.major_name,
          majorCode: major.major_code,
          majorType: major.major_type,
          majorTotal: major.major_total,
          S1: major.S1,
          S2: major.S2,
        });
      });
    });

    const columns = [
      {
        title: '序号',
        dataIndex: 'Num',
        key: 'Num',
        render: (text, record, index) => index,
      },
      {
        title: '学院',
        dataIndex: 'academy',
        key: 'academy',
      },
      {
        title: '学生数',
        dataIndex: 'stu_count',
        key: 'stu_count',
      },
      {
        title: '按期开题人数',
        dataIndex: 'schedule_count',
        key: 'schedule_count',
      },
      {
        title: '延期开题人数',
        dataIndex: 'delay_count',
        key: 'delay_count',
      },
      {
        title: '开题不通过人数',
        dataIndex: 'fail_count',
        key: 'fail_count',
      },
    ];

    const { Option } = Select;
    const selectOptions = [];
    for (let i = moment().year() - 10; i <= moment().year(); i += 1) {
      selectOptions.push(i);
    }

    return (
      <PageHeaderWrapper title="硕士生招生信息" type="success">
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Select
              style={{
                width: 120,
                position: 'absolute',
                margin: '12px 12px 12px -240px',
                zIndex: 11,
                left: '100%',
              }}
              defaultValue={xlsYear}
              onChange={this.handleChange}
            >
              {selectOptions.map(item => {
                return <Option value={item}>{`${item}`}</Option>;
              })}
            </Select>
            <Button
              style={{
                position: 'absolute',
                margin: '12px 12px 12px -105px',
                zIndex: 11,
                left: '100%',
              }}
              onClick={this.handleExport}
            >
              导出
            </Button>
          </Col>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card
              className={styles.projectList}
              style={{ marginBottom: 24 }}
              title="硕士生分专业招生人数汇总表"
              bodyStyle={{ padding: 20 }}
            >
              <Table
                columns={columns}
                dataSource={dataSource}
                rowKey={record => record.index}
                loading={statisticLoading}
                bordered
                size="small"
                pagination={false}
                scroll={{ x: 1910, y: 900 }}
              />
            </Card>
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default ThesisStationTable;
