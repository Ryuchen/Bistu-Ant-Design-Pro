// 代码中会兼容本地 service mock 以及部署站点的静态数据
import mockjs from 'mockjs';
import { parse } from 'url';

// Mock definitions
const avatars = [
  'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
  'https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png',
  'https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png',
  'https://gw.alipayobjects.com/zos/rmsportal/ubnKSIfAJTxIgXOKlciN.png',
  'https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png',
  'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png',
  'https://gw.alipayobjects.com/zos/rmsportal/psOgztMplJMGpVEqfcgF.png',
  'https://gw.alipayobjects.com/zos/rmsportal/ZpBqSxLxVEXfcUNoPKrz.png',
  'https://gw.alipayobjects.com/zos/rmsportal/laiEnJdGHVOhJrUShBaJ.png',
  'https://gw.alipayobjects.com/zos/rmsportal/UrQsqscbKEpNuJcvBZBu.png',
];
const EthnicChoice = [
  '汉族',
  '壮族',
  '满族',
  '回族',
  '苗族',
  '维吾尔族',
  '土家族',
  '彝族',
  '蒙古族',
  '藏族',
  '布依族',
  '侗族',
  '瑶族',
  '朝鲜族',
  '白族',
  '哈尼族',
  '哈萨克族',
  '黎族',
  '傣族',
  '畲族',
  '傈僳族',
  '仡佬族',
  '东乡族',
  '高山族',
  '拉祜族',
  '水族',
  '佤族',
  '纳西族',
  '羌族',
  '土族',
  '仫佬族',
  '锡伯族',
  '柯尔克孜族',
  '达斡尔族',
  '景颇族',
  '毛南族',
  '撒拉族',
  '布朗族',
  '塔吉克族',
  '阿昌族',
  '普米族',
  '鄂温克族',
  '乌孜别克族',
  '门巴族',
  '鄂伦春族',
  '独龙族',
  '塔塔尔族',
  '赫哲族',
  '珞巴族',
];
const GenderChoice = ['男', '女'];
const PoliticalChoice = ['党员', '团员', '群众', '民主党派'];
const DegreeChoice = ['博士', '硕士', '本科'];
const StatusChoice = ['在校', '离校', '留校'];
const StudentGrade = ['1', '2', '3'];
const StudentType = ['硕士', '博士', '本硕连读', '硕博连读', '直博'];
const StudentCategory = ['全日制', '非全日制'];
const CultivatingMode = ['学硕', '专硕'];
const EnrollmentCategory = ['定向', '非定向'];
const StudentClass = ['快乐家族', '开心家族'];
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
const TeacherTitle = ['讲师', '副教授', '教授', '副研究员', '研究员', '助教'];
const majorDegree = [
  '哲学',
  '经济学',
  '法学',
  '教育学',
  '文学',
  '历史学',
  '理学',
  '工学',
  '农学',
  '医学',
  '军事学',
  '管理学',
  '艺术学',
];
const SchoolsName = [
  '北京科技大学天津学院',
  '天津大学仁爱学院',
  '天津财经大学珠江学院',
  '天津市职业大学',
  '天津滨海职业学院',
  '天津工程职业技术学院',
  '天津青年职业学院',
  '天津渤海职业技术学院',
  '天津电子信息职业技术学院',
  '天津机电职业技术学院',
  '天津现代职业技术学院',
  '天津公安警官职业学院',
  '天津轻工职业技术学院',
  '天津商务职业学院',
  '天津国土资源和房屋职业学院',
  '天津医学高等专科学校',
  '天津开发区职业技术学院',
  '天津艺术职业学院',
  '天津交通职业学院',
  '天津冶金职业技术学院',
  '天津石油职业技术学院',
  '天津城市职业学院',
  '天津铁道职业技术学院',
  '天津工艺美术职业学院',
  '天津城市建设管理职业技术学院',
  '天津生物工程职业技术学院',
  '天津海运职业学院',
  '天津广播影视职业学院',
];

// Mock basic User model
const adminUser = {
  id: mockjs.Random.guid(),
  username: 'admin',
  password: 'ant.design',
  first_name: mockjs.Random.cfirst(),
  last_name: mockjs.Random.clast(),
  email: mockjs.Random.email(),
  last_login: mockjs.Random.datetime(),
  is_superuser: true,
  is_staff: false,
};

