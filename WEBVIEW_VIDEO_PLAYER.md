# WebView Video Player

This document explains the new WebView-based video player feature that provides a reliable fallback when the current video sources aren't working.

## Overview

The WebView video player uses `vidsrc.to` as a streaming source to display movies and series directly in the app. This provides a consistent viewing experience when the backend video sources are unavailable.

## Components

### WebViewVideoPlayer

Located at `components/WebViewVideoPlayer.tsx`, this is the main component that handles video playback using React Native WebView.

**Props:**
- `tmdbId: string` - The TMDB ID of the movie or series
- `type: 'movie' | 'series'` - The type of content
- `season?: number` - Season number (for series)
- `episode?: number` - Episode number (for series)
- `onLoadStart?: () => void` - Callback when video starts loading
- `onLoadEnd?: () => void` - Callback when video finishes loading
- `onError?: (error: string) => void` - Callback when an error occurs

## Integration

### Movie Player (`app/watch/[id].tsx`)

The movie player now includes a fallback button that switches to the WebView player when the original video source fails:

```tsx
{useWebView ? (
  <WebViewVideoPlayer
    tmdbId={id as string}
    type="movie"
    onLoadStart={() => setVideoLoading(true)}
    onLoadEnd={() => setVideoLoading(false)}
    onError={(error) => setVideoError(error)}
  />
) : (
  // Original VideoView component
)}
```

### Series Player (`app/watch-series/[id].tsx`)

The series player includes a globe icon button in the top controls to toggle between the original player and WebView:

```tsx
<TouchableOpacity 
  style={styles.fallbackButton}
  onPress={() => setUseWebView(!useWebView)}
>
  <Ionicons name="globe" size={20} color="#FFFFFF" />
</TouchableOpacity>
```

## Test Screen

A test screen is available at `app/test-video.tsx` that allows you to:

- Switch between movie and series modes
- Select different content to test
- Adjust season and episode numbers for series
- See the WebView player in action

## URL Structure

The WebView player uses the following URL patterns:

- **Movies**: `https://vidsrc.to/embed/movie/{tmdbId}`
- **Series**: `https://vidsrc.to/embed/tv/{tmdbId}/{season}/{episode}`
- **Series Overview**: `https://vidsrc.to/embed/tv/{tmdbId}` (when no season/episode specified)

## Features

- **Fullscreen Support**: Videos can be played in fullscreen mode
- **Inline Playback**: Videos play inline without opening external apps
- **Error Handling**: Graceful error handling with user-friendly messages
- **Loading States**: Visual feedback during video loading
- **Responsive Design**: Adapts to different screen sizes

## Usage

1. **For Movies**: Navigate to any movie and if the video fails to load, tap "Try Web Player"
2. **For Series**: Use the globe icon in the video controls to switch to WebView mode
3. **Testing**: Visit the test screen to experiment with different content

## Dependencies

- `react-native-webview`: Already installed (version 13.13.5)
- No additional setup required

## Benefits

- **Reliability**: Provides a consistent fallback when backend sources fail
- **User Experience**: Seamless integration with existing UI
- **Content Availability**: Access to a wide range of movies and series
- **No Additional Setup**: Uses existing dependencies

## Notes

- The WebView player requires an internet connection
- Video quality depends on the source availability
- Some content may not be available due to regional restrictions
- The player respects the device's media playback settings 