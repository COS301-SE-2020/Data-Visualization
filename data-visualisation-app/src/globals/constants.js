/**
 *   @file constants.js
 *   Project: Data Visualisation Generator
 *   Copyright: Open Source
 *   Organisation: Doofenshmirtz Evil Incorporated
 *
 *   Update History:
 *   Date        Author              Changes
 *   -------------------------------------------------------
 *   3/7/2929   Gian Uys            Original
 *
 *   Test Cases: data-visualisation-app/tests/App/App.js
 *
 *   Functional Description:
 *   This file declares all constants used throughout the project and serves as the only source of truth. Therefore,
 *   no other images, icons, colors, etc. should be used that is not declared inside this file.
 *
 *   Error Messages: "Error"
 *   Assumptions: None
 *   Constraints: None
 */

import React from 'react';
import {Close} from '@styled-icons/evil/Close';
import {ErrorCircle} from '@styled-icons/boxicons-solid/ErrorCircle';
import { Spin } from 'antd';


export const SPACING_BUTTON = 9;

/**
 *   Images
 */
export const APPLICATION_LOGO = require('../assets/img/logo.png');
export const APPLICATION_LOGO_H = require('../assets/img/logo_vlong_s.png');

/**
 *   Icons
 */
export const ICONS = {
    CLOSE: <Close/>,
    ERROR: <ErrorCircle/>
}

export const LOADER = <Spin/>;

/**
 *   Server Constants
 */
export const PRODUCTION = process.env.NODE_ENV && process.env.NODE_ENV === 'production' ? true : false;
export const URL = {
    production: 'https://data-visualisation-prod.herokuapp.com',
    development: 'https://data-visualisation-dev.herokuapp.com',
    localhost: 'http://localhost:8000'
};

/**
 *   Response Codes
 */
export const RESPONSE_CODES = {
    NETWORK_ERROR: {
        id: 0,
        color: 'red',
        description: 'A network error has occurred.',
        icon: ICONS.ERROR
    },
    BAD_REQUEST_NETWORK_ERROR: {
        id: 0,
        color: 'red',
        description: 'Requested page is not found.',
        icon: ICONS.ERROR
    },
    LOGGED_OUT_ERROR: {
        id: 1,
        color: 'red',
        description: 'You\'re not current logged in.',
        icon: ICONS.ERROR
    },
    SUCCESS: {
        id: 2,
        color: 'red',
        description: 'Operation successful.',
        icon: ICONS.ERROR
    }
};