// Mock AcademiesList
const academiesList = [
  '计算机学院',
  '机电学院',
  '光电学院',
  '自动化学院',
  '通信学院',
  '经济管理学院',
  '信息管理学院',
  '马克思主义学院',
  '公共管理与传媒学院',
  '外国语学院',
  '理学院',
  '国际交流学院',
];

// Mock MajorsList
const majorsList = {
  AcademyOfDegree: [
    '现代设计理论与方法学科方向',
    '汽车系统动力学与控制学科方向',
    '机器人技术学科方向',
    '智能制造学科方向',
    '机电系统测控与信息化学科方向',
    '精密仪器及机械学科方向',
    '测试计量技术及仪器学科方向',
    '光学工程学科方向',
    '控制科学与工程',
    '信息与通信工程',
    '信号与信息处理',
    '通信与信息系统',
    '智慧感知与信息处理',
  ],
  ProfessionalOfDegree: [
    '车辆工程领域',
    '机械工程领域',
    '仪器仪表工程领域',
    '控制工程',
    '电子与通信工程',
  ],
};

// Add Users to login account
const mockAccountsList = [];
mockAccountsList.push(adminUser);

const staffUsersNum = academiesList.length;
const teacherUsersNum = 60;
const studentUsersNum = 1000;

// Mock staffUserList, teacherUserList, studentUserList
const staffUsersList = [];
for (let i = 0; i < staffUsersNum; i += 1) {
  const staffUser = {
    id: `${mockjs.Random.guid()}-${i}`,
    username: `staff-${i}`,
    password: 'ant.design',
    first_name: mockjs.Random.cfirst(),
    last_name: mockjs.Random.clast(),
    email: mockjs.Random.email('bistu.edu.com'),
    last_login: mockjs.Random.datetime(),
    is_superuser: false,
    is_staff: true,
  };
  staffUsersList.push(staffUser);
  mockAccountsList.push(staffUser);
}
const teacherUsersList = [];
for (let i = 0; i < teacherUsersNum; i += 1) {
  const teacherUser = {
    id: `${mockjs.Random.guid()}-${i}`,
    username: `teacher-${i}`,
    password: 'ant.design',
    first_name: mockjs.Random.cfirst(),
    last_name: mockjs.Random.clast(),
    email: mockjs.Random.email('bistu.edu.com'),
    last_login: mockjs.Random.datetime(),
    is_superuser: false,
    is_staff: false,
  };
  teacherUsersList.push(teacherUser);
  mockAccountsList.push(teacherUser);
}
const studentUsersList = [];
for (let i = 0; i < studentUsersNum; i += 1) {
  const studentUser = {
    id: `${mockjs.Random.guid()}-${i}`,
    username: `student-${i}`,
    password: 'ant.design',
    first_name: mockjs.Random.cfirst(),
    last_name: mockjs.Random.clast(),
    email: mockjs.Random.email('bistu.edu.com'),
    last_login: mockjs.Random.datetime(),
    is_superuser: false,
    is_staff: false,
  };
  studentUsersList.push(studentUser);
}
console.log(`成功生成 mockAccountsList:${mockAccountsList.length}个账户`);

