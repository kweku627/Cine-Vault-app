// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { useTheme } from '@/contexts/ThemeContext';

// export default function TrailersScreen() {
//   const { theme } = useTheme();

//   return (
//     <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
//       <Text style={[styles.text, { color: theme.colors.text }]}>
//         Trailers Screen - Coming Soon
//       </Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   text: {
//     fontSize: 18,
//     fontWeight: '600',
//   },
// });

// // Original trailer screen code commented out below:
// /*
// import React, { useState, useEffect, useRef } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   Dimensions, 
//   TouchableOpacity, 
//   ScrollView, 
//   TextInput,
//   FlatList,
//   Animated,
//   Platform,
//   Image,
//   KeyboardAvoidingView,
//   Keyboard
// } from 'react-native';
// import { GestureHandlerRootView, TapGestureHandler, State } from 'react-native-gesture-handler';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Ionicons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useVideoPlayer, VideoView } from 'expo-video';
// import { router } from 'expo-router';
// import { useTheme } from '@/contexts/ThemeContext';
// import { useWatchLater } from '@/contexts/WatchLaterContext';
// import { TrailersApiService } from '@/services/TrailerApiService';
// import { TrailerContent, Comment } from '@/types/content';

// const { height, width } = Dimensions.get('window');

// interface ApiTrailerContent {
//   id: number;
//   title: string;
//   description: string;
//   posterUrl: string;
//   backdropUrl?: string;
//   releaseYear: number;
//   type: string;
//   genre: string;
//   duration: number;
//   rating: number;
//   likes: number;
//   comments: number;
//   shares: number;
//   isLiked: boolean;
//   isSaved: boolean;
//   videoUri: string;
// }

// export default function TrailersScreen() {
//   const { theme } = useTheme();
//   const { watchLaterList, addToWatchLater, removeFromWatchLater } = useWatchLater();
//   const [trailers, setTrailers] = useState<TrailerContent[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(true);
//   const [isMuted, setIsMuted] = useState(false);
//   const [showComments, setShowComments] = useState(false);
//   const [commentText, setCommentText] = useState('');
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
//   const [highlightedCommentId, setHighlightedCommentId] = useState<string | null>(null);
  
//   const scrollViewRef = useRef<ScrollView>(null);
//   const commentInputRef = useRef<TextInput>(null);
//   const fadeAnim = useRef(new Animated.Value(1)).current;
//   const overlayOpacity = useRef(new Animated.Value(1)).current;
//   const descriptionHeight = useRef(new Animated.Value(0)).current;
//   const commentModalTranslateY = useRef(new Animated.Value(height)).current;
//   const commentHighlightAnims = useRef<{ [key: string]: Animated.Value }>({}).current;
//   const lastTap = useRef(0);
//   const likeAnimation = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     loadTrailers();
//     loadComments();
//   }, []);



//   useEffect(() => {
//     Animated.timing(overlayOpacity, {
//       toValue: 1,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();

//     if (Platform.OS !== 'web') {
//       const currentPlayer = videoPlayers[currentIndex];
//       if (currentPlayer && isPlaying) {
//         currentPlayer.play();
//       }

//       videoPlayers.forEach((player, index) => {
//         if (index !== currentIndex && player) {
//           player.pause();
//         }
//       });
//     }
//   }, [currentIndex, isPlaying]);

//   useEffect(() => {
//     Animated.timing(descriptionHeight, {
//       toValue: isDescriptionExpanded ? 80 : 0,
//       duration: 300,
//       useNativeDriver: false,
//     }).start();
//   }, [isDescriptionExpanded]);

//   useEffect(() => {
//     Animated.timing(commentModalTranslateY, {
//       toValue: showComments ? 0 : height,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();
//   }, [showComments]);

