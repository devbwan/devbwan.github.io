/**
 * Firestore 사용자 동기화 서비스
 * 
 * 로그인 시 사용자 정보를 Firestore에 자동으로 동기화합니다.
 * - 사용자 문서가 없으면 생성
 * - 사용자 문서가 있으면 업데이트 (최신 정보로)
 */

import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

const USERS_COLLECTION = 'users';

/**
 * 사용자 정보를 Firestore에 동기화
 * 
 * @param {Object} user - 사용자 정보
 *   - id: 사용자 UID (필수)
 *   - email: 이메일
 *   - name: 이름
 *   - photoURL: 프로필 사진 URL
 * @returns {Promise<Object>} 동기화 결과
 */
export const syncUserToFirestore = async (user) => {
  if (!db) {
    console.warn('[UserSync] Firestore가 초기화되지 않았습니다.');
    return { success: false, reason: 'firestore_not_initialized' };
  }

  if (!user || !user.id) {
    console.warn('[UserSync] 사용자 정보가 없습니다.');
    return { success: false, reason: 'no_user_data' };
  }

  try {
    const userRef = doc(db, USERS_COLLECTION, user.id);
    
    // 기존 사용자 문서 확인
    const userDoc = await getDoc(userRef);
    
    const userData = {
      email: user.email || null,
      name: user.name || null,
      photoURL: user.photoURL || null,
      updatedAt: serverTimestamp(),
    };

    if (userDoc.exists()) {
      // 기존 사용자 문서 업데이트
      await setDoc(userRef, userData, { merge: true });
      
      if (__DEV__) {
        console.log('[UserSync] ✅ 사용자 정보 업데이트 완료:', user.id);
      }
      
      return { 
        success: true, 
        action: 'updated',
        userId: user.id 
      };
    } else {
      // 새 사용자 문서 생성
      await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
      });
      
      if (__DEV__) {
        console.log('[UserSync] ✅ 새 사용자 문서 생성 완료:', user.id);
      }
      
      return { 
        success: true, 
        action: 'created',
        userId: user.id 
      };
    }
  } catch (error) {
    console.error('[UserSync] ❌ 사용자 동기화 오류:', error);
    return { 
      success: false, 
      reason: 'sync_error',
      error: error.message 
    };
  }
};

/**
 * Firestore에서 사용자 정보 가져오기
 * 
 * @param {string} userId - 사용자 UID
 * @returns {Promise<Object|null>} 사용자 정보 또는 null
 */
export const getUserFromFirestore = async (userId) => {
  if (!db || !userId) {
    return null;
  }

  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return {
        id: userDoc.id,
        ...userDoc.data(),
      };
    }
    
    return null;
  } catch (error) {
    console.error('[UserSync] 사용자 정보 가져오기 오류:', error);
    return null;
  }
};

