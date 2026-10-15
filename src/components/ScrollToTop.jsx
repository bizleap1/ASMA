import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// In-memory cache for scroll positions by history entry key
const scrollPositions = new Map();

const ScrollToTop = () => {
  const location = useLocation();
  const navigationType = useNavigationType(); // 'PUSH' | 'POP' | 'REPLACE'
  const prevKeyRef = useRef(location.key);
  const prevPathRef = useRef(location.pathname);
  const isInitialMountRef = useRef(true);

  // Set browser scrollRestoration to manual so native jumps do not conflict
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Save current scroll coordinates
  const saveCurrentScroll = () => {
    if (typeof window === 'undefined') return;
    const x = window.scrollX || document.documentElement.scrollLeft || 0;
    const y = window.scrollY || document.documentElement.scrollTop || 0;

    const path = window.location.pathname;
    if (path) {
      try {
        sessionStorage.setItem('scroll_pos_' + path, JSON.stringify({ x, y, time: Date.now() }));
      } catch {}
    }

    if (prevKeyRef.current) {
      scrollPositions.set(prevKeyRef.current, { x, y });
      try {
        sessionStorage.setItem('scroll_key_' + prevKeyRef.current, JSON.stringify({ x, y }));
      } catch {}
    }
  };

  // Continuously record scroll coordinates as the user scrolls & before unload
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          saveCurrentScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('beforeunload', saveCurrentScroll);
    window.addEventListener('pagehide', saveCurrentScroll);

    return () => {
      saveCurrentScroll();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', saveCurrentScroll);
      window.removeEventListener('pagehide', saveCurrentScroll);
    };
  }, []);

  // Handle route navigation & reload restoration
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isInitialMount = isInitialMountRef.current;
    isInitialMountRef.current = false;

    // Detect if this page load is a browser reload (F5 / Refresh)
    const isReload = (() => {
      try {
        const navEntries = window.performance?.getEntriesByType?.('navigation');
        if (navEntries && navEntries.length > 0) {
          return navEntries[0].type === 'reload';
        }
        return window.performance?.navigation?.type === 1;
      } catch {
        return false;
      }
    })();

    // Update active refs
    prevKeyRef.current = location.key;
    prevPathRef.current = location.pathname;

    // 1. Hash link navigation (e.g. #section-2)
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 50);
        return;
      }
    }

    // 2. Browser Reload OR History POP (Back/Forward): Restore saved position
    if (isReload || navigationType === 'POP' || (isInitialMount && navigationType !== 'PUSH')) {
      let saved = scrollPositions.get(location.key);

      if (!saved) {
        try {
          const item = sessionStorage.getItem('scroll_key_' + location.key);
          if (item) saved = JSON.parse(item);
        } catch {}
      }

      // Fallback to path-based storage on reload / direct visit
      if (!saved || (saved.y === 0 && saved.x === 0)) {
        try {
          const pathItem = sessionStorage.getItem('scroll_pos_' + location.pathname);
          if (pathItem) saved = JSON.parse(pathItem);
        } catch {}
      }

      if (saved && (saved.y > 0 || saved.x > 0)) {
        const prevBehavior = document.documentElement.style.scrollBehavior;
        document.documentElement.style.scrollBehavior = 'auto';

        const targetY = saved.y;
        const targetX = saved.x;
        let isCancelled = false;
        const startTime = Date.now();
        const maxDurationMs = 1800; // Keep attempting while images/layout render

        const cancel = () => {
          isCancelled = true;
          window.removeEventListener('wheel', cancel);
          window.removeEventListener('touchstart', cancel);
          window.removeEventListener('keydown', cancel);
        };

        window.addEventListener('wheel', cancel, { once: true, passive: true });
        window.addEventListener('touchstart', cancel, { once: true, passive: true });
        window.addEventListener('keydown', cancel, { once: true, passive: true });

        const tryScroll = () => {
          if (isCancelled) {
            document.documentElement.style.scrollBehavior = prevBehavior;
            return;
          }

          window.scrollTo(targetX, targetY);
          if (document.documentElement) {
            document.documentElement.scrollTop = targetY;
            document.documentElement.scrollLeft = targetX;
          }
          if (document.body) {
            document.body.scrollTop = targetY;
            document.body.scrollLeft = targetX;
          }

          const actualY = window.scrollY || document.documentElement.scrollTop || 0;
          const isClose = Math.abs(actualY - targetY) < 10;
          const isTimeout = Date.now() - startTime > maxDurationMs;

          if (isClose || isTimeout) {
            window.removeEventListener('wheel', cancel);
            window.removeEventListener('touchstart', cancel);
            window.removeEventListener('keydown', cancel);
            document.documentElement.style.scrollBehavior = prevBehavior;
            return;
          }

          requestAnimationFrame(tryScroll);
        };

        tryScroll();

        // Staggered checkpoints as images and layout load
        const t1 = setTimeout(tryScroll, 60);
        const t2 = setTimeout(tryScroll, 180);
        const t3 = setTimeout(tryScroll, 400);

        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
          clearTimeout(t3);
          cancel();
          document.documentElement.style.scrollBehavior = prevBehavior;
        };
      }
    }

    // 3. For deliberate link clicks (PUSH navigation to a new page): Scroll to top
    if (navigationType === 'PUSH') {
      try {
        sessionStorage.removeItem('scroll_pos_' + location.pathname);
      } catch {}

      const prevBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';

      window.scrollTo(0, 0);
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
        document.documentElement.scrollLeft = 0;
      }
      if (document.body) {
        document.body.scrollTop = 0;
        document.body.scrollLeft = 0;
      }

      const t1 = setTimeout(() => {
        window.scrollTo(0, 0);
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
      }, 10);

      const t2 = setTimeout(() => {
        window.scrollTo(0, 0);
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
        document.documentElement.style.scrollBehavior = prevBehavior;
      }, 60);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        document.documentElement.style.scrollBehavior = prevBehavior;
      };
    }
  }, [location.key, location.pathname, location.search, location.hash, navigationType]);

  return null;
};

export default ScrollToTop;