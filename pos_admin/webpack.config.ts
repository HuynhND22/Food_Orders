import * as path from 'path';
import { Configuration } from 'webpack';

const config: Configuration = {
  // Các cài đặt khác của webpack ở đây
  
  resolve: {
    fallback: {
      path: require.resolve("path-browserify"),
    },
  },
};

export default config;
