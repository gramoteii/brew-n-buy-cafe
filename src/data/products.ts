
export * from './products/index';
export * from './translations/sizes';
export * from './additions';

// Re-export the products array directly to maintain backward compatibility
import { products } from './products/index';
export { products };
