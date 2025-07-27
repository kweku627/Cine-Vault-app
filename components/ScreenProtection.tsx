import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import * as ScreenCapture from 'expo-screen-capture';

interface ScreenProtectionProps {
  enabled: boolean;
  children: React.ReactNode;
}

export default function ScreenProtection({ enabled, children }: ScreenProtectionProps) {
  useEffect(() => {
    if (!enabled) return;

    const setupProtection = async () => {
      try {
        // Prevent screen capture on mobile platforms
        if (Platform.OS !== 'web') {
          await ScreenCapture.preventScreenCaptureAsync();
        }

        // Web-specific protections
        if (Platform.OS === 'web') {
          // Disable right-click context menu
          const handleContextMenu = (e: Event) => {
            e.preventDefault();
            return false;
          };

          // Disable common keyboard shortcuts
          const handleKeyDown = (e: KeyboardEvent) => {
            // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
            if (
              e.key === 'F12' ||
              (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
              (e.ctrlKey && e.key === 'U')
            ) {
              e.preventDefault();
              return false;
            }
          };

          // Detect developer tools
          const detectDevTools = () => {
            const threshold = 160;
            setInterval(() => {
              if (
                window.outerHeight - window.innerHeight > threshold ||
                window.outerWidth - window.innerWidth > threshold
              ) {
                console.clear();
                console.log('%cDeveloper tools detected!', 'color: red; font-size: 20px;');
              }
            }, 500);
          };

          // Add event listeners
          document.addEventListener('contextmenu', handleContextMenu);
          document.addEventListener('keydown', handleKeyDown);
          
          // Start dev tools detection
          detectDevTools();

          // Cleanup function
          return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
          };
        }
      } catch (error) {
        console.warn('Screen protection setup failed:', error);
      }
    };

    setupProtection();

    // Cleanup on unmount
    return () => {
      if (Platform.OS !== 'web') {
        ScreenCapture.allowScreenCaptureAsync().catch(console.warn);
      }
    };
  }, [enabled]);

  // Add CSS styles for web protection
  useEffect(() => {
    if (Platform.OS === 'web' && enabled) {
      const style = document.createElement('style');
      style.textContent = `
        * {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-touch-callout: none;
          -webkit-tap-highlight-color: transparent;
        }
        
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        
        @media print {
          body { display: none !important; }
        }
      `;
      document.head.appendChild(style);

      return () => {
        document.head.removeChild(style);
      };
    }
  }, [enabled]);

  return <>{children}</>;
}