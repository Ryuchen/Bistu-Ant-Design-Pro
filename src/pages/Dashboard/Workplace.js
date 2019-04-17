import React, { PureComponent } from 'react';
import { stringify } from 'qs';
import { connect } from 'dva';
import Link from 'umi/link';
import moment from 'moment';
import { Avatar, Button, Card, Col, notification, Row, Select, Table } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Greeting from '@/components/Greeting';

import styles from './Workplace.less';

@connect(({ user, colleges, students, loading }) => ({
  currentUser: user.currentUser,
  colleges,
  students,
  currentUserLoading: loading.effects['user/fetchCurrent'],
  statisticLoading: loading.effects['students/fetchStatistics'],
}))
class Workplace extends PureComponent {
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
      type: 'user/fetchCurrent',
    });

    dispatch({
      type: 'colleges/fetchAcademies',
    });

    dispatch({
      type: 'colleges/fetchMajors',
    });

    dispatch({
      type: 'students/fetchStudents',
      payload: {
        limit: 1,
        offset: 1,
      },
    });

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
      currentUser,
      currentUserLoading,
      colleges: { academies = [], majors = [] },
      students: { students = {}, statistics = [] },
      statisticLoading,
    } = this.props;
    const { xlsYear } = this.state;

    const pageHeaderContent = currentUser ? (
      <div className={styles.pageHeaderContent}>
        <div className={styles.avatar}>
          <Avatar size="large" src={currentUser.avatar} />
        </div>
        <div className={styles.content}>
          <div className={styles.contentTitle}>
            <Greeting currentUser={currentUser} />
          </div>
          <div>
            {currentUser.title} | {currentUser.group}
          </div>
        </div>
      </div>
    ) : null;
    const extraContent = (
      <div className={styles.extraContent}>
        <div className={styles.statItem}>
          <p>学院数量</p>
          <p>{academies.length}</p>
        </div>
        <div className={styles.statItem}>
          <p>研究点数量</p>
          <p>{majors.length}</p>
        </div>
        <div className={styles.statItem}>
          <p>研究生数量</p>
          <p>{students.count}</p>
        </div>
      </div>
    );

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
      <PageHeaderWrapper
        title="北京信息科技大学"
        oading={currentUserLoading}
        content={pageHeaderContent}
        extraContent={extraContent}
        type="success"
      >
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
              bordered={false}
              bodyStyle={{ padding: 0 }}
            >
              <Table
                columns={columns}
                dataSource={dataSource}
                rowKey={record => record.index}
                loading={statisticLoading}
                bordered
                size="small"
                pagination={false}
                scroll={{ x: 1910, y: 600 }}
              />
            </Card>
          </Col>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card
              className={styles.projectList}
              style={{ marginBottom: 24 }}
              title="研究生学院列表"
              bordered={false}
              bodyStyle={{ padding: 0 }}
            >
              {academies.map(item => (
                <Card.Grid className={styles.projectGrid} key={item.uuid}>
                  <Card bodyStyle={{ padding: 0 }} bordered={false}>
                    <Card.Meta
                      title={
                        <div className={styles.cardTitle}>
                          <Avatar src={item.aca_avatar} />
                          <Link to={`/colleges/${item.uuid}`}>{item.aca_cname}</Link>
                        </div>
                      }
                      description={`学院电话：${item.aca_phone} | 学院传真：${item.aca_fax}`}
                    />
                    <div className={styles.projectItemContent}>
                      <a href={item.aca_href}>访问官网: {item.aca_href}</a>
                      {item.student_count && (
                        <span className={styles.datetime} title={item.student_count}>
                          {`学院人数：${item.student_count}`}
                        </span>
                      )}
                    </div>
                  </Card>
                </Card.Grid>
              ))}
            </Card>
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default Workplace;
