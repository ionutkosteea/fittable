import { Theme } from 'fittable-core/view-model/index.js';

import { toSvgUrl } from '../../image-registry/fit-images.js';
import { cssVariables } from './css-variables.js';
import { images } from './images.js';

export const darkTheme: Theme = {
  cssVariables,
  images: toSvgUrl(images),
};