// Mock mockAcademies
const mockAcademiesList = [];
academiesList.forEach(item => {
  const mockMajors = [];

  for (let i = 0; i < mockjs.Random.integer(3, 5); i += 1) {
    const degree = mockjs.Random.pick(majorDegree);
    const researchesList = [];
    for (let j = 0; j < 5; j += 1) {
      researchesList.push(mockjs.Random.cword(7, 10));
    }
    mockMajors.push({
      uuid: mockjs.Random.id(),
      maj_name: mockjs.Random.pick(majorsList.AcademyOfDegree),
      maj_code: mockjs.Random.integer(10000, 99999),
      maj_type: '学科硕士学位',
      maj_first: mockjs.Random.boolean(),
      maj_second: mockjs.Random.boolean(),
      maj_setup_time: mockjs.Random.date(),
      maj_degree: degree,
      researches: researchesList,
    });
  }

  for (let i = 0; i < mockjs.Random.integer(1, 3); i += 1) {
    const degree = mockjs.Random.pick(majorDegree);
    const researchesList = [];
    for (let j = 0; j < 5; j += 1) {
      researchesList.push(mockjs.Random.cword(7, 10));
    }
    mockMajors.push({
      uuid: mockjs.Random.id(),
      maj_name: mockjs.Random.pick(majorsList.ProfessionalOfDegree),
      maj_code: mockjs.Random.integer(10000, 99999),
      maj_type: '专业硕士学位',
      maj_first: mockjs.Random.boolean(),
      maj_second: mockjs.Random.boolean(),
      maj_setup_time: mockjs.Random.date(),
      maj_degree: degree,
      researches: researchesList,
    });
  }

  mockAcademiesList.push({
    uuid: mockjs.Random.id(),
    aca_cname: item,
    aca_ename: item,
    aca_nickname: mockjs.Random.string(7, 16),
    aca_avatar: mockjs.Random.pick(avatars),
    aca_code: mockjs.Random.integer(100, 999),
    aca_phone: mockjs.Random.integer(18811324320, 19611324320),
    aca_fax: mockjs.Random.integer(81118111, 91119111),
    aca_href: mockjs.Random.url('http', 'bistu.edu.com'),
    aca_brief: mockjs.Random.cparagraph(),
    aca_user: staffUsersList.pop(),
    majors: mockMajors,
  });
});
console.log(`成功生成 mockAcademiesList:${mockAcademiesList.length}个学院`);

// Mock TeachersList
const mockTeachersList = [];
const teacherUsersListLength = teacherUsersList.length;
const mockEducationsList = [];
for (let i = 0; i < teacherUsersListLength; i += 1) {
  const mockAcademy = mockjs.Random.pick(mockAcademiesList);
  const mockMajor = mockjs.Random.pick(mockAcademy.majors);
  const mockResearch = mockjs.Random.pick(mockMajor.researches);
  mockEducationsList.push({
    uuid: mockjs.Random.id(),
    edu_begin_time: mockjs.Random.date(),
    edu_finish_time: mockjs.Random.date(),
    edu_school_name: mockjs.Random.pick(SchoolsName),
    edu_study_major: mockMajor,
    edu_study_field: mockResearch,
  });
}
for (let i = 0; i < teacherUsersListLength; i += 1) {
  const mockAcademy = mockjs.Random.pick(mockAcademiesList);
  const mockMajor = mockjs.Random.pick(mockAcademy.majors);
  const mockResearch = mockjs.Random.pick(mockMajor.researches);
  mockTeachersList.push({
    user: teacherUsersList.pop(),
    tut_avatar: mockjs.Random.pick(avatars),
    tut_number: mockjs.Random.integer(19970101000, 20190101999),
    tut_gender: mockjs.Random.pick(GenderChoice),
    tut_title: mockjs.Random.pick(TeacherTitle),
    tut_cardID: mockjs.Random.id(),
    tut_birth_day: mockjs.Random.date(),
    tut_entry_day: mockjs.Random.date(),
    tut_political: mockjs.Random.pick(PoliticalChoice),
    tut_telephone: mockjs.Random.integer(18811324320, 19611324320),
    tut_degree: mockjs.Random.pick(DegreeChoice),
    academy: mockAcademy,
    major: mockMajor,
    research: mockResearch,
    education: mockEducationsList.pop(),
  });
}
console.log(`成功生成 mockTeachersList:${mockTeachersList.length}个老师`);