//   const loadTrailers = async () => {
//     try {
//       const trailerData: ApiTrailerContent[] = await TrailersApiService.getTrailers();
//       const transformedTrailers: TrailerContent[] = trailerData.map((item) => ({
//         id: `trailer-${item.id}`,
//         title: item.title,
//         description: item.description,
//         poster: item.posterUrl,
//         backdrop: item.backdropUrl || item.posterUrl,
//         year: item.releaseYear,
//         type: item.type.toLowerCase() as 'movie' | 'series',
//         genre: item.genre,
//         duration: item.duration,
//         rating: item.rating,
//         likes: item.likes,
//         comments: item.comments,
//         shares: item.shares,
//         isLiked: item.isLiked,
//         isSaved: (watchLaterList ?? []).some((saved) => saved.id === `trailer-${item.id}`),
//         videoUri: item.videoUri,
//       }));
//       setTrailers(transformedTrailers);
//     } catch (error: any) {
//       console.error('Failed to load trailers:', error);
//       const mockTrailers = getMockTrailers();
//       setTrailers(mockTrailers.map((trailer) => ({
//         ...trailer,
//         isSaved: (watchLaterList ?? []).some((saved) => saved.id === trailer.id),
//       })));
//     }
//   };

//   const loadComments = async () => {
//     try {
//       const commentData = await TrailersApiService.getComments(trailers[currentIndex]?.id || 'trailer-1');
//       setComments(commentData);
//     } catch (error: any) {
//       console.error('Failed to load comments:', error);
//       setComments(getMockComments());
//     }
//   };

//   const getMockTrailers = (): TrailerContent[] => [
//     {
//       id: 'trailer-1',
//       title: 'The Perfect Brew',
//       description: 'Discover the art of coffee making with master baristas from around the world. Learn techniques that will transform your morning routine into a ritual of excellence.',
//       poster: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=2',
//       backdrop: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&dpr=2',
//       year: 2024,
//       type: 'series',
//       genre: 'Documentary',
//       duration: 45,
//       rating: 4.9,
//       likes: 45200,
//       comments: 1240,
//       shares: 890,
//       isLiked: false,
//       isSaved: false,
//       videoUri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
//     },
//     {
//       id: 'trailer-2',
//       title: 'Coffee Origins',
//       description: 'Journey through the coffee belt and explore the rich history and culture behind every cup. From bean to brew, discover the stories that make each sip special.',
//       poster: 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=2',
//       backdrop: 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&dpr=2',
//       year: 2024,
//       type: 'movie',
//       genre: 'Documentary',
//       duration: 120,
//       rating: 4.8,
//       likes: 38900,
//       comments: 980,
//       shares: 650,
//       isLiked: false,
//       isSaved: false,
//       videoUri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
//     },
//     {
//       id: 'trailer-3',
//       title: 'Café Culture',
//       description: 'Explore the vibrant café scenes across different continents and discover how coffee brings communities together in the most unexpected ways.',
//       poster: 'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=2',
//       backdrop: 'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&dpr=2',
//       year: 2024,
//       type: 'series',
//       genre: 'Lifestyle',
//       duration: 30,
//       rating: 4.7,
//       likes: 52100,
//       comments: 1560,
//       shares: 720,
//       isLiked: false,
//       isSaved: false,
//       videoUri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
//     },
//     {
//       id: 'trailer-4',
//       title: 'Barista Masters',
//       description: 'Follow the journey of aspiring baristas as they compete in the world championship. Witness the passion, skill, and dedication required to craft the perfect cup.',
//       poster: 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=2',
//       backdrop: 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&dpr=2',
//       year: 2024,
//       type: 'series',
//       genre: 'Competition',
//       duration: 50,
//       rating: 4.9,
//       likes: 67800,
//       comments: 2100,
//       shares: 1200,
//       isLiked: false,
//       isSaved: false,
//       videoUri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
//     },
//     {
//       id: 'trailer-5',
//       title: 'Roast Revolution',
//       description: 'Enter the world of coffee roasting where science meets art. Learn from master roasters who transform green beans into aromatic treasures.',
//       poster: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=2',
//       backdrop: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&dpr=2',
//       year: 2024,
//       type: 'movie',
//       genre: 'Educational',
//       duration: 95,
//       rating: 4.6,
//       likes: 29400,
//       comments: 780,
//       shares: 420,
//       isLiked: false,
//       isSaved: false,
//       videoUri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
//     },
//   ];

