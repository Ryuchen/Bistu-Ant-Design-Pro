import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Divider, Table } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Link } from 'umi';
import router from 'umi/router';
import styles from './TeacherProfile.less';

const { Description } = DescriptionList;
const StatusChoice = ['在校', '离校', '留校'];
const CultivatingMode = ['学硕', '专硕'];
const GenderChoice = ['男', '女'];
const StudentCategory = ['全日制', '非全日制'];
const EnrollmentCategory = ['定向', '非定向'];

@connect(({ students, teachers, loading }) => ({
  students,
  teachers,
  studentsLoading: loading.effects['students/fetchStudents'],
}))
class TeacherProfile extends Component {
  componentDidMount() {
    const { dispatch, match } = this.props;
    const { params } = match;

    dispatch({
      type: 'teachers/fetchTeacher',
      payload: params.id || '1000000000',
    });

    dispatch({
      type: 'students/fetchStudents',
      payload: {
        tutor: params.id,
      },
    });
  }

  render() {
    const {
      teachers: { teacher },
      students: { students },
      studentsLoading,
    } = this.props;

    const { user = {}, academy = {} } = teacher;

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
          <Table
            style={{ marginBottom: 24 }}
            rowKey={record => record.user.id}
            columns={studentColumns}
            dataSource={students}
            pagination={false}
            loading={studentsLoading}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default TeacherProfile;