// Mock StudentsList
const mockStudentsList = [];
const studentUsersListLength = studentUsersList.length;
for (let i = 0; i < studentUsersListLength; i += 1) {
  const mockAcademy = mockjs.Random.pick(mockAcademiesList);
  const mockMajor = mockjs.Random.pick(mockAcademy.majors);
  const mockResearch = mockjs.Random.pick(mockMajor.researches);
  mockStudentsList.push({
    user: studentUsersList.pop(),
    stu_avatar: mockjs.Random.pick(avatars),
    stu_number: mockjs.Random.integer(100000, 999999),
    stu_gender: mockjs.Random.pick(GenderChoice),
    stu_card_type: '身份证',
    stu_cardID: mockjs.Random.id(),
    stu_candidate_number: mockjs.Random.guid(),
    stu_birth_day: mockjs.Random.date(),
    stu_nation: mockjs.Random.pick(EthnicChoice),
    stu_source: mockjs.Random.province(),
    stu_is_village: mockjs.Random.boolean(),
    stu_political: mockjs.Random.pick(PoliticalChoice),
    stu_type: mockjs.Random.pick(StudentType),
    stu_learn_type: mockjs.Random.pick(StudentCategory),
    stu_learn_status: mockjs.Random.pick(DegreeChoice),
    stu_grade: mockjs.Random.pick(StudentGrade),
    stu_system: '3',
    stu_entrance_time: mockjs.Random.date(),
    stu_graduation_time: mockjs.Random.date(),
    stu_cultivating_mode: mockjs.Random.pick(CultivatingMode),
    stu_enrollment_category: mockjs.Random.pick(EnrollmentCategory),
    stu_nationality: '中国',
    stu_special_program: mockjs.Random.pick(SpecialProgram),
    stu_is_regular_income: mockjs.Random.boolean(),
    stu_is_tuition_fees: mockjs.Random.boolean(),
    stu_is_archives: mockjs.Random.boolean(),
    stu_telephone: '18811324320',
    stu_status: mockjs.Random.pick(StatusChoice),
    stu_is_superb: mockjs.Random.boolean(),
    stu_class: mockjs.Random.pick(StudentClass),
    academy: mockAcademy,
    tutor: mockjs.Random.pick(mockTeachersList),
    major: mockMajor,
    research: mockResearch,
  });
}
console.log(`成功生成 mockStudentsList:${mockStudentsList.length}个学生`);

function fakeLoginFunction(password, username) {
  let account;
  mockAccountsList.forEach(item => {
    if (item.username === username && item.password === password) {
      account = item;
    }
  });
  return account;
}

function fakeQueryAcademiesFunction(params) {
  if (params) {
    return mockAcademiesList;
  }
  return mockAcademiesList;
}

function fakeQueryAcademyFunction(uuid) {
  let academy = {};
  mockAcademiesList.forEach(function findAcademy(item) {
    if (item.uuid === uuid) {
      academy = item;
    }
  });
  return academy;
}

function fakeQueryStudentsFunction(params) {
  let queryDataSource = mockStudentsList;
  if (params.username) {
    const queryMockStudentsList = [];
    queryDataSource.forEach(item => {
      if (`${item.user.first_name}${item.user.last_name}` === String(params.username)) {
        queryMockStudentsList.push(item);
      }
    });
    queryDataSource = queryMockStudentsList;
  }
  if (params.tutor) {
    const queryMockStudentsList = [];
    queryDataSource.forEach(item => {
      if (item.tutor.user.id === params.tutor) {
        queryMockStudentsList.push(item);
      }
    });
    queryDataSource = queryMockStudentsList;
  }
  if (params.academy) {
    const queryMockStudentsList = [];
    queryDataSource.forEach(item => {
      if (item.academy.uuid === params.academy) {
        queryMockStudentsList.push(item);
      }
    });
    queryDataSource = queryMockStudentsList;
  }
  if (params.major) {
    const queryMockStudentsList = [];
    queryDataSource.forEach(item => {
      if (item.major.uuid === String(params.major)) {
        queryMockStudentsList.push(item);
      }
    });
    queryDataSource = queryMockStudentsList;
  }
  return queryDataSource;
}

function fakeQueryStudentFunction(id) {
  let student = {};
  mockStudentsList.forEach(item => {
    if (item.user.id === id) {
      student = item;
    }
  });
  return student;
}

function fakeQueryTeachersFunction(params) {
  let queryDataSource = mockTeachersList;
  if (params.username) {
    const queryMockStudentsList = [];
    queryDataSource.forEach(item => {
      if (`${item.user.first_name}${item.user.last_name}` === String(params.username)) {
        queryMockStudentsList.push(item);
      }
    });
    queryDataSource = queryMockStudentsList;
  }
  if (params.academy) {
    const queryMockStudentsList = [];
    queryDataSource.forEach(item => {
      if (item.academy.uuid === params.academy) {
        queryMockStudentsList.push(item);
      }
    });
    queryDataSource = queryMockStudentsList;
  }
  return queryDataSource;
}