//   const getMockComments = (): Comment[] => [
//     {
//       id: '1',
//       user: 'CoffeeEnthusiast',
//       avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
//       text: 'This looks absolutely amazing! Can\'t wait to watch it! ☕️',
//       timestamp: '2h',
//       likes: 24,
//       isLiked: false,
//       parentCommentId: undefined,
//     },
//     {
//       id: '2',
//       user: 'MovieBuff2024',
//       avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
//       text: 'The cinematography in this trailer is incredible! 🎬',
//       timestamp: '4h',
//       likes: 18,
//       isLiked: false,
//       parentCommentId: undefined,
//     },
//     {
//       id: '3',
//       user: 'StreamingFan',
//       avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
//       text: 'Adding this to my watchlist immediately! 🔥',
//       timestamp: '6h',
//       likes: 31,
//       isLiked: false,
//       parentCommentId: undefined,
//     },
//     {
//       id: '4',
//       user: 'BaristaLife',
//       avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
//       text: 'As a professional barista, I\'m so excited for this series! 💪',
//       timestamp: '8h',
//       likes: 42,
//       isLiked: false,
//       parentCommentId: undefined,
//     },
//     {
//       id: '5',
//       user: 'CoffeeAddict',
//       avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
//       text: 'Finally, quality coffee content! This is what we\'ve been waiting for ☕️✨',
//       timestamp: '12h',
//       likes: 67,
//       isLiked: false,
//       parentCommentId: undefined,
//     },
//   ];

//   const handleScroll = (event: any) => {
//     const contentOffset = event.nativeEvent.contentOffset.y;
//     const index = Math.round(contentOffset / height);
//     if (index !== currentIndex && index >= 0 && index < trailers.length) {
//       setCurrentIndex(index);
//       setIsDescriptionExpanded(false);
//       setHighlightedCommentId(null);
//       loadComments();
//     }
//   };

//   const handleLike = (index: number) => {
//     setTrailers(prev => prev.map((trailer, i) => 
//       i === index 
//         ? { 
//             ...trailer, 
//             isLiked: !trailer.isLiked,
//             likes: trailer.isLiked ? trailer.likes - 1 : trailer.likes + 1
//           }
//         : trailer
//     ));

//     Animated.sequence([
//       Animated.timing(fadeAnim, {
//         toValue: 1.2,
//         duration: 100,
//         useNativeDriver: true,
//       }),
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 100,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   };

//   const handleCommentLike = async (commentId: string) => {
//     setComments(prev => prev.map(comment => 
//       comment.id === commentId 
//         ? { 
//             ...comment, 
//             isLiked: !comment.isLiked, 
//             likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1 
//           }
//         : comment
//     ));

//     try {
//       await TrailersApiService.likeComment(trailers[currentIndex].id, commentId, !comments.find(c => c.id === commentId)?.isLiked);
//       Animated.sequence([
//         Animated.timing(fadeAnim, {
//           toValue: 1.2,
//           duration: 100,
//           useNativeDriver: true,
//         }),
//         Animated.timing(fadeAnim, {
//           toValue: 1,
//           duration: 100,
//           useNativeDriver: true,
//         }),
//       ]).start();
//     } catch (error) {
//       console.error('Failed to like comment:', error);
//       setComments(prev => prev.map(comment => 
//         comment.id === commentId 
//           ? { 
//               ...comment, 
//               isLiked: !comment.isLiked, 
//               likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1 
//             }
//           : comment
//       ));
//     }
//   };

