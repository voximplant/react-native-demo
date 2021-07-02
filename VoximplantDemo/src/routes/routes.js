/*
 * Copyright (c) 2011-2021, Zingaya, Inc. All rights reserved.
 */

import * as React from 'react';

export const navigationRef = React.createRef();

export function navigate(name, params) {
    navigationRef.current?.navigate(name, params);
}

