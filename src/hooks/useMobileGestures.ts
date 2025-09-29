import { useCallback, useRef, useState } from 'react';

interface SwipeGesture {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
}

export function useSwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50
}: SwipeGesture) {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = useCallback((e: TouchEvent | React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const onTouchEnd = useCallback((e: TouchEvent | React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Determine if horizontal or vertical swipe
    if (absDeltaX > absDeltaY && absDeltaX > threshold) {
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    } else if (absDeltaY > absDeltaX && absDeltaY > threshold) {
      if (deltaY > 0 && onSwipeDown) {
        onSwipeDown();
      } else if (deltaY < 0 && onSwipeUp) {
        onSwipeUp();
      }
    }

    touchStartRef.current = null;
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold]);

  return { onTouchStart, onTouchEnd };
}

export function usePullToRefresh(onRefresh: () => void | Promise<void>, threshold = 80) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartRef = useRef<number | null>(null);
  const isRefreshingRef = useRef(false);

  const onTouchStart = useCallback((e: TouchEvent | React.TouchEvent) => {
    if (window.scrollY === 0) { // Only allow pull-to-refresh at top of page
      const touch = e.touches[0];
      touchStartRef.current = touch.clientY;
      setIsPulling(true);
    }
  }, []);

  const onTouchMove = useCallback((e: TouchEvent | React.TouchEvent) => {
    if (!touchStartRef.current || !isPulling || isRefreshingRef.current) return;

    const touch = e.touches[0];
    const deltaY = touch.clientY - touchStartRef.current;

    if (deltaY > 0 && window.scrollY === 0) {
      e.preventDefault(); // Prevent default scroll behavior
      setPullDistance(Math.min(deltaY, threshold * 1.5)); // Cap at 1.5x threshold
    }
  }, [isPulling, threshold]);

  const onTouchEnd = useCallback(async () => {
    if (!isPulling || isRefreshingRef.current) return;

    if (pullDistance >= threshold) {
      isRefreshingRef.current = true;
      try {
        await onRefresh();
      } finally {
        isRefreshingRef.current = false;
      }
    }

    setIsPulling(false);
    setPullDistance(0);
    touchStartRef.current = null;
  }, [isPulling, pullDistance, threshold, onRefresh]);

  return {
    isPulling,
    pullDistance,
    isTriggered: pullDistance >= threshold,
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
}

export function useHapticFeedback() {
  const vibrate = useCallback((pattern: number | number[] = 10) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }, []);

  const lightTap = useCallback(() => vibrate(5), [vibrate]);
  const mediumTap = useCallback(() => vibrate(10), [vibrate]);
  const heavyTap = useCallback(() => vibrate(20), [vibrate]);
  const doubleTap = useCallback(() => vibrate([5, 50, 5]), [vibrate]);
  const success = useCallback(() => vibrate([10, 100, 10]), [vibrate]);
  const error = useCallback(() => vibrate([20, 100, 20, 100, 20]), [vibrate]);

  return {
    vibrate,
    lightTap,
    mediumTap,
    heavyTap,
    doubleTap,
    success,
    error
  };
}