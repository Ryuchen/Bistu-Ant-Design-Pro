import React, { PureComponent } from 'react';
import { stringify } from 'qs';
import { connect } from 'dva';
import moment from 'moment';
import { Button, Card, Col, notification, Row, Select, Table } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './EnrollStudent.less';

@connect(({ colleges, students, loading }) => ({
  colleges,
  students,
  currentUserLoading: loading.effects['user/fetchCurrent'],
  statisticLoading: loading.effects['students/fetchStatistics'],
}))
class EnrollStudent extends PureComponent {
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

    const temp = {}; // 当前重复的值,支持多列
    const mergeCells = (index, text, array, columnName) => {
      let i = 0;
      if (!Object.prototype.hasOwnProperty.call(temp, text)) {
        array.forEach(item => {
          if (item[columnName] === text) {
            i += 1;
          }
        });
        temp[text] = { index, i };
        return i;
      }
      const { index: displayIndex, i: displaySpan } = temp[text];
      if (displayIndex === index) {
        return displaySpan;
      }
      return i;
    };
    const columns = [
      {
        title: '学院名称',
        dataIndex: 'academyName',
        width: 140,
        fixed: 'left',
        render: (text, record, index) => {
          const obj = {
            children: text,
            props: {},
          };
          obj.props.rowSpan = mergeCells(index, record.academyName, dataSource, 'academyName');
          return obj;
        },
      },
      {
        title: '招生专业代码',
        dataIndex: 'majorCode',
        width: 120,
        fixed: 'left',
      },
      {
        title: '招生专业名称',
        dataIndex: 'majorName',
        width: 210,
        fixed: 'left',
      },
      {
        title: '各专业招生人数',
        children: [
          {
            title: '专业人数',
            dataIndex: 'majorTotal',
            width: 40,
            align: 'center',
          },
          {
            title: '全日制',
            children: [
              {
                title: '总计',
                dataIndex: 'S1.C2.count',
                width: 40,
                align: 'center',
              },
              {
                title: '学术型',
                children: [
                  {
                    title: '第一志愿生',
                    dataIndex: 'S1.C2.stu_is_volunteer',
                    width: 120,
                    align: 'center',
                  },
                  {
                    title: '调剂生',
                    dataIndex: 'S1.C2.stu_is_adjust',
                    width: 100,
                    align: 'center',
                  },
                  {
                    title: '推免生',
                    dataIndex: 'S1.C2.stu_is_exemption',
                    width: 100,
                    align: 'center',
                  },
                  {
                    title: '退役大学生',
                    dataIndex: 'S1.C2.stu_special_program',
                    width: 120,
                    align: 'center',
                  },
                ],
              },
              {
                title: '总计',
                dataIndex: 'S1.C1.count',
                width: 40,
                align: 'center',
              },
              {
                title: '专业型',
                children: [
                  {
                    title: '第一志愿生',
                    dataIndex: 'S1.C1.stu_is_volunteer',
                    width: 120,
                    align: 'center',
                  },
                  {
                    title: '调剂生',
                    dataIndex: 'S1.C1.stu_is_adjust',
                    width: 100,
                    align: 'center',
                  },
                  {
                    title: '推免生',
                    dataIndex: 'S1.C1.stu_is_exemption',
                    width: 100,
                    align: 'center',
                  },
                  {
                    title: '退役大学生',
                    dataIndex: 'S1.C1.stu_special_program',
                    width: 120,
                    align: 'center',
                  },
                ],
              },
            ],
          },
          {
            title: '非全日制',
            children: [
              {
                title: '总计',
                dataIndex: 'S2.C1.count',
                width: 40,
                align: 'center',
              },
              {
                title: '专业型',
                children: [
                  {
                    title: '第一志愿生',
                    dataIndex: 'S2.C1.stu_is_volunteer',
                    width: 120,
                    align: 'center',
                  },
                  {
                    title: '调剂生',
                    dataIndex: 'S2.C1.stu_is_adjust',
                    width: 100,
                    align: 'center',
                  },
                  {
                    title: '退役大学生',
                    dataIndex: 'S2.C1.stu_special_program',
                    width: 120,
                    align: 'center',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: '总数',
        dataIndex: 'academyTotal',
        width: 60,
        align: 'center',
        fixed: 'right',
        render: (text, record, index) => {
          const obj = {
            children: text,
            props: {},
          };
          obj.props.rowSpan = mergeCells(index, record.academyName, dataSource, 'academyName');
          return obj;
        },
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

export default EnrollStudent;
