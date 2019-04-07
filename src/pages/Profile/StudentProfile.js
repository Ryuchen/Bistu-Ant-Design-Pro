import React, { Component } from 'react';
import { connect } from 'dva';
import { Badge, Card, Divider } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Link } from 'umi';
import styles from './StudentProfile.less';

const { Description } = DescriptionList;

@connect(({ students }) => ({
  students,
}))
class StudentProfile extends Component {
  componentDidMount() {
    const { dispatch, match } = this.props;
    const { params } = match;

    dispatch({
      type: 'students/fetchStudent',
      payload: params.id || '1000000000',
    });
  }

  render() {
    const {
      students: { student },
    } = this.props;
    const { user = {}, tutor = {}, academy = {}, major = {} } = student;
    const { user: teacher = {}, academy: teacherAcademy = {} } = tutor;

    return (
      <PageHeaderWrapper title={user.first_name + user.last_name}>
        <Card bordered={false} style={{ marginBottom: 24 }}>
          <div>
            <div className={styles.avatarHolder}>
              {student.stu_avatar ? (
                <img alt="" src={student.stu_avatar} />
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
                <span>{major.maj_name}</span>
                <Divider type="vertical" style={{ margin: 32 }} />
                <span>{student.research}</span>
              </div>
            </div>
            <Divider dashed />
          </div>
          <DescriptionList size="large" title="学生详情" style={{ marginBottom: 32 }}>
            <Description term="学生编号">{student.stu_number}</Description>
            <Description term="性别">{student.stu_gender}</Description>
            <Description term="国籍">{student.stu_nationality}</Description>
            <Description term="民族">{student.stu_nation}</Description>
            <Description term="出生日期">{student.stu_birth_day}</Description>
            <Description term={student.stu_card_type}>{student.stu_cardID}</Description>
            <Description term="生源地">{student.stu_source}</Description>
            <Description term="联系电话">{student.stu_telephone}</Description>
            <Description term="电子邮箱">{user.email}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="在校情况" style={{ marginBottom: 32 }}>
            <Description term="入学时间">{student.stu_entrance_time}</Description>
            <Description term="毕业时间">{student.stu_graduation_time}</Description>
            <Description term="在校状态">{student.stu_status}</Description>
            <Description term="学生类型">{student.stu_type}</Description>
            <Description term="学习阶段">{student.stu_learn_status}</Description>
            <Description term="学习形式">{student.stu_learn_type}</Description>
            <Description term="培养方式">{student.stu_cultivating_mode}</Description>
            <Description term="录取类型">{student.stu_enrollment_category}</Description>
            <Description term="专项计划">{student.stu_special_program}</Description>
            <Description term="档案在校">
              {student.stu_is_archives ? (
                <Badge status="success" style={{ marginLeft: 5 }} />
              ) : (
                <Badge status="error" style={{ marginLeft: 5 }} />
              )}
            </Description>
            <Description term="固定收入">
              {student.stu_is_regular_income ? (
                <Badge status="success" style={{ marginLeft: 5 }} />
              ) : (
                <Badge status="error" style={{ marginLeft: 5 }} />
              )}
            </Description>
            <Description term="优秀毕业生">
              {student.stu_is_superb ? (
                <Badge status="success" style={{ marginLeft: 5 }} />
              ) : (
                <Badge status="error" style={{ marginLeft: 5 }} />
              )}
            </Description>
            <Description term="欠缴学费">
              {student.stu_is_tuition_fees ? (
                <Badge status="success" style={{ marginLeft: 5 }} />
              ) : (
                <Badge status="error" style={{ marginLeft: 5 }} />
              )}
            </Description>
            <Description term="农村户口">
              {student.stu_is_village ? (
                <Badge status="success" style={{ marginLeft: 5 }} />
              ) : (
                <Badge status="error" style={{ marginLeft: 5 }} />
              )}
            </Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="导师信息" style={{ marginBottom: 32 }}>
            <Description term="姓名">
              <Link to={`/teachers/${teacher.uuid}`}>
                {teacher.first_name}
                {teacher.last_name}
              </Link>
            </Description>
            <Description term="职称">{tutor.tut_title}</Description>
            <Description term="学院">{teacherAcademy.aca_cname}</Description>
            <Description term="电话">{tutor.tut_telephone}</Description>
            <Description term="邮箱">{teacher.email}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="学院信息" style={{ marginBottom: 32 }}>
            <Description term="学院名称">
              <Link to={`../colleges/${academy.uuid}`}>{academy.aca_cname}</Link>
            </Description>
            <Description term="专业名称">{major.maj_code}</Description>
            <Description term="研究方向">{student.research}</Description>
            <Description term="学科类型">{major.maj_type}</Description>
            <Description term="学位类型">{major.maj_degree}</Description>
          </DescriptionList>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default StudentProfile;