//   const handleReply = (comment: Comment) => {
//     setCommentText(`@${comment.user} ("${comment.text}") `);
//     setShowComments(true);
//     setHighlightedCommentId(comment.id);
//     commentInputRef.current?.focus();

//     if (!commentHighlightAnims[comment.id]) {
//       commentHighlightAnims[comment.id] = new Animated.Value(0);
//     }
//     Animated.sequence([
//       Animated.timing(commentHighlightAnims[comment.id], {
//         toValue: 0.1,
//         duration: 300,
//         useNativeDriver: true,
//       }),
//       Animated.timing(commentHighlightAnims[comment.id], {
//         toValue: 0,
//         duration: 300,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   };

//   const handleMentionPress = (username: string) => {
//     console.log(`Mention pressed: ${username}`);
//   };

//   const handleSave = (index: number) => {
//     const trailer = trailers[index];
//     if (watchLaterList.some((item) => item.id === trailer.id)) {
//       removeFromWatchLater(trailer.id);
//       setTrailers(prev => prev.map((t, i) => 
//         i === index ? { ...t, isSaved: false } : t
//       ));
//     } else {
//       addToWatchLater(trailer);
//       setTrailers(prev => prev.map((t, i) => 
//         i === index ? { ...t, isSaved: true } : t
//       ));
//     }
//   };

//   const handleShare = (trailer: TrailerContent) => {
//     console.log('Share trailer:', trailer.title);
//   };

//   const handleComment = (trailer: TrailerContent) => {
//     setShowComments(true);
//   };

//   const handleSendComment = async () => {
//     if (commentText.trim()) {
//       const newComment: Comment = {
//         id: Date.now().toString(),
//         user: 'You',
//         avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
//         text: commentText,
//         timestamp: 'now',
//         likes: 0,
//         isLiked: false,
//         parentCommentId: commentText.match(/^@(\w+)/)?.[1] ? comments.find(c => c.user === commentText.match(/^@(\w+)/)?.[1])?.id : undefined,
//       };
//       setComments(prev => [newComment, ...prev]);
//       setCommentText('');
//       setHighlightedCommentId(null);

//       setTrailers(prev => prev.map((trailer, i) => 
//         i === currentIndex 
//           ? { ...trailer, comments: trailer.comments + 1 }
//           : trailer
//       ));

//       try {
//         await TrailersApiService.addComment(trailers[currentIndex].id, newComment);
//       } catch (error) {
//         console.error('Failed to add comment:', error);
//       }
//     }
//   };

//   const handleWatchFull = (trailer: TrailerContent) => {
//     router.push(`/watch/${trailer.id}`);
//   };



//   const toggleDescription = () => {
//     setIsDescriptionExpanded(!isDescriptionExpanded);
//   };

//   const toggleMute = () => {
//     setIsMuted(!isMuted);
//   };

//   const handleTap = () => {
//     const now = Date.now();
//     const DOUBLE_TAP_DELAY = 300;
    
//     if (lastTap.current && (now - lastTap.current) < DOUBLE_TAP_DELAY) {
//       // Double tap - like
//       handleLike(currentIndex);
      
//       // Heart animation
//       Animated.sequence([
//         Animated.timing(likeAnimation, {
//           toValue: 1,
//           duration: 200,
//           useNativeDriver: true,
//         }),
//         Animated.timing(likeAnimation, {
//           toValue: 0,
//           duration: 200,
//           useNativeDriver: true,
//         }),
//       ]).start();
      
//       lastTap.current = 0;
//     } else {
//       // Single tap - play/pause
//       togglePlayPause();
//       lastTap.current = now;
//     }
//   };

//   const handleLongPress = () => {
//     setShowComments(true);
//   };

//   const togglePlayPause = () => {
//     setIsPlaying(!isPlaying);
    
