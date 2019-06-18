import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Divider } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './AcademyProfile.less';
import MajorTable from '@/components/MajorTable';
import StudentTable from '@/components/StudentTable';
import TeacherTable from '@/components/TeacherTable';

const { Description } = DescriptionList;

@connect(({ colleges }) => ({
  colleges,
}))
class AcademyProfile extends Component {
  componentDidMount() {
    const { dispatch, match } = this.props;
    const { params } = match;

    dispatch({
      type: 'colleges/fetchAcademy',
      payload: params.uuid || '1000000000',
    });
  }

  render() {
    const {
      colleges: { academy },
      match: { params },
    } = this.props;

    const { aca_user: acaUser = {} } = academy;

    return (
      <PageHeaderWrapper title={academy.aca_cname}>
        <Card bordered={false}>
          <DescriptionList size="large" title="学院详情" style={{ marginBottom: 32 }}>
            <Description term="学院编号">{academy.aca_code}</Description>
            <Description term="学院电话">{academy.aca_phone}</Description>
            <Description term="学院传真">{academy.aca_fax}</Description>
            <Description term="学院网址">
              <a href={academy.aca_href}>{academy.aca_href}</a>
            </Description>
            <Description term="学院简介">{academy.aca_brief}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="管理人信息" style={{ marginBottom: 32 }}>
            <Description term="姓名">
              {acaUser.first_name}
              {acaUser.last_name}
            </Description>
            <Description term="邮箱">{acaUser.email}</Description>
            <Description term="最近一次登录">{acaUser.last_login}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.title}>专业列表</div>
          <MajorTable defaultFilter={{ academy: params.uuid }} />
          <div className={styles.title}>教师列表</div>
          <TeacherTable
            displayAlert={false}
            displaySearch={false}
            defaultFilter={{ tut_academy: params.uuid }}
          />
          <div className={styles.title}>学生列表</div>
          <StudentTable
            displayAlert={false}
            displaySearch={false}
            defaultFilter={{ stu_academy: params.uuid }}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default AcademyProfile;
