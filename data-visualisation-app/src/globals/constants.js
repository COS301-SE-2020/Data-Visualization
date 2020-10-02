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
import { Close } from '@styled-icons/evil/Close';
import { ErrorCircle } from '@styled-icons/boxicons-solid/ErrorCircle';
import { Spin } from 'antd';

export const SPACING_BUTTON = 9;

/**
 *   Images
 */
export const APPLICATION_LOGO = require('../assets/img/logo.png');
export const APPLICATION_LOGO_H = require('../assets/img/logo_vlong_s.png');
export const APPLICATION_LOGO_WHITE = require('../assets/img/logo_white.png');
export const APPLICATION_LOGO_GREY = require('../assets/img/logo_grey.png');
export const APPLICATION_LOGO_GLOW = require('../assets/img/logo_glow.png');

/**
 *   Icons
 */
export const ICONS = {
	CLOSE: <Close size={20} />,
	ERROR: <ErrorCircle />,
};

export const LOADER = <Spin />;

/**
 *   Server Constants.
 */
export const PRODUCTION_MODE = process.env.NODE_ENV && process.env.NODE_ENV === 'development' ? 0 : process.env.NODE_ENV === 'production' ? 1 : 2;
// export const PRODUCTION_MODE = true;
// console.debug('Production mode set to: ', PRODUCTION_MODE);

export const URL_HOST = {
	PRODUCTION: 'https://data-visualisation-prod.herokuapp.com',
	STAGING_DEV: 'https://data-visualisation-dev.herokuapp.com',
	LOCALHOST: 'http://localhost:8000'
};

export const URL_HOST_DEFAULT = PRODUCTION_MODE === 0 ? URL_HOST.LOCALHOST : PRODUCTION_MODE === 1 ? URL_HOST.PRODUCTION : URL_HOST.STAGING_DEV;

export const URL_ROOT = {
	USER: URL_HOST_DEFAULT + '/users',
	DASHBOARD: URL_HOST_DEFAULT + '/dashboards',
	DATASOURCE: URL_HOST_DEFAULT + '/datasource',
	GRAPH: URL_HOST_DEFAULT + '/graphs',
	SUGGESTIONS: URL_HOST_DEFAULT + '/suggestions',
};

/**
 *   URL Constants.
 *
 *   @details Each endpoint of the API is specified inside this object and serves as the only source of truth
 *            in terms of the possible URL's. Therefore, all requests should be done with only the URL's defined
 *            within this object.
 */
export const URL = {
	USER: {
		LOGIN: URL_ROOT.USER + '/login',
		REGISTER: URL_ROOT.USER + '/register',
		LOGOUT: URL_ROOT.USER + '/logout',
	},
	DATASOURCE: {
		LIST: URL_ROOT.DATASOURCE + '/src/list',
		ADD: URL_ROOT.DATASOURCE + '/src/add',
		REMOVE: URL_ROOT.DATASOURCE + '/src/remove',
		ENTITIES:  URL_ROOT.DATASOURCE + '/meta/entities',
		FIELDS:  URL_ROOT.DATASOURCE + '/meta/fields',
	},
	DASHBOARD: {
		LIST: URL_ROOT.DASHBOARD + '/list',
		ADD: URL_ROOT.DASHBOARD + '/add',
		REMOVE: URL_ROOT.DASHBOARD + '/remove',
		UPDATE: URL_ROOT.DASHBOARD + '/update',
	},
	GRAPH: {
		LIST: URL_ROOT.GRAPH + '/list',
		ADD: URL_ROOT.GRAPH + '/add',
		REMOVE: URL_ROOT.GRAPH + '/remove',
		UPDATE: URL_ROOT.GRAPH + '/update',
	},
	SUGGESTIONS: {
		SET: URL_ROOT.SUGGESTIONS + '/params',
		CHART: URL_ROOT.SUGGESTIONS + '/graphs',
		GRAPHS: URL_ROOT.SUGGESTIONS + '/graphs',
	},
};

/**
 *   Response Codes.
 *
 *   @details A response code identifies a response of a certain event with an associated behavior. For example, if
 *            the user is not logged in then the appropriate object within RESPONSE_CODES can be returned that will
 *            contain the message that should be displayed along with other necessary elements.
 */
export const RESPONSE_CODES = {
	NETWORK_ERROR: {
		id: 0,
		color: 'red',
		description: 'A network error has occurred.',
		icon: ICONS.ERROR,
	},
	BAD_REQUEST_NETWORK_ERROR: {
		id: 1,
		color: 'red',
		description: 'Requested page is not found.',
		icon: ICONS.ERROR,
	},
	LOGGED_OUT_ERROR: {
		id: 2,
		color: 'red',
		description: 'You\'re not current logged in.',
		icon: ICONS.ERROR,
	},
	SUCCESS: {
		id: 3,
		color: 'red',
		description: 'Operation successful.',
		icon: ICONS.ERROR,
	},
	ERROR: {
		id: 4,
		color: 'red',
		description: 'An error has occured.',
		icon: ICONS.ERROR,
	},
};

export const CHART_TYPES = {
	LINE: 'line',
	BAR: 'bar',
	PIE: 'pie',
	SCATTER: 'scatter'
};

export const EDITCHART_MODES = {
	EDIT: 1,
	CREATE: 2
};
