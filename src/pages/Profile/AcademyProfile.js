import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Table, Divider, Badge } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './AcademyProfile.less';
import StudentTable from '@/components/StudentTable';
import TeacherTable from '@/components/TeacherTable';

const { Description } = DescriptionList;

@connect(({ colleges, loading }) => ({
  colleges,
  majorsLoading: loading.effects['colleges/fetchAcademy'],
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
      majorsLoading,
    } = this.props;

    const { aca_user: acaUser = {} } = academy;
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
    ];

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
          <Table
            style={{ marginBottom: 24 }}
            rowKey={record => record.uuid}
            columns={majorColumns}
            dataSource={academy.majors}
            pagination={false}
            loading={majorsLoading}
          />
          <div className={styles.title}>教师列表</div>
          <TeacherTable
            displayAlert={false}
            displaySearch={false}
            defaultFilter={{ academy: params.uuid }}
          />
          <div className={styles.title}>学生列表</div>
          <StudentTable
            displayAlert={false}
            displaySearch={false}
            defaultFilter={{ academy: params.uuid }}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default AcademyProfile;
