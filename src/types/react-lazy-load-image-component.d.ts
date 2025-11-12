declare module 'react-lazy-load-image-component' {
  import { ComponentType, ImgHTMLAttributes } from 'react';

  export interface LazyLoadImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt?: string;
    effect?: string;
    placeholder?: React.ReactNode;
    wrapperClassName?: string;
    wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
    scrollPosition?: { x: number; y: number };
    visibleByDefault?: boolean;
    delayMethod?: 'throttle' | 'debounce';
    delayTime?: number;
    threshold?: number;
    useIntersectionObserver?: boolean;
    onLoad?: () => void;
    onError?: () => void;
    beforeLoad?: () => void;
    afterLoad?: () => void;
  }

  export const LazyLoadImage: ComponentType<LazyLoadImageProps>;
  
  export default LazyLoadImage;
}

