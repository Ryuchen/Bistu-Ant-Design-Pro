import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Row, Col, Card, Avatar } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Greeting from '@/components/Greeting';
import styles from './Workplace.less';

@connect(({ user, colleges, loading }) => ({
  currentUser: user.currentUser,
  colleges,
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
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
  }

  render() {
    const {
      currentUser,
      currentUserLoading,
      colleges: { academies },
    } = this.props;

    const pageHeaderContent =
      currentUser && Object.keys(currentUser).length ? (
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

    return (
      <PageHeaderWrapper loading={currentUserLoading} content={pageHeaderContent}>
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
