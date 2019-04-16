import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Table, Divider, Badge } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import styles from './AcademyProfile.less';
import StudentTable from '@/components/StudentTable';

const { Description } = DescriptionList;

@connect(({ colleges, teachers, loading }) => ({
  colleges,
  teachers,
  majorsLoading: loading.effects['colleges/fetchAcademy'],
  teachersLoading: loading.effects['teachers/fetchTeachers'],
}))
class AcademyProfile extends Component {
  componentDidMount() {
    const { dispatch, match } = this.props;
    const { params } = match;

    dispatch({
      type: 'colleges/fetchAcademy',
      payload: params.uuid || '1000000000',
    });

    dispatch({
      type: 'students/fetchStudents',
      payload: {
        academy: params.uuid,
      },
    });

    dispatch({
      type: 'teachers/fetchTeachers',
      payload: {
        academy: params.uuid,
      },
    });
  }

  render() {
    const {
      colleges: { academy },
      teachers: { teachers },
      majorsLoading,
      teachersLoading,
    } = this.props;

    const { count: tutCount, results: tutResults = [] } = teachers;
    const { aca_user: acaUser = {} } = academy;

    const teacherColumns = [
      {
        title: '教师编号',
        dataIndex: 'tut_number',
        render: val => `${val}`,
      },
      {
        title: '教师姓名',
        dataIndex: 'user.id',
        key: 'user.id',
        render: (val, record) => (
          <a onClick={() => router.push(`/teachers/${record.uuid}`)}>
            {record.user.first_name}
            {record.user.last_name}
          </a>
        ),
      },
      {
        title: '性别',
        dataIndex: 'tut_gender',
        render: val => `${val}`,
      },
      {
        title: '政治面貌',
        dataIndex: 'tut_political',
        render: val => `${val}`,
      },
      {
        title: '教师邮箱',
        dataIndex: 'user.email',
        render: val => `${val}`,
      },
      {
        title: '教师电话',
        dataIndex: 'tut_telephone',
        width: 190,
        render: val => `${val}`,
      },
      {
        title: '入职日期',
        dataIndex: 'tut_entry_day',
        render: val => `${val}`,
      },
      {
        title: '职称',
        dataIndex: 'tut_title',
        render: val => `${val}`,
      },
      {
        title: '毕业院校',
        dataIndex: 'education.edu_school_name',
        render: val => `${val}`,
      },
    ];

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
          <div className={styles.title}>教师列表 ({tutCount})</div>
          <Table
            style={{ marginBottom: 24 }}
            rowKey={record => record.uuid}
            columns={teacherColumns}
            dataSource={tutResults}
            pagination={false}
            loading={teachersLoading}
          />
          <div className={styles.title}>学生列表</div>
          <StudentTable
            displayAlert={false}
            displaySearch={false}
            defaultFilter={{ academy: academy.uuid }}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default AcademyProfile;
