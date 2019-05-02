import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Avatar, Card, Col, Row } from 'antd';
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
  }

  render() {
    const {
      currentUser,
      currentUserLoading,
      colleges: { academies = [], majors = [] },
      students: { students = {} },
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