//     if (Platform.OS !== 'web') {
//       const currentPlayer = videoPlayers[currentIndex];
//       if (currentPlayer) {
//         if (isPlaying) {
//           currentPlayer.pause();
//         } else {
//           currentPlayer.play();
//         }
//       }
//     }
//   };

//   const formatNumber = (num: number) => {
//     if (num >= 1000000) {
//       return (num / 1000000).toFixed(1) + 'M';
//     }
//     if (num >= 1000) {
//       return (num / 1000).toFixed(1) + 'K';
//     }
//     return num.toString();
//   };

//   const renderCommentText = (text: string) => {
//     const parts = text.split(/(@\w+)/g);
//     return (
//       <Text style={[styles.commentText, { color: theme.colors.textSecondary }]}>
//         {parts.map((part, index) => {
//           if (part.match(/^@\w+$/)) {
//             const username = part.slice(1);
//             return (
//               <Text
//                 key={index}
//                 style={[styles.mentionText, { color: theme.colors.accent }]}
//                 onPress={() => handleMentionPress(username)}
//               >
//                 {part}
//               </Text>
//             );
//           }
//           return <Text key={index}>{part}</Text>;
//         })}
//       </Text>
//     );
//   };

//   const currentTrailer = trailers[currentIndex];
//   const progressWidth = trailers.length > 1 ? (currentIndex / (trailers.length - 1)) * 100 : 0;

//   // Create video players for each trailer
//   const videoPlayer1 = useVideoPlayer(trailers[0]?.videoUri || '', (player) => {
//     player.loop = true;
//     if (currentIndex === 0 && isPlaying) player.play();
//   });
//   const videoPlayer2 = useVideoPlayer(trailers[1]?.videoUri || '', (player) => {
//     player.loop = true;
//     if (currentIndex === 1 && isPlaying) player.play();
//   });
//   const videoPlayer3 = useVideoPlayer(trailers[2]?.videoUri || '', (player) => {
//     player.loop = true;
//     if (currentIndex === 2 && isPlaying) player.play();
//   });
//   const videoPlayer4 = useVideoPlayer(trailers[3]?.videoUri || '', (player) => {
//     player.loop = true;
//     if (currentIndex === 3 && isPlaying) player.play();
//   });
//   const videoPlayer5 = useVideoPlayer(trailers[4]?.videoUri || '', (player) => {
//     player.loop = true;
//     if (currentIndex === 4 && isPlaying) player.play();
//   });

//   const videoPlayers = [videoPlayer1, videoPlayer2, videoPlayer3, videoPlayer4, videoPlayer5];

//   const styles = createStyles(theme);

//   return (
//     <GestureHandlerRootView style={styles.container}>
//       <SafeAreaView edges={['top']} style={styles.header}>
//         <Text style={styles.title}>Trailers</Text>
//       </SafeAreaView>

//       <ScrollView
//         ref={scrollViewRef}
//         pagingEnabled
//         showsVerticalScrollIndicator={false}
//         onScroll={handleScroll}
//         scrollEventThrottle={16}
//         style={styles.scrollView}
//         snapToInterval={height}
//         snapToAlignment="start"
//         decelerationRate="fast"
//       >
//         {trailers.map((trailer, index) => (
//           <TouchableOpacity
//             key={trailer.id}
//             style={styles.trailerContainer}
//             onPress={handleTap}
//             onLongPress={handleLongPress}
//             activeOpacity={1}
//           >
//             <View style={styles.mediaContainer}>
//               {Platform.OS !== 'web' ? (
//                 <VideoView
//                   style={styles.video}
//                   player={videoPlayers[index]}
//                   contentFit="cover"
//                   allowsFullscreen
//                   allowsPictureInPicture
//                   nativeControls={false}
//                 />
//               ) : (
//                 <Image
//                   source={{ uri: trailer.backdrop }}
//                   style={styles.video}
//                   resizeMode="cover"
//                 />
//               )}
              
