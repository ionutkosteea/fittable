import { Theme } from 'fit-core/view-model/index.js';

import { cssColorVariables } from '../../common/css-variables.js';
import { defaultImages, toSvgUrl } from '../../image-registry/fit-images.js';

export const lightTheme: Theme = {
  cssVariables: cssColorVariables,
  images: toSvgUrl(defaultImages),
};
