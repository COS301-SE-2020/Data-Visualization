import React, {createContext, useReducer} from 'react';


const defaultGlobalState = {
	isLoggedIn : false,
	dataSources : [
			{
				'id': 9999,
				'email': 'doofenshmirtz.evil.inc.cos@gmail.com',
				'sourceurl': 'https://services.odata.org/V2/Northwind/Northwind.svc',
				'sourcetype': 0,
				'sourcename': 'Northwind',
				'islivedata': false,
			}
		],
	num: 2,
};

const globalStateContext = createContext(defaultGlobalState);
const dispatchStateContext = createContext(undefined);

const GlobalStateProvider  = ({ children }) => {
  const [state, dispatch] = useReducer(
	(state, newValue) => ({ ...state, ...newValue }),
	defaultGlobalState
  );
  return (
	<globalStateContext.Provider value={state}>
	  <dispatchStateContext.Provider value={dispatch}>
		{children}
	  </dispatchStateContext.Provider>
	</globalStateContext.Provider>
  );
};

export const useGlobalState = () => [
	React.useContext(globalStateContext),
	React.useContext(dispatchStateContext)
];
export default GlobalStateProvider ;



