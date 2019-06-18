import React, { PureComponent } from 'react';
import moment from 'moment';
import ExportJsonExcel from 'js-export-excel';
import { connect } from 'dva';
import router from 'umi/router';
import { Row, Col, Form, Input, Select, Button, Upload, notification } from 'antd';

import StandardTable from '@/components/StandardTable';

import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ global, colleges, teachers, loading }) => ({
  global,
  colleges,
  teachers,
  teachersLoading: loading.effects['teachers/fetchTeachers'],
}))
@Form.create()
class TeacherTable extends PureComponent {
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
      type: 'teachers/fetchTeachers',
      payload: formValues,
    });

    if (displaySearch) {
      dispatch({
        type: 'colleges/fetchAcademies',
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
      type: 'teachers/fetchTeachers',
      payload: params,
    });
  };

  previewItem = id => {
    router.push(`/teachers/${id}`);
  };

  handleExportClick = teacherColumns => {
    const { selectedRows } = this.state;
    const option = {};
    const exportData = [];
    const sheetFilters = [];
    const sheetHeaders = [];
    if (selectedRows) {
      selectedRows.forEach(row => {
        if (row) {
          const obj = {};
          teacherColumns.forEach(column => {
            if (column.dataIndex) {
              if (column.dataIndex === 'user.id') {
                obj[column.title] = row.user.first_name + row.user.last_name;
              } else if (column.dataIndex === 'academy') {
                obj[column.title] = row.academy.aca_cname;
              } else if (column.dataIndex === 'user.email') {
                obj[column.title] = row.user.email;
              } else if (column.dataIndex === 'education.edu_school_name') {
                obj[column.title] = row.education.edu_school_name;
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
    option.fileName = '教师信息';
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
      type: 'teachers/fetchTeachers',
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
        type: 'teachers/fetchTeachers',
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

  renderSimpleForm = teacherColumns => {
    const {
      form: { getFieldDecorator },
      colleges: { academies = [] },
      dispatch,
    } = this.props;

    const { selectedRows, formValues } = this.state;

    const props = {
      name: 'file',
      action: '/api/teachers/teachers/',
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
            type: 'teachers/fetchTeachers',
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
          <Col md={5}>
            <FormItem label="教师姓名">
              {getFieldDecorator('username')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6}>
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
          <Col md={4}>
            <FormItem label="手机号">
              {getFieldDecorator('phone')(<Input placeholder="请输入" />)}
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
                  onClick={e => this.handleExportClick(teacherColumns, e)}
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
    const {
      global: { definitions },
      teachers: { teachers },
      teachersLoading,
      displayAlert,
      displaySearch,
      displayRowsSelect,
    } = this.props;

    const {
      gender_choice: ServerGenderChoice = {},
      political_choice: ServerPoliticalChoice = {},
      title_choice: ServerTitleChoice = {},
    } = definitions;

    const filterGenderChoice = Object.entries(ServerGenderChoice).map(([itemKey, itemValue]) => {
      return { text: itemValue, value: itemKey };
    });

    const filterPoliticalChoice = Object.entries(ServerPoliticalChoice).map(
      ([itemKey, itemValue]) => {
        return { text: itemValue, value: itemKey };
      }
    );

    const filterTitleChoice = Object.entries(ServerTitleChoice).map(([itemKey, itemValue]) => {
      return { text: itemValue, value: itemKey };
    });

    const teacherColumns = [
      {
        title: '教师编号',
        dataIndex: 'tut_number',
        fixed: 'left',
        width: 190,
        sorter: true,
        render: val => `${val}`,
      },
      {
        title: '教师姓名',
        dataIndex: 'tut_name',
        key: 'user.id',
        fixed: 'left',
        width: 100,
        render: (val, record) => <a onClick={() => this.previewItem(record.uuid)}>{val}</a>,
      },
      {
        title: '性别',
        dataIndex: 'tut_gender',
        width: 90,
        filters: filterGenderChoice,
        onFilter: (value, record) => record.tut_gender === ServerGenderChoice[value],
        render: val => `${val}`,
      },
      {
        title: '职称',
        dataIndex: 'tut_title',
        width: 120,
        filters: filterTitleChoice,
        onFilter: (value, record) => record.tut_title === ServerTitleChoice[value],
        render: val => `${val}`,
      },
      {
        title: '政治面貌',
        dataIndex: 'tut_political',
        width: 120,
        filters: filterPoliticalChoice,
        onFilter: (value, record) => record.tut_political === ServerPoliticalChoice[value],
        render: val => `${val}`,
      },
      {
        title: '所属学院',
        dataIndex: 'tut_academy',
        width: 190,
        render: val => <a onClick={() => router.push(`/colleges/${val.uuid}`)}>{val.aca_cname}</a>,
      },
      {
        title: '教师邮箱',
        dataIndex: 'tut_user.email',
        width: 230,
        render: val => `${val}`,
      },
      {
        title: '教师电话',
        dataIndex: 'tut_telephone',
        width: 170,
        render: val => `${val}`,
      },
      {
        title: '最高学历',
        dataIndex: 'tut_degree',
        width: 120,
        render: val => `${val}`,
      },
      {
        title: '毕业院校',
        width: 220,
        dataIndex: 'tut_education.edu_school_name',
        render: val => `${val}`,
      },
      {
        title: '出生日期',
        dataIndex: 'tut_birth_day',
        width: 160,
        sorter: (a, b) =>
          moment(a.tut_birth_day, 'YYYY-MM-DD').toDate() -
          moment(b.tut_birth_day, 'YYYY-MM-DD').toDate(),
        render: val => `${val}`,
      },
      {
        title: '入职日期',
        dataIndex: 'tut_entry_day',
        width: 160,
        sorter: (a, b) =>
          moment(a.tut_entry_day, 'YYYY-MM-DD').toDate() -
          moment(b.tut_entry_day, 'YYYY-MM-DD').toDate(),
        render: val => `${val}`,
      },
      {
        title: '操作',
        fixed: 'right',
        width: 60,
        render: (val, record) => <a onClick={() => this.previewItem(record.uuid)}>详情</a>,
      },
    ];

    const { selectedRows } = this.state;

    const { results = [], count } = teachers;

    const paginationProps = {
      pageSize: 20,
      total: count,
      showSizeChanger: false,
    };

    return (
      <div className={styles.tableList}>
        {displaySearch ? (
          <div className={styles.tableListForm}>{this.renderSimpleForm(teacherColumns)}</div>
        ) : null}
        <StandardTable
          displayAlert={displayAlert}
          displayRowsSelect={displayRowsSelect}
          columns={teacherColumns}
          rowKey={record => record.stu_number}
          dataSource={results}
          selectedRows={selectedRows}
          scroll={{ x: 1920, y: 900 }}
          onSelectRow={this.handleSelectRows}
          onChange={this.handleStandardTableChange}
          total={count}
          pagination={paginationProps}
          loading={teachersLoading}
        />
      </div>
    );
  }
}

export default TeacherTable;
