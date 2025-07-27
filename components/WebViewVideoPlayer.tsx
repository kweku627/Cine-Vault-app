import React from 'react';
import { WebView } from 'react-native-webview';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface WebViewVideoPlayerProps {
  tmdbId: string;
  type: 'movie' | 'series';
  season?: number;
  episode?: number;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  onError?: (error: string) => void;
  showLoadingOverlay?: boolean;
}

export default function WebViewVideoPlayer({ 
  tmdbId, 
  type, 
  season, 
  episode, 
  onLoadStart, 
  onLoadEnd, 
  onError,
  showLoadingOverlay = true
}: WebViewVideoPlayerProps) {
  const { theme } = useTheme();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [timeoutReached, setTimeoutReached] = React.useState(false);
  const [webViewKey, setWebViewKey] = React.useState(0);

  const getVideoUrl = () => {
    if (type === 'movie') {
      const url = `https://vidsrc.to/embed/movie/${tmdbId}`;
      console.log('WebView loading movie URL:', url);
      console.log('WebView movie tmdbId:', tmdbId);
      console.log('WebView movie type:', type);
      return url;
    } else if (type === 'series' && season && episode) {
      const url = `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`;
      console.log('WebView loading series URL:', url);
      return url;
    } else {
      const url = `https://vidsrc.to/embed/tv/${tmdbId}`;
      console.log('WebView loading series URL:', url);
      return url;
    }
  };

  const getHtmlContent = () => {
    const videoUrl = getVideoUrl();
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { margin: 0; padding: 0; background: #000; }
            iframe { width: 100%; height: 100vh; border: none; }
          </style>
        </head>
        <body>
          <iframe src="${videoUrl}" allowfullscreen></iframe>
        </body>
      </html>
    `;
  };

  const handleLoadStart = () => {
    console.log('WebView load started');
    setLoading(true);
    setError(null);
    setTimeoutReached(false);
    onLoadStart?.();
    
    // Set a timeout to show a message if loading takes too long
    setTimeout(() => {
      if (loading) {
        console.log('WebView loading timeout reached');
        setTimeoutReached(true);
      }
    }, 10000); // 10 seconds timeout
  };

  const handleLoadEnd = () => {
    console.log('WebView load ended');
    setLoading(false);
    setTimeoutReached(false);
    onLoadEnd?.();
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    const errorMessage = nativeEvent.description || 'Failed to load video';
    console.log('WebView error:', errorMessage, nativeEvent);
    setError(errorMessage);
    setLoading(false);
    onError?.(errorMessage);
  };

  const handleMessage = (event: any) => {
    console.log('WebView message:', event.nativeEvent.data);
  };

  return (
    <View style={styles.container}>
      <WebView
        key={webViewKey}
        source={{ html: getHtmlContent() }}
        javaScriptEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        domStorageEnabled={true}
        startInLoadingState={true}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        onMessage={handleMessage}
        style={styles.webview}
        allowsFullscreenVideo={true}
        allowsProtectedMedia={true}
        mixedContentMode="compatibility"
        cacheEnabled={false}
        incognito={true}
        userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        setSupportMultipleWindows={false}
        injectedJavaScript={`
          window.open = function() { return null; };
          document.addEventListener('click', function(e) {
            if (e.target && e.target.target === '_blank') {
              e.preventDefault();
            }
          }, true);
          true;
        `}
      />
      
      {loading && showLoadingOverlay && (
        <View style={[styles.loadingOverlay, { backgroundColor: theme.colors.background }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Loading video...
          </Text>
          {timeoutReached && (
            <Text style={[styles.timeoutText, { color: theme.colors.textSecondary }]}>
              Taking longer than expected...
            </Text>
          )}
        </View>
      )}
      
      {error && (
        <View style={[styles.errorOverlay, { backgroundColor: theme.colors.background }]}>
          <Ionicons name="alert-circle" size={48} color={theme.colors.error} style={styles.errorIcon} />
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {error}
          </Text>
          <Text style={[styles.errorSubtext, { color: theme.colors.textSecondary }]}>
            Try refreshing or check your internet connection
          </Text>
          <Text style={[styles.errorSubtext, { color: theme.colors.textSecondary, marginTop: 8 }]}>
            Video source: {getVideoUrl()}
          </Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => {
              setError(null);
              setLoading(true);
              // Force reload by updating the key
              setWebViewKey(prevKey => prevKey + 1);
            }}
          >
            <Text style={[styles.retryButtonText, { color: theme.colors.surface }]}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  webview: {
    height: 400,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 2,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  timeoutText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  errorIcon: {
    marginBottom: 16,
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 