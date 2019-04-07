import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Table, Divider } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import styles from './AcademyProfile.less';

const { Description } = DescriptionList;
const StatusChoice = ['在校', '离校', '留校'];
const CultivatingMode = ['学硕', '专硕'];
const GenderChoice = ['男', '女'];
const StudentCategory = ['全日制', '非全日制'];
const EnrollmentCategory = ['定向', '非定向'];
const PoliticalChoice = ['党员', '团员', '群众', '民主党派'];
const TeacherTitle = ['讲师', '副教授', '教授', '副研究员', '研究员', '助教'];

@connect(({ colleges, students, teachers, loading }) => ({
  colleges,
  students,
  teachers,
  majorsLoading: loading.effects['colleges/fetchAcademy'],
  studentsLoading: loading.effects['students/fetchStudents'],
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
      students: { students },
      teachers: { teachers },
      majorsLoading,
      studentsLoading,
      teachersLoading,
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
        render: value => (value ? `是` : `否`),
      },
      {
        title: '二级学科',
        dataIndex: 'maj_second',
        render: value => (value ? `是` : `否`),
      },
    ];

    const studentColumns = [
      {
        title: '学号',
        dataIndex: 'stu_number',
        sorter: true,
        render: val => `${val}`,
      },
      {
        title: '学生姓名',
        dataIndex: 'user.id',
        key: 'user.id',
        render: (val, record) => (
          <a onClick={() => router.push(`/students/${record.user.id}`)}>
            {record.user.first_name}
            {record.user.last_name}
          </a>
        ),
      },
      {
        title: '性别',
        dataIndex: 'stu_gender',
        filters: [
          { text: GenderChoice[0], value: GenderChoice[0] },
          { text: GenderChoice[1], value: GenderChoice[1] },
        ],
        onFilter: (value, record) => record.stu_gender === value,
        render: val => `${val}`,
      },
      {
        title: '民族',
        dataIndex: 'stu_nation',
        sorter: true,
        render: val => `${val}`,
      },
      {
        title: '状态',
        dataIndex: 'stu_status',
        filters: [
          { text: StatusChoice[0], value: StatusChoice[0] },
          { text: StatusChoice[1], value: StatusChoice[1] },
          { text: StatusChoice[2], value: StatusChoice[2] },
        ],
        onFilter: (value, record) => record.stu_status === value,
        render: val => `${val}`,
      },
      {
        title: '学科专业',
        dataIndex: 'major',
        sorter: true,
        render: val => `${val.maj_name}`,
      },
      {
        title: '学习形式',
        dataIndex: 'stu_learn_type',
        filters: [
          { text: StudentCategory[0], value: StudentCategory[0] },
          { text: StudentCategory[1], value: StudentCategory[1] },
        ],
        onFilter: (value, record) => record.stu_learn_type === value,
        render: val => `${val}`,
      },
      {
        title: '培养方式',
        dataIndex: 'stu_cultivating_mode',
        filters: [
          { text: CultivatingMode[0], value: CultivatingMode[0] },
          { text: CultivatingMode[1], value: CultivatingMode[1] },
        ],
        onFilter: (value, record) => record.stu_cultivating_mode === value,
        render: val => `${val}`,
      },
      {
        title: '录取类型',
        dataIndex: 'stu_enrollment_category',
        filters: [
          { text: EnrollmentCategory[0], value: EnrollmentCategory[0] },
          { text: EnrollmentCategory[1], value: EnrollmentCategory[1] },
        ],
        onFilter: (value, record) => record.stu_enrollment_category === value,
        render: val => `${val}`,
      },
      {
        title: '入学时间',
        dataIndex: 'stu_entrance_time',
        sorter: true,
        render: val => `${val}`,
      },
      {
        title: '毕业时间',
        dataIndex: 'stu_graduation_time',
        sorter: true,
        render: val => `${val}`,
      },
    ];

    const teacherColumns = [
      {
        title: '教师编号',
        dataIndex: 'tut_number',
        sorter: true,
        render: val => `${val}`,
      },
      {
        title: '教师姓名',
        dataIndex: 'user.id',
        key: 'user.id',
        render: (val, record) => (
          <a onClick={() => router.push(`/teachers/${record.user.id}`)}>
            {record.user.first_name}
            {record.user.last_name}
          </a>
        ),
      },
      {
        title: '性别',
        dataIndex: 'tut_gender',
        filters: [
          { text: GenderChoice[0], value: GenderChoice[0] },
          { text: GenderChoice[1], value: GenderChoice[1] },
        ],
        onFilter: (value, record) => record.stu_gender === value,
        render: val => `${val}`,
      },
      {
        title: '职称',
        dataIndex: 'tut_title',
        filters: [
          { text: TeacherTitle[0], value: TeacherTitle[0] },
          { text: TeacherTitle[1], value: TeacherTitle[1] },
          { text: TeacherTitle[2], value: TeacherTitle[2] },
          { text: TeacherTitle[3], value: TeacherTitle[3] },
          { text: TeacherTitle[4], value: TeacherTitle[4] },
          { text: TeacherTitle[5], value: TeacherTitle[5] },
        ],
        onFilter: (value, record) => record.stu_political === value,
        render: val => `${val}`,
      },
      {
        title: '政治面貌',
        dataIndex: 'tut_political',
        filters: [
          { text: PoliticalChoice[0], value: PoliticalChoice[0] },
          { text: PoliticalChoice[1], value: PoliticalChoice[1] },
          { text: PoliticalChoice[2], value: PoliticalChoice[2] },
          { text: PoliticalChoice[3], value: PoliticalChoice[3] },
        ],
        onFilter: (value, record) => record.stu_political === value,
        render: val => `${val}`,
      },
      {
        title: '研究方向',
        dataIndex: 'research',
        sorter: true,
        render: val => `${val}`,
      },
      {
        title: '教师邮箱',
        dataIndex: 'user.email',
        sorter: true,
        render: val => `${val}`,
      },
      {
        title: '教师电话',
        dataIndex: 'tut_telephone',
        width: 190,
        sorter: true,
        render: val => `${val}`,
      },
      {
        title: '入职日期',
        dataIndex: 'tut_entry_day',
        sorter: true,
        render: val => `${val}`,
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
          <div className={styles.title}>教师列表</div>
          <Table
            style={{ marginBottom: 24 }}
            rowKey={record => record.user.id}
            columns={teacherColumns}
            dataSource={teachers}
            pagination={false}
            loading={teachersLoading}
          />
          <div className={styles.title}>专业列表</div>
          <Table
            style={{ marginBottom: 24 }}
            rowKey={record => record.uuid}
            columns={majorColumns}
            dataSource={academy.majors}
            pagination={false}
            loading={majorsLoading}
          />
          <div className={styles.title}>学生列表</div>
          <Table
            style={{ marginBottom: 24 }}
            rowKey={record => record.user.id}
            columns={studentColumns}
            dataSource={students}
            pagination={{ pageSize: 10 }}
            loading={studentsLoading}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default AcademyProfile;
