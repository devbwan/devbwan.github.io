/**
 * API Layer
 * Firebase 및 REST API 통신 통합 export
 */

// Firebase config
export { db, auth, app, isValidFirebaseConfig, firebaseConfig } from '../config/firebase';

// Services
export { syncRunningSession } from '../services/sessionSyncService';
export { getCourses, getCourseById, getAllCourses, getTop3Courses, createCourse } from '../services/courseService';
export { openStreetMapService, getRunningRoutesFromOSM, getPopularRoutesFromOSM } from '../services/openStreetMapService';

