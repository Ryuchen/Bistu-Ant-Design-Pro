import React, { PureComponent } from 'react';
import moment from 'moment';
import ExportJsonExcel from 'js-export-excel';
import { connect } from 'dva';
import router from 'umi/router';
import { Row, Col, Form, Input, Select, Button, Upload, notification, Badge } from 'antd';

import StandardTable from '@/components/StandardTable';

import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ global, students, colleges, teachers, loading }) => ({
  global,
  students,
  colleges,
  teachers,
  studentsLoading: loading.effects['students/fetchStudents'],
}))
@Form.create()
class StudentTable extends PureComponent {
  constructor(props) {
    super(props);
    const { defaultFilter } = this.props;
    this.state = {
      selectedRows: [],
      formValues: {
        ...defaultFilter,
      },
    };
  }

  componentDidMount() {
    const { formValues } = this.state;
    const { displaySearch, dispatch } = this.props;

    dispatch({
      type: 'global/fetchGlobalDefinitions',
    });

    dispatch({
      type: 'students/fetchStudents',
      payload: formValues,
    });

    if (displaySearch) {
      dispatch({
        type: 'colleges/fetchAcademies',
      });

      dispatch({
        type: 'teachers/fetchTeachers',
        payload: {
          limit: 10000,
          ...formValues,
        },
      });
    }
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
      if (sorter.order === 'desc') {
        params.sorter = `+${sorter.field}`;
      }
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
              } else if (column.dataIndex === 'academy.aca_cname') {
                obj[column.title] = row.academy.aca_cname;
              } else if (column.dataIndex === 'major.maj_name') {
                obj[column.title] = row.major.maj_name;
              } else if (column.dataIndex === 'major.maj_type') {
                obj[column.title] = row.major.maj_type;
              } else if (row[column.dataIndex] === true) {
                obj[column.title] = '是';
              } else if (row[column.dataIndex] === false) {
                obj[column.title] = '否';
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
    const { form, dispatch, defaultFilter } = this.props;
    const { formValues } = this.state;
    form.resetFields();
    this.setState({
      formValues: {
        ...defaultFilter,
      },
    });
    dispatch({
      type: 'students/fetchStudents',
      payload: formValues,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form, defaultFilter } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      const values = {
        ...fieldsValue,
        ...defaultFilter,
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

  getCookie = name => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i += 1) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === `${name}=`) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  renderSimpleForm = studentColumns => {
    const {
      form: { getFieldDecorator },
      colleges: { academies = [] },
      teachers: { teachers = {} },
      dispatch,
    } = this.props;

    const { selectedRows, formValues } = this.state;

    const { results = [] } = teachers;

    const props = {
      name: 'file',
      action: '/api/students/students/',
      headers: {
        'X-CSRFToken': this.getCookie('csrftoken'),
      },
      showUploadList: false,
      onChange(info) {
        if (info.file.status === 'done') {
          notification.success({
            message: '上传成功',
            description: `${info.file.name}.`,
          });

          dispatch({
            type: 'students/fetchStudents',
            payload: formValues,
          });
        } else if (info.file.status === 'error') {
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
                <Button
                  style={{ marginLeft: 8 }}
                  onClick={this.handleExportClick(studentColumns)}
                  size="small"
                >
                  导出
                </Button>
              )}
            </span>
          </Col>
        </Row>
      </Form>
    );
  };

  render() {
    const { selectedRows } = this.state;
    const {
      global: { definitions },
      students: { students },
      studentsLoading,
      displayAlert,
      displaySearch,
      displayRowsSelect,
    } = this.props;

    const { count, results = [] } = students;

    const paginationProps = {
      pageSize: 20,
      total: count,
      showSizeChanger: false,
    };

    const nation = Array.from(
      new Set(
        results.map(item => {
          return item.stu_nation;
        })
      )
    );
    const source = Array.from(
      new Set(
        results.map(item => {
          return item.stu_source;
        })
      )
    );

    const {
      gender_choice: ServerGenderChoice = {},
      degree_choice: ServerDegreeChoice = {},
      political_choice: ServerPoliticalChoice = {},
      major_type: ServerMajorTypeChoice = {},
      status_choice: ServerStatusChoice = {},
      student_type: ServerStudentTypeChoice = {},
      student_category: ServerStudentCategoryChoice = {},
      cultivating_mode: ServerCultivationModeChoice = {},
      enrollment_category: ServerEnrollmentCategory = {},
      special_program: ServerSpecialProgramChoice = {},
    } = definitions;

    const filterGenderChoice = Object.entries(ServerGenderChoice).map(([itemKey, itemValue]) => {
      return { text: itemValue, value: itemKey };
    });

    const filterDegreeChoice = Object.entries(ServerDegreeChoice).map(([itemKey, itemValue]) => {
      return { text: itemValue, value: itemKey };
    });

    const filterPoliticalChoice = Object.entries(ServerPoliticalChoice).map(
      ([itemKey, itemValue]) => {
        return { text: itemValue, value: itemKey };
      }
    );

    const filterMajorTypeChoice = Object.entries(ServerMajorTypeChoice).map(
      ([itemKey, itemValue]) => {
        return { text: itemValue, value: itemKey };
      }
    );

    const filterStatusChoice = Object.entries(ServerStatusChoice).map(([itemKey, itemValue]) => {
      return { text: itemValue, value: itemKey };
    });

    const filterStudentTypeChoice = Object.entries(ServerStudentTypeChoice).map(
      ([itemKey, itemValue]) => {
        return { text: itemValue, value: itemKey };
      }
    );

    const filterStudentCategoryChoice = Object.entries(ServerStudentCategoryChoice).map(
      ([itemKey, itemValue]) => {
        return { text: itemValue, value: itemKey };
      }
    );

    const filterCultivationModeChoice = Object.entries(ServerCultivationModeChoice).map(
      ([itemKey, itemValue]) => {
        return { text: itemValue, value: itemKey };
      }
    );

    const filterEnrollmentCategory = Object.entries(ServerEnrollmentCategory).map(
      ([itemKey, itemValue]) => {
        return { text: itemValue, value: itemKey };
      }
    );

    const filterSpecialProgramChoice = Object.entries(ServerSpecialProgramChoice).map(
      ([itemKey, itemValue]) => {
        return { text: itemValue, value: itemKey };
      }
    );

    const studentColumns = [
      {
        title: '姓名',
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
        title: '学号',
        dataIndex: 'stu_number',
        key: 'stu_number',
        fixed: 'left',
        width: 190,
        sorter: (a, b) => a.stu_number - b.stu_number,
        render: val => `${val}`,
      },
      {
        title: '考生号',
        dataIndex: 'stu_candidate_number',
        key: 'stu_candidate_number',
        width: 190,
        sorter: (a, b) => a.stu_candidate_number - b.stu_candidate_number,
        render: val => `${val}`,
      },
      {
        title: '证件类型',
        dataIndex: 'stu_card_type',
        key: 'stu_card_type',
        width: 190,
        render: val => `${val}`,
      },
      {
        title: '证件号',
        dataIndex: 'stu_cardID',
        key: 'stu_cardID',
        width: 190,
        sorter: (a, b) => a.stu_cardID - b.stu_cardID,
        render: val => `${val}`,
      },
      {
        title: '性别',
        dataIndex: 'stu_gender',
        key: 'stu_gender',
        width: 90,
        filters: filterGenderChoice,
        onFilter: (value, record) => record.stu_gender === ServerGenderChoice[value],
        render: val => `${val}`,
      },
      {
        title: '出生日期',
        dataIndex: 'stu_birth_day',
        key: 'stu_birth_day',
        width: 190,
        sorter: (a, b) =>
          moment(a.stu_birth_day, 'YYYY-MM-DD').toDate() -
          moment(b.stu_birth_day, 'YYYY-MM-DD').toDate(),
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
        title: '农村学生',
        dataIndex: 'stu_is_village',
        width: 160,
        render: value => <Badge status={value ? 'success' : 'error'} style={{ marginLeft: 5 }} />,
      },
      {
        title: '政治面貌',
        dataIndex: 'stu_political',
        key: 'stu_political',
        width: 160,
        filters: filterPoliticalChoice,
        onFilter: (value, record) => record.stu_political === ServerPoliticalChoice[value],
        render: val => `${val}`,
      },
      {
        title: '学院',
        dataIndex: 'academy.aca_cname',
        width: 160,
        render: val => `${val}`,
      },
      {
        title: '专业',
        dataIndex: 'major.maj_name',
        width: 160,
        render: val => `${val}`,
      },
      {
        title: '学科类型',
        dataIndex: 'major.maj_type',
        width: 160,
        filters: filterMajorTypeChoice,
        onFilter: (value, record) => record.major.maj_type === ServerMajorTypeChoice[value],
        render: val => `${val}`,
      },
      {
        title: '所属班级',
        dataIndex: 'stu_class',
        width: 160,
        render: val => `${val}`,
      },
      {
        title: '状态',
        dataIndex: 'stu_status',
        key: 'stu_status',
        width: 90,
        filters: filterStatusChoice,
        onFilter: (value, record) => record.stu_status === ServerStatusChoice[value],
        render: val => `${val}`,
      },
      {
        title: '学生类型',
        dataIndex: 'stu_type',
        key: 'stu_type',
        width: 160,
        filters: filterStudentTypeChoice,
        onFilter: (value, record) => record.stu_type === ServerStudentTypeChoice[value],
        render: val => `${val}`,
      },
      {
        title: '学习形式',
        dataIndex: 'stu_learn_type',
        key: 'stu_learn_type',
        width: 120,
        filters: filterStudentCategoryChoice,
        onFilter: (value, record) => record.stu_learn_type === ServerStudentCategoryChoice[value],
        render: val => `${val}`,
      },
      {
        title: '学习阶段',
        dataIndex: 'stu_learn_status',
        key: 'stu_learn_status',
        width: 120,
        filters: filterDegreeChoice,
        onFilter: (value, record) => record.stu_learn_status === ServerDegreeChoice[value],
        render: val => `${val}`,
      },
      {
        title: '年级',
        dataIndex: 'stu_grade',
        key: 'stu_grade',
        width: 120,
        render: val => `${val}`,
      },
      {
        title: '学制',
        dataIndex: 'stu_system',
        key: 'stu_system',
        width: 120,
        render: val => `${val}`,
      },
      {
        title: '培养方式',
        dataIndex: 'stu_cultivating_mode',
        key: 'stu_cultivating_mode',
        width: 120,
        filters: filterCultivationModeChoice,
        onFilter: (value, record) =>
          record.stu_cultivating_mode === ServerCultivationModeChoice[value],
        render: val => `${val}`,
      },
      {
        title: '录取类型',
        dataIndex: 'stu_enrollment_category',
        key: 'stu_enrollment_category',
        width: 120,
        filters: filterEnrollmentCategory,
        onFilter: (value, record) =>
          record.stu_enrollment_category === ServerEnrollmentCategory[value],
        render: val => `${val}`,
      },
      {
        title: '国籍',
        dataIndex: 'stu_nationality',
        key: 'stu_nationality',
        width: 120,
        render: val => `${val}`,
      },
      {
        title: '专项计划',
        dataIndex: 'stu_special_program',
        key: 'stu_special_program',
        width: 400,
        filters: filterSpecialProgramChoice,
        onFilter: (value, record) =>
          record.stu_special_program === ServerSpecialProgramChoice[value],
        render: val => `${val}`,
      },
      {
        title: '固定收入',
        dataIndex: 'stu_is_regular_income',
        width: 100,
        render: value => <Badge status={value ? 'success' : 'error'} style={{ marginLeft: 5 }} />,
      },
      {
        title: '欠缴学费',
        dataIndex: 'stu_is_tuition_fees',
        width: 100,
        render: value => <Badge status={value ? 'success' : 'error'} style={{ marginLeft: 5 }} />,
      },
      {
        title: '档案在校',
        dataIndex: 'stu_is_archives',
        width: 100,
        render: value => <Badge status={value ? 'success' : 'error'} style={{ marginLeft: 5 }} />,
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
        render: val => (val ? `${val}` : '-'),
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
      <div className={styles.tableList}>
        {displaySearch ? (
          <div className={styles.tableListForm}>{this.renderSimpleForm(studentColumns)}</div>
        ) : null}
        <StandardTable
          displayAlert={displayAlert}
          displayRowsSelect={displayRowsSelect}
          columns={studentColumns}
          rowKey={record => record.stu_number}
          dataSource={results}
          selectedRows={selectedRows}
          scroll={{ x: 4580, y: 900 }}
          onSelectRow={this.handleSelectRows}
          onChange={this.handleStandardTableChange}
          total={count}
          pagination={paginationProps}
          loading={studentsLoading}
        />
      </div>
    );
  }
}

export default StudentTable;
