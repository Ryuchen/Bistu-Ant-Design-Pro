export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        path: '/user',
        redirect: '/user/login',
      },
      {
        path: '/user/login',
        name: 'login',
        component: './User/Login',
      },
      {
        component: '404',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['superuser', 'staff', 'teacher'],
    routes: [
      // dashboard
      {
        path: '/',
        name: 'workplace',
        component: './Dashboard/Workplace',
        authority: ['superuser', 'staff', 'teacher'],
        hideInMenu: true,
      },
      // 学院的详细信息
      {
        path: '/colleges/:uuid',
        name: 'academyProfile',
        component: './Profile/AcademyProfile',
        authority: ['superuser', 'staff', 'teacher'],
        hideInMenu: true,
      },
      // 研究生招生信息
      {
        path: '/enroll',
        name: 'enrollStudent',
        component: './Enroll/EnrollStudent',
        authority: ['superuser', 'staff'],
      },
      // list
      {
        path: '/studentList',
        name: 'studentTable',
        authority: ['superuser', 'staff', 'teacher'],
        component: './List/StudentList',
      },
      // 学生的详细信息
      {
        path: '/students/:id',
        name: 'studentsProfile',
        authority: ['superuser', 'staff', 'teacher'],
        component: './Profile/StudentProfile',
        hideInMenu: true,
      },
      {
        path: '/tutorList',
        name: 'tutorTable',
        authority: ['superuser', 'staff', 'teacher'],
        component: './List/TutorList',
      },
      {
        path: '/teachers/:id',
        name: 'teachersProfile',
        authority: ['superuser', 'staff', 'teacher'],
        component: './Profile/TeacherProfile',
        hideInMenu: true,
      },
      {
        name: 'settings',
        path: '/account/',
        component: './Account/Settings/Info',
        authority: ['superuser', 'staff', 'teacher'],
        routes: [
          {
            path: '/account/',
            redirect: '/account/base',
          },
          {
            path: '/account/base',
            component: './Account/Settings/BaseView',
          },
          {
            path: '/account/security',
            component: './Account/Settings/SecurityView',
          },
          {
            path: '/account/binding',
            component: './Account/Settings/BindingView',
          },
          {
            path: '/account/notification',
            component: './Account/Settings/NotificationView',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
