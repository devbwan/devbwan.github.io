import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, ActivityIndicator, Alert, TextInput, TouchableOpacity, Platform, BackHandler, ImageBackground } from 'react-native';
import { Searchbar, Chip, Dialog, Portal, RadioButton, Divider } from 'react-native-paper';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { getAllCourses, getTop3Courses, createCourse, getRunningRoutesFromOSM, getPopularRoutesFromOSM } from '../../src/api';
import { useAuthStore } from '../../src/features/auth';
import { PageContainer, Card, Button, GradientView, Spacer, SectionTitle } from '../../src/components/ui';
import { spacing, typography, colors } from '../../src/theme';
import { parseGPXSimple, parseGPXFromURL } from '../../src/utils/gpxParser';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function CoursesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'nearby', 'popular', 'difficulty'
  const [courses, setCourses] = useState([]);
  const [top3Courses, setTop3Courses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogVisible, setUploadDialogVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseDifficulty, setCourseDifficulty] = useState('medium');
  const [courseVisibility, setCourseVisibility] = useState('public');
  const [uploadRoute, setUploadRoute] = useState(null);
  const [uploadDistance, setUploadDistance] = useState(0);
  const [importDialogVisible, setImportDialogVisible] = useState(false);
  const [importingOSM, setImportingOSM] = useState(false);
  const [importingGPX, setImportingGPX] = useState(false);
  const [gpxUrl, setGpxUrl] = useState('');
  const [gpxFileContent, setGpxFileContent] = useState('');

  // 다이얼로그 상태 디버깅
  useEffect(() => {
    console.log('[Courses] importDialogVisible 상태 변경:', importDialogVisible);
  }, [importDialogVisible]);

  // 뒤로가기 버튼 처리 - 팝업이 열려있을 때만 팝업 닫기
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // 업로드 다이얼로그가 열려있으면 닫기
      if (uploadDialogVisible && !uploading) {
        setUploadDialogVisible(false);
        return true; // 이벤트 소비
      }
      // 가져오기 다이얼로그가 열려있으면 닫기
      if (importDialogVisible && !importingOSM && !importingGPX) {
        setImportDialogVisible(false);
        setGpxUrl('');
        setGpxFileContent('');
        return true; // 이벤트 소비
      }
      // 팝업이 없으면 기본 동작 (페이지 이동 허용)
      return false;
    });

    return () => backHandler.remove();
  }, [uploadDialogVisible, importDialogVisible, uploading, importingOSM, importingGPX]);

  // 러닝 종료 후 코스 업로드 파라미터 처리
  useEffect(() => {
    if (params?.uploadRoute) {
      try {
        const route = JSON.parse(params.uploadRoute);
        const distance = parseFloat(params.uploadDistance || '0');
        if (route && route.length > 0) {
          setUploadRoute(route);
          setUploadDistance(distance);
          setUploadDialogVisible(true);
          // 거리 기반 기본 이름 설정
          const distanceKm = (distance / 1000).toFixed(2);
          setCourseName(`내 러닝 코스 ${distanceKm}km`);
          setCourseDescription(`러닝 기록에서 생성된 코스입니다.`);
        }
      } catch (error) {
        console.error('코스 업로드 파라미터 파싱 오류:', error);
      }
    }
  }, [params?.uploadRoute]);

  useFocusEffect(
    React.useCallback(() => {
      loadCourses();
    }, [filter])
  );

  const loadCourses = async () => {
    setLoading(true);
    try {
      const [allCourses, top3] = await Promise.all([
        getAllCourses({ filter, searchQuery }),
        getTop3Courses(),
      ]);
      setCourses(allCourses);
      setTop3Courses(top3);
    } catch (error) {
      console.error('코스 로드 오류:', error);
      // Firebase가 설정되지 않은 경우 임시 데이터 사용
      setCourses(getMockCourses());
      setTop3Courses(getMockCourses().slice(0, 3));
    } finally {
      setLoading(false);
    }
  };

  // Firebase가 설정되지 않은 경우 임시 데이터
  const getMockCourses = () => [
    {
      id: '1',
      name: '한강 러닝 코스',
      description: '여의도에서 잠실까지 약 10km 코스',
      distance: 10000,
      difficulty: 'easy',
      runnerCount: 1250,
      rating: 4.5,
    },
    {
      id: '2',
      name: '북한산 트레일',
      description: '도심 속 자연을 느낄 수 있는 코스',
      distance: 5000,
      difficulty: 'hard',
      runnerCount: 850,
      rating: 4.8,
    },
    {
      id: '3',
      name: '올림픽공원 루프',
      description: '편안하게 즐길 수 있는 5km 루프 코스',
      distance: 5000,
      difficulty: 'easy',
      runnerCount: 2100,
      rating: 4.7,
    },
  ];

  const formatDistance = (meters) => {
    if (meters < 1000) return `${Math.round(meters)}m`;
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return '#4CAF50';
      case 'medium':
        return '#FF9800';
      case 'hard':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return '초급';
      case 'medium':
        return '중급';
      case 'hard':
        return '고급';
      default:
        return '중급';
    }
  };

  const getCourseGradientColors = (courseId) => {
    const gradients = [
      ['#667eea', '#764ba2'], // Purple
      ['#f093fb', '#f5576c'], // Pink
      ['#4facfe', '#00f2fe'], // Blue
      ['#43e97b', '#38f9d7'], // Green
    ];
    const index = parseInt(courseId || '0', 10) % gradients.length;
    return gradients[index];
  };

  // OpenStreetMap에서 코스 가져오기
  const handleImportFromOSM = async () => {
    setImportingOSM(true);
    try {
      console.log('[Courses] OpenStreetMap에서 코스 가져오기 시작');
      
      // Location 모듈 동적 import (Android 호환성)
      const LocationModule = await import('expo-location');
      const Location = LocationModule.default || LocationModule;
      
      // 현재 위치 가져오기
      console.log('[Courses] 위치 권한 요청 중...');
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('권한 필요', '위치 정보 접근 권한이 필요합니다.');
        setImportingOSM(false);
        return;
      }

      console.log('[Courses] 현재 위치 가져오는 중...');
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude } = location.coords;
      console.log('[Courses] 현재 위치:', latitude, longitude);

      // OpenStreetMap에서 경로 가져오기
      console.log('[Courses] OpenStreetMap API 호출 중...');
      const routes = await getPopularRoutesFromOSM(latitude, longitude, 5);
      console.log('[Courses] 찾은 경로 수:', routes.length);

      if (routes.length === 0) {
        Alert.alert(
          '알림', 
          '주변에 러닝 경로를 찾을 수 없습니다.\n\n다른 방법을 시도해보세요:\n- GPX 파일 가져오기\n- 수동으로 코스 업로드'
        );
        setImportingOSM(false);
        return;
      }

      // 첫 번째 경로를 코스로 업로드
      const route = routes[0];
      console.log('[Courses] 선택한 경로:', route.name, route.distance, 'm');
      
      if (!user) {
        Alert.alert('오류', '코스를 저장하려면 로그인이 필요합니다.');
        setImportingOSM(false);
        return;
      }

      const courseData = {
        userId: user.id,
        name: route.name,
        description: route.description,
        coordinates: route.coordinates,
        distance: route.distance,
        difficulty: route.difficulty,
        visibility: 'public',
        runnerCount: 0,
        rating: 0,
        reviewCount: 0,
      };

      console.log('[Courses] Firestore에 코스 저장 중...');
      try {
        await createCourse(courseData);
        console.log('[Courses] 코스 저장 완료');
        
        Alert.alert(
          '가져오기 완료',
          `${route.name} 코스(${(route.distance / 1000).toFixed(2)}km)를 성공적으로 가져왔습니다!`,
          [
            {
              text: '확인',
              onPress: () => {
                setImportDialogVisible(false);
                loadCourses();
              },
            },
          ]
        );
      } catch (createError) {
        console.error('[Courses] 코스 저장 오류:', createError);
        Alert.alert(
          '저장 실패',
          `코스를 가져왔지만 저장에 실패했습니다.\n\n오류: ${createError.message || '알 수 없는 오류'}\n\nFirestore가 설정되지 않았을 수 있습니다.`
        );
      }
    } catch (error) {
      console.error('[Courses] OSM 가져오기 오류:', error);
      Alert.alert(
        '오류', 
        `코스를 가져오는 중 오류가 발생했습니다.\n\n${error.message || '알 수 없는 오류'}\n\n다른 방법을 시도해보세요:\n- GPX 파일 가져오기\n- 수동으로 코스 업로드`
      );
    } finally {
      setImportingOSM(false);
    }
  };

  // GPX 파일에서 코스 가져오기
  const handleImportFromGPX = async () => {
    if (!gpxUrl.trim() && !gpxFileContent.trim()) {
      Alert.alert('오류', 'GPX URL 또는 파일 내용을 입력해주세요.');
      return;
    }

    setImportingGPX(true);
    try {
      console.log('[Courses] GPX 파일 가져오기 시작');
      let courseData;

      if (gpxUrl.trim()) {
        console.log('[Courses] GPX URL에서 가져오기:', gpxUrl);
        // URL에서 GPX 파일 가져오기
        courseData = await parseGPXFromURL(gpxUrl);
      } else if (gpxFileContent.trim()) {
        console.log('[Courses] GPX 파일 내용 파싱 중...');
        // 파일 내용 파싱
        courseData = parseGPXSimple(gpxFileContent);
      }

      console.log('[Courses] GPX 파싱 완료:', courseData.name, courseData.distance, 'm');

      if (!user) {
        Alert.alert('오류', '코스를 저장하려면 로그인이 필요합니다.');
        setImportingGPX(false);
        return;
      }

      const finalCourseData = {
        userId: user.id,
        ...courseData,
        visibility: 'public',
      };

      console.log('[Courses] Firestore에 코스 저장 중...');
      try {
        await createCourse(finalCourseData);
        console.log('[Courses] 코스 저장 완료');
        
        Alert.alert(
          '가져오기 완료',
          `${courseData.name} 코스(${(courseData.distance / 1000).toFixed(2)}km)를 성공적으로 가져왔습니다!`,
          [
            {
              text: '확인',
              onPress: () => {
                setImportDialogVisible(false);
                setGpxUrl('');
                setGpxFileContent('');
                loadCourses();
              },
            },
          ]
        );
      } catch (createError) {
        console.error('[Courses] 코스 저장 오류:', createError);
        Alert.alert(
          '저장 실패',
          `GPX 파일을 파싱했지만 저장에 실패했습니다.\n\n오류: ${createError.message || '알 수 없는 오류'}\n\nFirestore가 설정되지 않았을 수 있습니다.`
        );
      }
    } catch (error) {
      console.error('[Courses] GPX 가져오기 오류:', error);
      Alert.alert(
        '오류', 
        `GPX 파일을 파싱하는 중 오류가 발생했습니다.\n\n${error.message || '알 수 없는 오류'}\n\nGPX 파일 형식이 올바른지 확인해주세요.`
      );
    } finally {
      setImportingGPX(false);
    }
  };

  const handleUploadCourse = async () => {
    if (!courseName.trim()) {
      Alert.alert('오류', '코스 이름을 입력해주세요.');
      return;
    }

    if (!user) {
      Alert.alert('오류', '로그인이 필요합니다.');
      return;
    }

    setUploading(true);
    try {
      // 저장된 업로드 경로 사용
      const route = uploadRoute || [];
      const distance = uploadDistance || 0;

      if (route.length === 0) {
        Alert.alert('오류', '업로드할 경로가 없습니다. 먼저 러닝을 완료해주세요.');
        setUploading(false);
        return;
      }

      // 좌표 배열로 변환
      const coordinates = route.map((point) => ({
        lat: point.lat,
        lng: point.lng,
      }));

      // 코스 데이터 생성
      const courseData = {
        userId: user.id,
        name: courseName.trim(),
        description: courseDescription.trim() || '',
        coordinates,
        distance,
        difficulty: courseDifficulty,
        visibility: courseVisibility,
        runnerCount: 0,
        rating: 0,
        reviewCount: 0,
      };

      // Firestore에 코스 저장
      const courseId = await createCourse(courseData);
      
      Alert.alert(
        '업로드 완료',
        '코스가 성공적으로 업로드되었습니다!',
        [
          {
            text: '확인',
            onPress: () => {
              setUploadDialogVisible(false);
              setCourseName('');
              setCourseDescription('');
              setCourseDifficulty('medium');
              setCourseVisibility('public');
              setUploadRoute(null);
              setUploadDistance(0);
              loadCourses();
            },
          },
        ]
      );
    } catch (error) {
      console.error('코스 업로드 오류:', error);
      Alert.alert(
        '업로드 실패',
        error.message || '코스 업로드 중 오류가 발생했습니다. 다시 시도해주세요.'
      );
    } finally {
      setUploading(false);
    }
  };

  const renderCourse = ({ item }) => (
    <Card style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.courseName}>{item.name}</Text>
        <Chip
          style={[styles.difficultyChip, { backgroundColor: getDifficultyColor(item.difficulty) }]}
          textStyle={styles.chipText}
        >
          {getDifficultyText(item.difficulty)}
        </Chip>
      </View>
      <Text style={styles.courseDescription}>{item.description}</Text>
      <View style={styles.courseStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>거리</Text>
          <Text style={styles.statValue}>{formatDistance(item.distance)}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>러너 수</Text>
          <Text style={styles.statValue}>{item.runnerCount.toLocaleString()}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>평점</Text>
          <Text style={styles.statValue}>★ {item.rating}</Text>
        </View>
      </View>
      <View style={styles.cardActions}>
        <Button 
          variant="outline"
          size="medium"
          onPress={() => {
            router.push(`/course/${item.id}`);
          }}
          style={styles.actionButton}
        >
          상세보기
        </Button>
        <Button 
          variant="primary"
          size="medium"
          onPress={() => {
            router.push({
              pathname: '/(tabs)/run',
              params: { courseId: item.id },
            });
          }}
          style={styles.actionButton}
        >
          코스로 시작
        </Button>
      </View>
    </Card>
  );

  return (
    <PageContainer scrollable>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>러닝 코스</Text>
        <TouchableOpacity
          onPress={() => {
            if (!user) {
              Alert.alert('로그인 필요', '코스를 가져오려면 로그인이 필요합니다.');
              return;
            }
            setImportDialogVisible(true);
          }}
          style={styles.navigationButton}
        >
          <GradientView colors={colors.gradientPrimary} style={styles.navigationButtonGradient}>
            <MaterialCommunityIcons name="navigation" size={20} color={colors.textStrong} />
          </GradientView>
        </TouchableOpacity>
      </View>

      <Spacer height={spacing.xl} />

      {/* Map Preview */}
      <View style={styles.mapPreviewContainer}>
        <GradientView 
          colors={['#667eea', '#764ba2']} 
          start={[0, 0]} 
          end={[1, 1]} 
          style={styles.mapPreview}
        >
          <View style={styles.mapPreviewContent}>
            <MaterialCommunityIcons name="map" size={48} color={colors.textStrong} />
            <Text style={styles.mapPreviewText}>지도 보기</Text>
          </View>
          <View style={styles.mapPreviewBadge}>
            <MaterialCommunityIcons name="map-marker" size={16} color={colors.primary} />
            <Text style={styles.mapPreviewBadgeText}>서울, 한국</Text>
          </View>
        </GradientView>
      </View>

      <Spacer height={spacing.xl} />

      {/* Popular Courses */}
      <View style={styles.sectionHeader}>
        <SectionTitle style={styles.sectionTitleText}>인기 코스</SectionTitle>
        <MaterialCommunityIcons name="trending-up" size={20} color={colors.primary} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>코스를 불러오는 중...</Text>
        </View>
      ) : (
        <>
          <View style={styles.coursesList}>
            {courses.length > 0 ? (
              courses.slice(0, 4).map((course) => (
                <Card key={course.id} style={styles.courseCard}>
                  {/* Course Image */}
                  <GradientView 
                    colors={getCourseGradientColors(course.id)} 
                    start={[0, 0]} 
                    end={[1, 0]} 
                    style={styles.courseImage}
                  >
                    <View style={styles.courseImageBadge}>
                      <Text style={styles.courseImageBadgeText}>
                        {getDifficultyText(course.difficulty)}
                      </Text>
                    </View>
                  </GradientView>

                  {/* Course Info */}
                  <View style={styles.courseInfo}>
                    <View style={styles.courseInfoHeader}>
                      <View style={styles.courseInfoLeft}>
                        <Text style={styles.courseName}>{course.name}</Text>
                        <Text style={styles.courseDistance}>{formatDistance(course.distance)}</Text>
                      </View>
                      <View style={styles.courseRating}>
                        <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
                        <Text style={styles.courseRatingText}>{course.rating || 4.8}</Text>
                      </View>
                    </View>
                    <View style={styles.courseInfoFooter}>
                      <Text style={styles.courseReviews}>{course.reviewCount || 0}개 리뷰</Text>
                      <TouchableOpacity
                        onPress={() => {
                          router.push({
                            pathname: '/(tabs)/run',
                            params: { courseId: course.id },
                          });
                        }}
                        style={styles.startButton}
                      >
                        <Text style={styles.startButtonText}>시작하기</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Card>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>코스가 없습니다.</Text>
              </View>
            )}
          </View>

          <Spacer height={spacing.xl} />

          {/* Nearby Routes */}
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="map-marker" size={20} color={colors.textStrong} />
            <SectionTitle style={styles.sectionTitleText}>내 주변 코스</SectionTitle>
          </View>

          <Card style={styles.nearbyRoutesCard}>
            {top3Courses.length > 0 ? (
              top3Courses.slice(0, 3).map((route, index) => (
                <View key={route.id || index} style={styles.nearbyRouteItem}>
                  <GradientView colors={colors.gradientPrimary} style={styles.nearbyRouteIcon}>
                    <MaterialCommunityIcons name="map-marker" size={20} color={colors.textStrong} />
                  </GradientView>
                  <View style={styles.nearbyRouteInfo}>
                    <Text style={styles.nearbyRouteName}>{route.name}</Text>
                    <Text style={styles.nearbyRouteDetails}>
                      {formatDistance(route.distance)} · 약 {Math.round(route.distance / 1000 * 6)}분
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => router.push(`/course/${route.id}`)}
                    style={styles.viewButton}
                  >
                    <Text style={styles.viewButtonText}>보기</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>주변 코스가 없습니다.</Text>
            )}
          </Card>
        </>
      )}

      <Portal>
        <Dialog visible={uploadDialogVisible} onDismiss={() => setUploadDialogVisible(false)}>
          <Dialog.Title>코스 업로드</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="코스 이름"
              value={courseName}
              onChangeText={setCourseName}
              style={styles.dialogInput}
              mode="outlined"
            />
            <TextInput
              label="설명 (선택)"
              value={courseDescription}
              onChangeText={setCourseDescription}
              style={styles.dialogInput}
              mode="outlined"
              multiline
              numberOfLines={3}
            />
            <Text style={styles.dialogLabel}>난이도</Text>
            <RadioButton.Group
              onValueChange={setCourseDifficulty}
              value={courseDifficulty}
            >
              <RadioButton.Item label="쉬움" value="easy" />
              <RadioButton.Item label="보통" value="medium" />
              <RadioButton.Item label="어려움" value="hard" />
            </RadioButton.Group>
            <Divider style={styles.dialogDivider} />
            <Text style={styles.dialogLabel}>공개 설정</Text>
            <RadioButton.Group
              onValueChange={setCourseVisibility}
              value={courseVisibility}
            >
              <RadioButton.Item label="공개" value="public" />
              <RadioButton.Item label="비공개" value="private" />
            </RadioButton.Group>
            <Text style={styles.dialogHint}>
              현재 러닝 중인 경로를 코스로 업로드할 수 있습니다. 러닝 화면에서 "코스 업로드"를 선택하세요.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setUploadDialogVisible(false)}>취소</Button>
            <Button
              mode="contained"
              onPress={handleUploadCourse}
              loading={uploading}
              disabled={!courseName.trim() || uploading}
            >
              업로드
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog 
          visible={importDialogVisible} 
          onDismiss={() => {
            console.log('[Courses] 다이얼로그 닫기');
            if (!importingOSM && !importingGPX) {
              setImportDialogVisible(false);
              setGpxUrl('');
              setGpxFileContent('');
            }
          }}
        >
          <Dialog.Title>코스 가져오기</Dialog.Title>
          <Dialog.Content>
            {(importingOSM || importingGPX) && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>
                  {importingOSM ? 'OpenStreetMap에서 경로를 찾는 중...' : 'GPX 파일을 처리하는 중...'}
                </Text>
              </View>
            )}
            <Text style={styles.dialogLabel}>방법 선택</Text>
            <View style={styles.importMethods}>
              <Button
                mode="outlined"
                icon="map"
                onPress={() => {
                  console.log('[Courses] OpenStreetMap 가져오기 버튼 클릭');
                  handleImportFromOSM();
                }}
                style={styles.importMethodButton}
                loading={importingOSM}
                disabled={importingOSM || importingGPX}
              >
                OpenStreetMap에서 가져오기
              </Button>
              <Text style={styles.methodDescription}>
                현재 위치 주변의 러닝 경로를 자동으로 찾아 가져옵니다.
              </Text>
            </View>

            <Divider style={styles.dialogDivider} />

            <Text style={styles.dialogLabel}>GPX 파일 가져오기</Text>
            <TextInput
              label="GPX 파일 URL"
              value={gpxUrl}
              onChangeText={setGpxUrl}
              style={styles.dialogInput}
              mode="outlined"
              placeholder="https://example.com/running-course.gpx"
            />
            <Text style={styles.dialogHint}>또는</Text>
            <TextInput
              label="GPX 파일 내용 (XML)"
              value={gpxFileContent}
              onChangeText={setGpxFileContent}
              style={styles.dialogInput}
              mode="outlined"
              multiline
              numberOfLines={5}
              placeholder="<gpx>...</gpx>"
            />
            <Button
              mode="contained"
              icon="file-upload"
              onPress={() => {
                console.log('[Courses] GPX 가져오기 버튼 클릭');
                handleImportFromGPX();
              }}
              style={styles.importGPXButton}
              loading={importingGPX}
              disabled={importingGPX || importingOSM || (!gpxUrl.trim() && !gpxFileContent.trim())}
            >
              GPX 파일 가져오기
            </Button>
            <Text style={styles.dialogHint}>
              GPX 파일은 Wikiloc, AllTrails 등에서 다운로드할 수 있습니다.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button 
              onPress={() => {
                if (!importingOSM && !importingGPX) {
                  setImportDialogVisible(false);
                  setGpxUrl('');
                  setGpxFileContent('');
                }
              }}
              disabled={importingOSM || importingGPX}
            >
              취소
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  title: {
    ...typography.h1,
    fontSize: 32,
    fontWeight: '800',
    color: colors.textStrong,
    fontFamily: typography.h1.fontFamily,
  },
  navigationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  navigationButtonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPreviewContainer: {
    paddingHorizontal: spacing.md,
  },
  mapPreview: {
    width: '100%',
    height: 160,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  mapPreviewContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPreviewText: {
    ...typography.label,
    color: colors.textStrong,
    marginTop: spacing.xs,
  },
  mapPreviewBadge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: 'rgba(28, 28, 30, 0.8)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mapPreviewBadgeText: {
    ...typography.caption,
    color: colors.textStrong,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitleText: {
    marginBottom: 0,
  },
  coursesList: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  courseCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    padding: 0,
  },
  courseImage: {
    width: '100%',
    height: 100,
    justifyContent: 'flex-end',
    padding: spacing.md,
  },
  courseImageBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: 'rgba(28, 28, 30, 0.9)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  courseImageBadgeText: {
    ...typography.caption,
    fontSize: 12,
    color: colors.textStrong,
    fontWeight: '600',
  },
  courseInfo: {
    padding: spacing.md,
  },
  courseInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  courseInfoLeft: {
    flex: 1,
  },
  courseName: {
    ...typography.body,
    fontSize: 16,
    fontWeight: '700',
    color: colors.textStrong,
    marginBottom: spacing.xs,
  },
  courseDistance: {
    ...typography.caption,
    color: colors.textLight,
  },
  courseRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  courseRatingText: {
    ...typography.label,
    color: colors.textStrong,
  },
  courseInfoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseReviews: {
    ...typography.caption,
    fontSize: 12,
    color: colors.textLight,
  },
  startButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: 20,
  },
  startButtonText: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '600',
    color: colors.textStrong,
  },
  nearbyRoutesCard: {
    borderRadius: 20,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.md,
  },
  nearbyRouteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  nearbyRouteIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nearbyRouteInfo: {
    flex: 1,
  },
  nearbyRouteName: {
    ...typography.label,
    color: colors.textStrong,
    marginBottom: spacing.xs,
  },
  nearbyRouteDetails: {
    ...typography.caption,
    color: colors.textLight,
  },
  viewButton: {
    paddingHorizontal: spacing.sm,
  },
  viewButtonText: {
    ...typography.caption,
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textLight,
    fontFamily: typography.caption.fontFamily,
  },
  searchContainer: {
    marginBottom: spacing.md,
  },
  searchbar: {
    borderRadius: 12,
  },
  filterContainer: {
    marginBottom: spacing.md,
  },
  filterChip: {
    marginRight: spacing.sm,
  },
  top3Section: {
    marginBottom: spacing.lg,
  },
  allCoursesSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h2,
    marginBottom: spacing.sm,
    color: colors.textStrong,
    fontFamily: typography.h2.fontFamily,
  },
  list: {
    gap: spacing.md,
  },
  card: {
    borderRadius: 16,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  courseName: {
    ...typography.h2,
    fontSize: 16,
    fontWeight: '700',
    color: colors.textStrong,
    flex: 1,
    fontFamily: typography.h2.fontFamily,
  },
  difficultyChip: {
    height: 24,
  },
  chipText: {
    ...typography.bodySmall,
    color: '#fff',
  },
  courseDescription: {
    ...typography.caption,
    color: colors.textLight,
    marginBottom: spacing.md,
    fontFamily: typography.caption.fontFamily,
  },
  courseStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.md,
  },
  cardActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: spacing.xs,
    fontFamily: typography.caption.fontFamily,
  },
  statValue: {
    fontSize: typography.caption.fontSize,
    fontWeight: '500',
    fontFamily: typography.caption.fontFamily,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.body.fontSize,
    color: '#666',
    fontFamily: typography.body.fontFamily,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    fontSize: typography.body.fontSize,
    color: '#666',
    marginTop: spacing.md,
    fontFamily: typography.body.fontFamily,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadButton: {
    marginLeft: spacing.sm,
  },
  importButton: {
    marginLeft: 0,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
  },
  importButtonTouchable: {
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  importButtonText: {
    color: colors.primary,
    fontSize: typography.caption.fontSize,
    fontWeight: '500',
    fontFamily: typography.caption.fontFamily,
  },
  importMethods: {
    marginBottom: spacing.md,
  },
  importMethodButton: {
    marginBottom: spacing.xs,
  },
  methodDescription: {
    fontSize: typography.caption.fontSize,
    color: '#666',
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
    fontFamily: typography.caption.fontFamily,
  },
  importGPXButton: {
    marginTop: spacing.md,
  },
  loadingOverlay: {
    alignItems: 'center',
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  dialogInput: {
    marginBottom: spacing.md,
  },
  dialogLabel: {
    fontSize: typography.body.fontSize,
    fontWeight: '500',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    fontFamily: typography.body.fontFamily,
  },
  dialogDivider: {
    marginVertical: spacing.md,
  },
  dialogHint: {
    fontSize: typography.caption.fontSize,
    color: '#666',
    marginTop: spacing.md,
    fontStyle: 'italic',
    fontFamily: typography.caption.fontFamily,
  },
});
