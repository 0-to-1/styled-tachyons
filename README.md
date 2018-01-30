# styled-tachyons

Utilities for styled-components.

Inspired by and based on
[tachyons-components](https://github.com/jxnblk/tachyons-components), but using
styled-components instead of making styled-components like API.

## Examples

```js
// tachyons/index.js
import { white, bg_green } from 'tachyons/library.json';

export const color_primary = white;
export const bg_primary = bg_green;
```

```js
// components file
import styled from 'styled-components';
import {
  f6,
  link,
  dim,
  br3,
  ph3,
  pv2,
  mb2,
  dib,
  pointer
} from 'tachyons/library.json';
import { color_primary, bg_primary } from 'tachyons';

const Button = styled.button`
  ${f6};
  ${link};
  ${dim};
  ${br3};
  ${ph3};
  ${pv2};
  ${mb2};
  ${dib};
  ${pointer};
  ${color_primary};
  ${bg_primary};
`;

export default Button;
```
