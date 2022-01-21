import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { fetchObjects } from "./helpers/api";

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('app')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register({
	onSuccess: registration => {
		console.log("registration is:", registration)
		const savedObjects = JSON.parse(localStorage.getItem('savedObjects')) || {};
		console.log("running ensureSavedObjectsCache for:", savedObjects)
		Object.keys(savedObjects).forEach(id => fetchObjects(id))
	}
});


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


