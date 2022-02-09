/*
 * Copyright (c) 2011-2022, Zingaya, Inc. All rights reserved.
 */

import { globalActions } from "./actionTypes"

export const toggleLoading = () => ({
  type: globalActions.TOGGLE_LOADING,
})

export const resetState = () => ({
  type: globalActions.RESET_STATE,
})

export const clearErrors = () => ({
  type: globalActions.CLEAR_ERRORS,
})
