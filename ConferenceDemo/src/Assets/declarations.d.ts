/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

declare module "*.svg" {
  import React from 'react';
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}