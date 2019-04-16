import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Divider } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Link } from 'umi';
import styles from './TeacherProfile.less';
import StudentTable from '@/components/StudentTable';

const { Description } = DescriptionList;

@connect(({ teachers }) => ({
  teachers,
}))
class TeacherProfile extends Component {
  componentDidMount() {
    const { dispatch, match } = this.props;
    const { params } = match;

    dispatch({
      type: 'teachers/fetchTeacher',
      payload: params.id || '1000000000',
    });
  }

  render() {
    const {
      teachers: { teacher },
    } = this.props;

    const { user = {}, academy = {} } = teacher;

    return (
      <PageHeaderWrapper title={user.first_name + user.last_name}>
        <Card bordered={false} style={{ marginBottom: 24 }}>
          <div>
            <div className={styles.avatarHolder}>
              {teacher.tut_avatar ? (
                <img alt="" src={teacher.tut_avatar} />
              ) : (
                <img
                  alt=""
                  src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
                />
              )}
              <div className={styles.name}>{user.first_name + user.last_name}</div>
              <div className={styles.detail}>
                <span>
                  <Link to={`../colleges/${academy.uuid}`}>{academy.aca_cname}</Link>
                </span>
                <Divider type="vertical" style={{ margin: 32 }} />
                <span>{teacher.tut_title}</span>
                <Divider type="vertical" style={{ margin: 32 }} />
                <span>{teacher.research}</span>
              </div>
            </div>
            <Divider dashed />
          </div>
          <DescriptionList size="large" title="教师信息" style={{ marginBottom: 32 }}>
            <Description term="教师编号">{teacher.tut_number}</Description>
            <Description term="教师性别">{teacher.tut_gender}</Description>
            <Description term="政治面貌">{teacher.tut_political}</Description>
            <Description term="职称">{teacher.tut_title}</Description>
            <Description term="电话号码">{teacher.tut_telephone}</Description>
            <Description term="电子邮箱">{user.email}</Description>
            <Description term="出生日期">{teacher.tut_birth_day}</Description>
            <Description term="入职日期">{teacher.tut_entry_day}</Description>
            <Description term="身份证号">{teacher.tut_cardID}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.title}>学生列表</div>
          <StudentTable
            displayAlert={false}
            displaySearch={false}
            defaultFilter={{ teacher: teacher.uuid }}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default TeacherProfile;