function fakeQueryTeacherFunction(id) {
  let teacher = {};
  mockTeachersList.forEach(item => {
    if (item.user.id === id) {
      teacher = item;
    }
  });
  return teacher;
}

console.log(mockStudentsList.pop());

export default {
  'GET /api/accounts/auth_routes/': (req, res) => {
    res.send({
      data: {
        status: '200',
        code: '00000000',
      },
    });
  },

  'POST /api/accounts/login/': (req, res) => {
    const { password, username, type } = req.body;
    const account = fakeLoginFunction(password, username);
    if (account) {
      let Authority = 'teacher';
      if (account.is_superuser) {
        Authority = 'admin';
      } else if (account.is_staff) {
        Authority = 'staff';
      }
      res.send({
        data: {
          code: '00000000',
          status: '200',
          currentAuthority: Authority,
        },
        type,
      });
    } else {
      res.status(401);
      res.send({
        data: {
          status: '401',
          currentAuthority: 'guest',
        },
        meta: {
          message: 'Forbidden',
          details: 'Username or Password is incorrect.',
          retryable: true,
          code: '401',
        },
        type,
      });
    }
  },

  'GET /api/accounts/logout/': (_, res) => {
    res.send({
      data: {
        status: '200',
        code: '00000000',
      },
    });
  },

  'GET /api/accounts/current/': (_, res) => {
    res.send({
      data: {
        status: '200',
        code: '00000000',
        profile: {
          name: 'Serati Ma',
          avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
          userid: '00000001',
          email: 'antdesign@alipay.com',
          signature: '海纳百川，有容乃大',
          title: '交互专家',
          group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
          tags: [
            {
              key: '0',
              label: '很有想法的',
            },
            {
              key: '1',
              label: '专注设计',
            },
            {
              key: '2',
              label: '辣~',
            },
            {
              key: '3',
              label: '大长腿',
            },
            {
              key: '4',
              label: '川妹子',
            },
            {
              key: '5',
              label: '海纳百川',
            },
          ],
          notifyCount: 12,
          unreadCount: 11,
          country: 'China',
          geographic: {
            province: {
              label: '浙江省',
              key: '330000',
            },
            city: {
              label: '杭州市',
              key: '330100',
            },
          },
          address: '西湖区工专路 77 号',
          phone: '0752-268888888',
        },
      },
    });
  },

  'GET /api/colleges/academies/': (req, res) => {
    res.send({
      data: {
        status: '200',
        code: '00000000',
        academies: fakeQueryAcademiesFunction(req.body),
      },
    });
  },

  'GET /api/colleges/academy/:uuid': (req, res) => {
    const { uuid } = req.params;
    res.send({
      data: {
        status: '200',
        code: '00000000',
        academy: fakeQueryAcademyFunction(uuid),
      },
    });
  },

  'GET /api/students/students/': (req, res, u) => {
    let url = u;
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url; // eslint-disable-line
    }
    const params = parse(url, true).query;
    res.send({
      data: {
        status: '200',
        code: '00000000',
        students: fakeQueryStudentsFunction(params),
      },
    });
  },

  'GET /api/students/student/:id': (req, res) => {
    const { id } = req.params;
    res.send({
      data: {
        status: '200',
        code: '00000000',
        student: fakeQueryStudentFunction(id),
      },
    });
  },

  'GET /api/teachers/teachers/': (req, res, u) => {
    let url = u;
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url; // eslint-disable-line
    }
    const params = parse(url, true).query;
    res.send({
      data: {
        status: '200',
        code: '00000000',
        teachers: fakeQueryTeachersFunction(params),
      },
    });
  },

  'GET /api/teachers/teacher/:id': (req, res) => {
    const { id } = req.params;
    res.send({
      data: {
        status: '200',
        code: '00000000',
        teacher: fakeQueryTeacherFunction(id),
      },
    });
  },
};
