import React, { PureComponent } from 'react';
import ExportJsonExcel from 'js-export-excel';
import { connect } from 'dva';
import router from 'umi/router';
import { Row, Col, Card, Form, Input, Select, Button } from 'antd';

import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './TutorList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const GenderChoice = ['男', '女'];
const PoliticalChoice = ['党员', '团员', '群众', '民主党派'];
const TeacherTitle = ['讲师', '副教授', '教授', '副研究员', '研究员', '助教'];

@connect(({ colleges, teachers, loading }) => ({
  colleges,
  teachers,
  teachersLoading: loading.effects['teachers/fetchTeachers'],
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
  };

  teacherColumns = [
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
      dataIndex: 'user.id',
      key: 'user.id',
      fixed: 'left',
      width: 100,
      render: (val, record) => (
        <a onClick={() => this.previewItem(record.user.id)}>
          {record.user.first_name}
          {record.user.last_name}
        </a>
      ),
    },
    {
      title: '性别',
      dataIndex: 'tut_gender',
      width: 90,
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
      width: 160,
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
      width: 160,
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
      title: '所属学院',
      dataIndex: 'academy',
      width: 190,
      sorter: true,
      render: val => <a onClick={() => router.push(`/colleges/${val.uuid}`)}>{val.aca_cname}</a>,
    },
    {
      title: '研究方向',
      dataIndex: 'research',
      width: 190,
      sorter: true,
      render: val => `${val}`,
    },
    {
      title: '教师邮箱',
      dataIndex: 'user.email',
      width: 230,
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
      title: '最高学历',
      dataIndex: 'tut_degree',
      sorter: true,
      width: 120,
      render: val => `${val}`,
    },
    {
      title: '出生日期',
      dataIndex: 'tut_birth_day',
      sorter: true,
      render: val => `${val}`,
    },
    {
      title: '入职日期',
      dataIndex: 'tut_entry_day',
      sorter: true,
      render: val => `${val}`,
    },
    {
      title: '操作',
      fixed: 'right',
      width: 60,
      render: (val, record) => <a onClick={() => this.previewItem(record.user.id)}>详情</a>,
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'colleges/fetchAcademies',
    });

    dispatch({
      type: 'teachers/fetchTeachers',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
  };

  previewItem = id => {
    router.push(`/teachers/${id}`);
  };

  handleExportClick = () => {
    const { selectedRows } = this.state;
    const option = {};
    const exportData = [];
    const sheetFilters = [];
    const sheetHeaders = [];
    if (selectedRows) {
      selectedRows.forEach(row => {
        if (row) {
          const obj = {};
          this.teacherColumns.forEach(column => {
            if (column.dataIndex) {
              if (column.dataIndex === 'user.id') {
                obj[column.title] = row.user.first_name + row.user.last_name;
              } else if (column.dataIndex === 'academy') {
                obj[column.title] = row.academy.aca_cname;
              } else if (column.dataIndex === 'user.email') {
                obj[column.title] = row.user.email;
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
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'teachers/fetchTeachers',
      payload: {},
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
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

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      colleges: { academies },
    } = this.props;

    const { selectedRows } = this.state;

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
      teachers: { teachers },
      teachersLoading,
    } = this.props;

    const { selectedRows } = this.state;

    return (
      <PageHeaderWrapper title="教师列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <StandardTable
              columns={this.teacherColumns}
              rowKey={record => record.user.id}
              dataSource={teachers}
              selectedRows={selectedRows}
              scroll={{ x: 2000, y: 900 }}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              total={teachers.length}
              pagination={{ defaultPageSize: 20 }}
              loading={teachersLoading}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
