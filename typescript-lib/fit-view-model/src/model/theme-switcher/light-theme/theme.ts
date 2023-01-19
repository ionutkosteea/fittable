import { Theme } from 'fit-core/view-model/index.js';

import { FIT_CSS_COLOR_VARIABLES } from '../../common/css-variables.js';
import { FIT_IMAGES, toSvgUrl } from '../../image-registry/fit-images.js';

export const lightTheme: Theme = {
  cssVariables: FIT_CSS_COLOR_VARIABLES,
  images: toSvgUrl(FIT_IMAGES),
};