//               <LinearGradient
//                 colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
//                 style={styles.bottomGradient}
//               />
//               <LinearGradient
//                 colors={['rgba(0,0,0,0.4)', 'transparent']}
//                 style={styles.topGradient}
//               />
              
//               {/* Heart Animation Overlay */}
//               <Animated.View
//                 style={[
//                   styles.heartOverlay,
//                   {
//                     opacity: likeAnimation,
//                     transform: [
//                       {
//                         scale: likeAnimation.interpolate({
//                           inputRange: [0, 1],
//                           outputRange: [0.3, 1.2],
//                         }),
//                       },
//                     ],
//                   },
//                 ]}
//               >
//                 <Ionicons name="heart" size={80} color="#FF3040" />
//               </Animated.View>
//             </View>

//             <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
//               <View style={styles.infoOverlay}>
//                 <Text style={styles.titleText}>{trailer.title}</Text>
//                 <Text style={styles.detailsText}>
//                   {trailer.genre} | {trailer.rating}/10 | {trailer.year}
//                 </Text>
//               </View>

//               <View style={styles.controls}>
//                 <TouchableOpacity 
//                   style={styles.actionButton}
//                   onPress={() => handleLike(index)}
//                 >
//                   <Animated.View style={{ transform: [{ scale: fadeAnim }] }}>
//                     <Ionicons 
//                       name={trailer.isLiked ? "heart" : "heart-outline"} 
//                       size={32} 
//                       color={trailer.isLiked ? "#FF3040" : theme.colors.text}
//                     />
//                   </Animated.View>
//                   <Text style={styles.actionText}>
//                     {formatNumber(trailer.likes)}
//                   </Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity 
//                   style={styles.actionButton}
//                   onPress={() => handleComment(trailer)}
//                 >
//                   <Ionicons name="chatbubble-outline" size={32} color={theme.colors.text} />
//                   <Text style={styles.actionText}>
//                     {formatNumber(trailer.comments)}
//                   </Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity 
//                   style={styles.actionButton}
//                   onPress={() => handleShare(trailer)}
//                 >
//                   <Ionicons name="share-outline" size={32} color={theme.colors.text} />
//                   <Text style={styles.actionText}>
//                     {formatNumber(trailer.shares)}
//                   </Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity 
//                   style={styles.actionButton}
//                   onPress={() => handleSave(index)}
//                 >
//                   <Ionicons 
//                     name={trailer.isSaved ? "bookmark" : "bookmark-outline"} 
//                     size={32} 
//                     color={trailer.isSaved ? theme.colors.primary : theme.colors.text}
//                   />
//                 </TouchableOpacity>
//               </View>

//               <View style={styles.bottomSection}>
//                 <TouchableOpacity onPress={toggleDescription} style={styles.descriptionToggle}>
//                   <Text style={styles.descriptionToggleText}>
//                     {isDescriptionExpanded ? 'Collapse' : 'Description'}
//                   </Text>
//                 </TouchableOpacity>

//                 <Animated.View style={[styles.descriptionContainer, { height: descriptionHeight }]}>
//                   {isDescriptionExpanded && (
//                     <Text style={styles.descriptionText}>{trailer.description}</Text>
//                   )}
//                 </Animated.View>

//                 <TouchableOpacity 
//                   style={[styles.watchFullButton, { backgroundColor: theme.colors.primary }]}
//                   onPress={() => handleWatchFull(trailer)}
//                 >
//                   <Ionicons name="play" size={16} color={theme.colors.surface} />
//                   <Text style={[styles.watchFullText, { color: theme.colors.surface }]}>
//                     Watch Full
//                   </Text>
//                 </TouchableOpacity>
//               </View>

//               <View style={[styles.progressBar, { backgroundColor: theme.colors.textMuted }]}>
//                 <View 
//                   style={[
//                     styles.progress, 
//                     { 
//                       width: `${progressWidth}%`, 
//                       backgroundColor: theme.colors.accent 
//                     }
//                   ]} 
//                 />
//               </View>
//             </Animated.View>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>

