import React, { PureComponent } from 'react';
import moment from 'moment';
import ExportJsonExcel from 'js-export-excel';
import { connect } from 'dva';
import router from 'umi/router';
import { Row, Col, Card, Form, Input, Select, Button, Upload, message, notification } from 'antd';

import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './StudentList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const GenderChoice = ['男', '女'];
const PoliticalChoice = ['党员', '团员', '群众', '民主党派'];
const DegreeChoice = ['博士', '硕士', '本科'];
const StatusChoice = ['在校', '离校', '留校'];
const StudentType = ['硕士', '博士', '本硕连读', '硕博连读', '直博'];
const StudentCategory = ['全日制', '非全日制'];
const CultivatingMode = ['学硕', '专硕'];
const EnrollmentCategory = ['定向', '非定向'];
const SpecialProgram = [
  '无',
  '少数民族高层次骨干计划',
  '强军计划',
  '对口支援西部地区高校定向培养计划',
  '援藏计划',
  '农村学校教育硕士师资培养计划',
  '高校辅导员攻读思想政治教育专业硕士学位计划',
  '高校思想政治理论课教师攻读博士学位计划',
  '其他',
];

@connect(({ students, colleges, teachers, loading }) => ({
  students,
  colleges,
  teachers,
  studentsLoading: loading.effects['students/fetchStudents'],
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'students/fetchStudents',
    });

    dispatch({
      type: 'colleges/fetchAcademies',
    });

    dispatch({
      type: 'teachers/fetchTeachers',
      payload: {
        limit: 100,
      },
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { formValues } = this.state;
    const { dispatch } = this.props;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      offset: (pagination.current - 1) * 20,
      limit: pagination.pageSize,
      ...formValues,
      ...filters,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'students/fetchStudents',
      payload: params,
    });
  };

  previewItem = id => {
    router.push(`/students/${id}`);
  };

  handleExportClick = studentColumns => {
    const { selectedRows } = this.state;
    const option = {};
    const exportData = [];
    const sheetFilters = [];
    const sheetHeaders = [];
    if (selectedRows) {
      selectedRows.forEach(row => {
        if (row) {
          const obj = {};
          studentColumns.forEach(column => {
            if (column.dataIndex) {
              if (column.dataIndex === 'user.username') {
                obj[column.title] = row.user.first_name + row.user.last_name;
              } else {
                obj[column.title] = row[column.dataIndex];
              }
              sheetFilters.push(column.title);
              sheetHeaders.push(column.title);
            }
          });
          exportData.push(obj);
        }
      });
    }
    option.fileName = '学生信息';
    option.datas = [
      {
        sheetData: exportData,
        sheetName: 'sheet',
        sheetFilter: Array.from(new Set(sheetFilters)),
        sheetHeader: Array.from(new Set(sheetHeaders)),
      },
    ];

    const toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'students/fetchStudents',
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      const values = {
        ...fieldsValue,
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'students/fetchStudents',
        payload: values,
      });
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      colleges: { academies = [] },
      teachers: { teachers = {} },
    } = this.props;

    const { selectedRows } = this.state;

    const { results = [] } = teachers;

    const props = {
      name: 'file',
      action: '//jsonplaceholder.typicode.com/posts/',
      showUploadList: false,
      onChange(info) {
        if (info.file.status === 'done') {
          notification.success({
            message: '上传成功',
            description: `${info.file.name}.`,
          });
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
          notification.error({
            message: '上传失败',
            description: `${info.file.name}.`,
          });
        }
      },
    };

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={4}>
            <FormItem label="学生姓名">
              {getFieldDecorator('stu_name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={4}>
            <FormItem label="指导老师">
              {getFieldDecorator('tutor')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {results.map(item => {
                    return <Option value={item.uuid}>{`${item.tut_name}`}</Option>;
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={5}>
            <FormItem label="所属学院">
              {getFieldDecorator('academy')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {academies.map(item => {
                    return <Option value={item.uuid}>{item.aca_cname}</Option>;
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6}>
            <FormItem label="手机号">
              {getFieldDecorator('stu_telephone')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={4}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit" size="small">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset} size="small">
                重置
              </Button>
              <Upload {...props}>
                <Button style={{ marginLeft: 8 }} size="small">
                  上传
                </Button>
              </Upload>
              {selectedRows.length > 0 && (
                <Button style={{ marginLeft: 8 }} onClick={this.handleExportClick} size="small">
                  导出
                </Button>
              )}
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      students: { students },
      studentsLoading,
    } = this.props;

    const { count, results = [] } = students;

    const { selectedRows } = this.state;

    const paginationProps = {
      pageSize: 20,
      total: count,
      showSizeChanger: false,
    };

    let nation = [];
    let source = [];

    results.forEach(item => {
      nation.push(item.stu_nation);
      source.push(item.stu_source);
    });

    nation = Array.from(new Set(nation));
    source = Array.from(new Set(source));

    const studentColumns = [
      {
        title: '学号',
        dataIndex: 'stu_number',
        key: 'stu_number',
        fixed: 'left',
        width: 190,
        sorter: (a, b) => a.stu_number - b.stu_number,
        render: val => `${val}`,
      },
      {
        title: '学生姓名',
        dataIndex: 'user.username',
        key: 'user.username',
        fixed: 'left',
        width: 100,
        render: (val, record) => (
          <a onClick={() => this.previewItem(record.uuid)}>
            {record.user.first_name}
            {record.user.last_name}
          </a>
        ),
      },
      {
        title: '性别',
        dataIndex: 'stu_gender',
        key: 'stu_gender',
        width: 90,
        filters: [{ text: GenderChoice[0], value: 'G1' }, { text: GenderChoice[1], value: 'G2' }],
        onFilter: (value, record) => record.stu_gender === value,
        render: val => `${val}`,
      },
      {
        title: '民族',
        dataIndex: 'stu_nation',
        key: 'stu_nation',
        width: 120,
        filters: nation.map(item => {
          return { text: item, value: item };
        }),
        onFilter: (value, record) => record.stu_nation === value,
        render: val => `${val}`,
      },
      {
        title: '生源地',
        dataIndex: 'stu_source',
        key: 'stu_source',
        width: 160,
        filters: source.map(item => {
          return { text: item, value: item };
        }),
        onFilter: (value, record) => record.stu_source === value,
        render: val => `${val}`,
      },
      {
        title: '政治面貌',
        dataIndex: 'stu_political',
        key: 'stu_political',
        width: 160,
        filters: [
          { text: PoliticalChoice[0], value: 'P1' },
          { text: PoliticalChoice[1], value: 'P2' },
          { text: PoliticalChoice[2], value: 'P3' },
          { text: PoliticalChoice[3], value: 'P4' },
        ],
        onFilter: (value, record) => record.stu_political === value,
        render: val => `${val}`,
      },
      {
        title: '学生类型',
        dataIndex: 'stu_type',
        key: 'stu_type',
        width: 160,
        filters: [
          { text: StudentType[0], value: 'S1' },
          { text: StudentType[1], value: 'S2' },
          { text: StudentType[2], value: 'S3' },
          { text: StudentType[3], value: 'S4' },
          { text: StudentType[4], value: 'S5' },
        ],
        onFilter: (value, record) => record.stu_type === value,
        render: val => `${val}`,
      },
      {
        title: '状态',
        dataIndex: 'stu_status',
        key: 'stu_status',
        width: 90,
        filters: [
          { text: StatusChoice[0], value: StatusChoice[0] },
          { text: StatusChoice[1], value: StatusChoice[1] },
          { text: StatusChoice[2], value: StatusChoice[2] },
        ],
        onFilter: (value, record) => record.stu_status === value,
        render: val => `${val}`,
      },
      {
        title: '学习形式',
        dataIndex: 'stu_learn_type',
        key: 'stu_learn_type',
        width: 120,
        filters: [
          { text: StudentCategory[0], value: StudentCategory[0] },
          { text: StudentCategory[1], value: StudentCategory[1] },
        ],
        onFilter: (value, record) => record.stu_learn_type === value,
        render: val => `${val}`,
      },
      {
        title: '学习阶段',
        dataIndex: 'stu_learn_status',
        key: 'stu_learn_status',
        width: 120,
        filters: [
          { text: DegreeChoice[0], value: DegreeChoice[0] },
          { text: DegreeChoice[1], value: DegreeChoice[1] },
          { text: DegreeChoice[1], value: DegreeChoice[1] },
        ],
        onFilter: (value, record) => record.stu_learn_status === value,
        render: val => `${val}`,
      },
      {
        title: '培养方式',
        dataIndex: 'stu_cultivating_mode',
        key: 'stu_cultivating_mode',
        width: 120,
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
        key: 'stu_enrollment_category',
        width: 120,
        filters: [
          { text: EnrollmentCategory[0], value: EnrollmentCategory[0] },
          { text: EnrollmentCategory[1], value: EnrollmentCategory[1] },
        ],
        onFilter: (value, record) => record.stu_enrollment_category === value,
        render: val => `${val}`,
      },
      {
        title: '专项计划',
        dataIndex: 'stu_special_program',
        key: 'stu_special_program',
        width: 400,
        filters: [
          { text: SpecialProgram[0], value: SpecialProgram[0] },
          { text: SpecialProgram[1], value: SpecialProgram[1] },
        ],
        onFilter: (value, record) => record.stu_special_program === value,
        render: val => `${val}`,
      },
      {
        title: '入学时间',
        dataIndex: 'stu_entrance_time',
        key: 'stu_entrance_time',
        sorter: (a, b) =>
          moment(a.stu_entrance_time, 'YYYY-MM-DD').toDate() -
          moment(b.stu_entrance_time, 'YYYY-MM-DD').toDate(),
        render: val => `${val}`,
      },
      {
        title: '毕业时间',
        dataIndex: 'stu_graduation_time',
        key: 'stu_graduation_time',
        sorter: (a, b) =>
          moment(a.stu_graduation_time, 'YYYY-MM-DD').toDate() -
          moment(b.stu_graduation_time, 'YYYY-MM-DD').toDate(),
        render: val => `${val}`,
      },
      {
        title: '操作',
        fixed: 'right',
        key: 'uuid',
        width: 60,
        render: (val, record) => <a onClick={() => this.previewItem(record.uuid)}>详情</a>,
      },
    ];

    return (
      <PageHeaderWrapper title="学生列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <StandardTable
              columns={studentColumns}
              rowKey={record => record.stu_number}
              dataSource={results}
              selectedRows={selectedRows}
              scroll={{ x: 2400, y: 900 }}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              total={count}
              pagination={paginationProps}
              loading={studentsLoading}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
