import axios from 'axios';

const api = axios.create({
  baseURL: '',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

export const getSliders = () => api.get('/api-slider');
export const getAbout = () => api.get('/api-about');
export const getTools = () => api.get('/api-tool');
export const getVideoCategories = () => api.get('/api-video-category');
export const getVideoPlaylist = () => api.get('/api-video-play-list');
export const getContacts = () => api.get('/api-data-contact');
export const getCourses = () => api.get('/api-course');
export const getCourseDetail = (slug) => api.get(`/api-course-detail/${slug}`);