//       {showComments && (
//         <KeyboardAvoidingView
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//           style={styles.keyboardAvoidingView}
//         >
//           <Animated.View
//             style={[
//               styles.commentsModal,
//               {
//                 backgroundColor: theme.colors.background,
//                 transform: [{ translateY: commentModalTranslateY }],
//                 height: height * 0.5,
//               },
//             ]}
//           >
//           <View style={[styles.commentsHeader, { borderBottomColor: theme.colors.border }]}>
//             <Text style={[styles.commentsTitle, { color: theme.colors.text }]}>
//               {formatNumber(currentTrailer?.comments || 0)} comments
//             </Text>
//             <TouchableOpacity
//               onPress={() => {
//                 setShowComments(false);
//                 setCommentText('');
//                 setHighlightedCommentId(null);
//               }}
//             >
//               <Ionicons name="close" size={24} color={theme.colors.text} />
//             </TouchableOpacity>
//           </View>

//           <FlatList
//             data={comments}
//             keyExtractor={(item) => item.id}
//             style={styles.commentsList}
//             renderItem={({ item }) => (
//               <Animated.View 
//                 style={[
//                   styles.commentItem, 
//                   { 
//                     borderBottomColor: theme.colors.border,
//                     backgroundColor: highlightedCommentId === item.id 
//                       ? commentHighlightAnims[item.id]?.interpolate({
//                           inputRange: [0, 0.1],
//                           outputRange: ['transparent', theme.colors.card],
//                         }) 
//                       : 'transparent',
//                   }
//                 ]}
//               >
//                 <Image
//                   source={{ uri: item.avatar }}
//                   style={styles.commentAvatar}
//                 />
//                 <View style={styles.commentContent}>
//                   <View style={styles.commentHeader}>
//                     <Text style={[styles.commentUser, { color: theme.colors.text }]}>
//                       {item.user}
//                     </Text>
//                     <Text style={[styles.commentTime, { color: theme.colors.textMuted }]}>
//                       {item.timestamp}
//                     </Text>
//                   </View>
//                   {renderCommentText(item.text)}
//                   <View style={styles.commentActions}>
//                     <TouchableOpacity 
//                       style={styles.commentLike}
//                       onPress={() => handleCommentLike(item.id)}
//                     >
//                       <Animated.View style={{ transform: [{ scale: fadeAnim }] }}>
//                         <Ionicons 
//                           name={item.isLiked ? "heart" : "heart-outline"} 
//                           size={16} 
//                           color={item.isLiked ? "#FF3040" : theme.colors.textMuted}
//                         />
//                       </Animated.View>
//                       <Text style={[styles.commentLikeText, { color: theme.colors.textMuted }]}>
//                         {item.likes}
//                       </Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={() => handleReply(item)}>
//                       <Text style={[styles.replyText, { color: theme.colors.textMuted }]}>
//                         Reply
//                       </Text>
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               </Animated.View>
//             )}
//           />

//           <View style={[styles.commentInput, { backgroundColor: theme.colors.card, borderTopColor: theme.colors.border }]}>
//             <TextInput
//               ref={commentInputRef}
//               style={[styles.textInput, { color: theme.colors.text, backgroundColor: theme.colors.background }]}
//               placeholder="Add a comment..."
//               placeholderTextColor={theme.colors.textMuted}
//               value={commentText}
//               onChangeText={setCommentText}
//               multiline
//               onBlur={() => Keyboard.dismiss()}
//             />
//             <TouchableOpacity 
//               style={[styles.sendButton, { backgroundColor: theme.colors.primary }]}
//               onPress={handleSendComment}
//             >
//               <Ionicons name="send" size={20} color={theme.colors.surface} />
//             </TouchableOpacity>
//           </View>
//         </Animated.View>
//         </KeyboardAvoidingView>
//       )}
//     </GestureHandlerRootView>
//   );
// }

