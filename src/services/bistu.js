import { stringify } from 'qs';
import request from '@/utils/request';

// This section is the api interface and fake api interface
// TODO: this function is connect to django

export async function AccountLogin(params) {
  return request('/api/accounts/login/', {
    requestType: 'form',
    method: 'POST',
    data: params,
  });
}

export async function AccountLogout() {
  return request('/api/accounts/logout/', {
    method: 'GET',
  });
}

export async function CurrentUser() {
  return request(`/api/accounts/current/`, {
    method: 'GET',
  });
}

export async function queryAcademies() {
  return request('/api/colleges/academies/', {
    method: 'GET',
  });
}

export async function queryAcademyProfile(uuid) {
  return request(`/api/colleges/academy/${uuid}`, {
    method: 'GET',
  });
}

export async function queryMajors() {
  return request('/api/colleges/majors/', {
    method: 'GET',
  });
}

export async function queryMajorProfile(uuid) {
  return request(`/api/colleges/major/${uuid}`, {
    method: 'GET',
  });
}

export async function queryStudents(params) {
  if (params) {
    return request(`/api/students/students?${stringify(params)}`, {
      method: 'GET',
    });
  }
  return request(`/api/students/students/`, {
    method: 'GET',
  });
}

export async function queryStudentProfile(uuid) {
  return request(`/api/students/student/${uuid}`, {
    method: 'GET',
  });
}

export async function queryTeachers(params) {
  if (params) {
    return request(`/api/teachers/teachers?${stringify(params)}`, {
      method: 'GET',
    });
  }
  return request(`/api/teachers/teachers/`, {
    method: 'GET',
  });
}

export async function queryTeacherProfile(uuid) {
  return request(`/api/teachers/teacher/${uuid}`, {
    method: 'GET',
  });
}
