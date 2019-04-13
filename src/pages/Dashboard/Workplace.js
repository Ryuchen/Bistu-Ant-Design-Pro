import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Row, Col, Card, Avatar, Table } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Greeting from '@/components/Greeting';
import styles from './Workplace.less';

@connect(({ user, colleges, students, loading }) => ({
  currentUser: user.currentUser,
  colleges,
  students,
  currentUserLoading: loading.effects['user/fetchCurrent'],
}))
class Workplace extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
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
    });
  }

  render() {
    const {
      currentUser,
      currentUserLoading,
      colleges: { academies = [], majors = [] },
      students: { students = {}, statistics = [] },
    } = this.props;

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
        dataIndex: 'name',
        width: 140,
        fixed: 'left',
        render: (text, record, index) => {
          const obj = {
            children: text,
            props: {},
          };
          obj.props.rowSpan = mergeCells(index, record.name, statistics, 'name');
          return obj;
        },
      },
      {
        title: '招生专业代码',
        dataIndex: 'major.maj_code',
        width: 120,
        fixed: 'left',
      },
      {
        title: '招生专业名称',
        dataIndex: 'major.name',
        width: 180,
        fixed: 'left',
      },
      {
        title: '各专业招生人数',
        children: [
          {
            title: '专业人数',
            dataIndex: 'major.count',
            width: 40,
            align: 'center',
          },
          {
            title: '全日制',
            children: [
              {
                title: '总计',
                dataIndex: '11',
                width: 40,
                align: 'center',
              },
              {
                title: '学术型',
                children: [
                  {
                    title: '第一志愿生',
                    dataIndex: '0',
                    width: 100,
                    align: 'center',
                  },
                  {
                    title: '调剂生',
                    dataIndex: '1',
                    width: 100,
                    align: 'center',
                  },
                  {
                    title: '推免生',
                    dataIndex: '2',
                    width: 100,
                    align: 'center',
                  },
                  {
                    title: '退役大学生',
                    dataIndex: '3',
                    width: 120,
                    align: 'center',
                  },
                ],
              },
              {
                title: '总计',
                dataIndex: '12',
                width: 40,
                align: 'center',
              },
              {
                title: '专业型',
                children: [
                  {
                    title: '一志愿生',
                    dataIndex: '4',
                    width: 100,
                    align: 'center',
                  },
                  {
                    title: '调剂生',
                    dataIndex: '5',
                    width: 100,
                    align: 'center',
                  },
                  {
                    title: '推免生',
                    dataIndex: '6',
                    width: 100,
                    align: 'center',
                  },
                  {
                    title: '退役大学生',
                    dataIndex: '7',
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
                dataIndex: '13',
                width: 40,
                align: 'center',
              },
              {
                title: '专业型',
                children: [
                  {
                    title: '一志愿生',
                    dataIndex: '8',
                    width: 100,
                    align: 'center',
                  },
                  {
                    title: '调剂生',
                    dataIndex: '9',
                    width: 100,
                    align: 'center',
                  },
                  {
                    title: '退役大学生',
                    dataIndex: '10',
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
        dataIndex: 'count',
        width: 60,
        align: 'center',
        fixed: 'right',
        render: (text, record, index) => {
          const obj = {
            children: text,
            props: {},
          };
          obj.props.rowSpan = mergeCells(index, record.name, statistics, 'name');
          return obj;
        },
      },
    ];

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
            <Card
              className={styles.projectList}
              style={{ marginBottom: 24 }}
              title="年硕士生分专业招生人数汇总表"
              bordered={false}
              bodyStyle={{ padding: 0 }}
            >
              <Table
                columns={columns}
                dataSource={statistics}
                rowKey={record => record.code}
                bordered
                size="small"
                pagination={false}
                scroll={{ x: 1820, y: 600 }}
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