// const createStyles = (theme: any) => StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: theme.colors.background,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingBottom: 10,
//     backgroundColor: theme.colors.background,
//     zIndex: 10,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: theme.colors.text,
//   },
//   headerControls: {
//     flexDirection: 'row',
//     gap: 16,
//   },
//   headerButton: {
//     padding: 8,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   keyboardAvoidingView: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//   },
//   scrollViewContainer: {
//     flex: 1,
//   },
//   heartOverlay: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: [{ translateX: -40 }, { translateY: -40 }],
//     zIndex: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   trailerContainer: {
//     height: height,
//     position: 'relative',
//     backgroundColor: 'black',
//   },
//   mediaContainer: {
//     flex: 1,
//     position: 'relative',
//   },
//   video: {
//     width: '100%',
//     height: '100%',
//   },
//   bottomGradient: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: 300,
//   },
//   topGradient: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: 100,
//   },
//   overlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: 'space-between',
//     padding: 10,
//     zIndex: 1,
//   },
//   infoOverlay: {
//     alignItems: 'flex-start',
//     marginTop: 10,
//     zIndex: 2,
//   },
//   titleText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: theme.colors.text,
//   },
//   detailsText: {
//     fontSize: 14,
//     marginTop: 5,
//     color: theme.colors.textSecondary,
//   },
//   controls: {
//     flexDirection: 'column',
//     justifyContent: 'flex-end',
//     position: 'absolute',
//     zIndex: 3,
//     right: 16,
//     bottom: 120,
//     alignItems: 'center',
//     gap: 24,
//   },
//   actionButton: {
//     alignItems: 'center',
//     gap: 4,
//   },
//   actionText: {
//     fontSize: 12,
//     color: theme.colors.textSecondary,
//     fontWeight: '600',
//   },
//   bottomSection: {
//     marginBottom: 20,
//     zIndex: 2,
//   },
//   descriptionToggle: {
//     marginBottom: 5,
//   },
//   descriptionToggleText: {
//     fontSize: 14,
//     color: theme.colors.textSecondary,
//   },
//   descriptionContainer: {
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     borderRadius: 5,
//     overflow: 'hidden',
//     marginBottom: 15,
//   },
//   descriptionText: {
//     fontSize: 14,
//     lineHeight: 18,
//     padding: 8,
//     color: theme.colors.textSecondary,
//   },
//   watchFullButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 25,
//     alignSelf: 'flex-start',
//     gap: 8,
//   },
//   watchFullText: {
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   progressBar: {
//     height: 3,
//     width: '100%',
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     backgroundColor: 'rgba(255, 255, 255, 0.3)',
//     zIndex: 2,
//   },
//   progress: {
//     height: '100%',
//   },
//   commentsModal: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     overflow: 'hidden',
//   },
//   commentsHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//   },
//   commentsTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   commentsList: {
//     flex: 1,
//     paddingHorizontal: 20,
//   },
//   commentItem: {
//     flexDirection: 'row',
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//   },
//   commentAvatar: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     marginRight: 12,
//   },
//   commentContent: {
//     flex: 1,
//   },
//   commentHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   commentUser: {
//     fontSize: 14,
//     fontWeight: '600',
//     marginRight: 8,
//   },
//   commentTime: {
//     fontSize: 12,
//   },
//   commentText: {
//     fontSize: 14,
//     lineHeight: 20,
//     marginBottom: 8,
//   },
//   mentionText: {
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   commentActions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 16,
//   },
//   commentLike: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   commentLikeText: {
//     fontSize: 12,
//   },
//   replyText: {
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   commentInput: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     borderTopWidth: 1,
//     gap: 12,
//   },
//   textInput: {
//     flex: 1,
//     borderRadius: 20,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     maxHeight: 100,
//     fontSize: 16,
//   },
//   sendButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });
// */