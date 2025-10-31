import React, { useState, useEffect, useRef, useCallback } from 'react';

interface RevolvingCarouselProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

const RevolvingCarousel = <T extends { id: string }>({ items, renderItem }: RevolvingCarouselProps<T>) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const scroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth, firstChild } = scrollRef.current;
      const itemWidth = (firstChild as HTMLElement)?.offsetWidth || 250;
      let newScrollLeft = scrollLeft + itemWidth + 24; // 24 is the gap
      
      if (newScrollLeft >= scrollWidth - clientWidth) {
        // When it reaches the end, smoothly scroll back to the start
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
      }
    }
  }, []);

  const startScrolling = useCallback(() => {
    intervalRef.current = setInterval(scroll, 3000);
  }, [scroll]);

  const stopScrolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  useEffect(() => {
    if (!isHovering) {
      startScrolling();
    } else {
      stopScrolling();
    }
    return () => stopScrolling();
  }, [isHovering, startScrolling, stopScrolling]);

  if (!items || items.length === 0) {
    return null;
  }

  // Duplicate items to create a seamless loop illusion for small lists
  const displayItems = items.length > 0 && items.length < 10 ? [...items, ...items, ...items] : items;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar space-x-6 py-4"
      >
        {displayItems.map((item, index) => (
          <div key={`${item.id}-${index}`} className="snap-start shrink-0 w-64">
            {renderItem(item)}
          </div>
        ))}
      </div>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default RevolvingCarousel;
