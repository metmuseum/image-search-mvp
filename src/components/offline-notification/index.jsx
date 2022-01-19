import React, { useState, useEffect } from 'react';
import NotificationBanner from "../marble/notification-banner";
import "./offline-notification.scss";

export default () => {
	const [isOnline, setIsOnline] = useState(navigator.onLine);
	const setOnline = () => {
		console.log('We are online!');
		setIsOnline(true);
	};
	const setOffline = () => {
		console.log('We are offline!');
		setIsOnline(false);
	};

	// Register the event listeners
	useEffect(() => {
		window.addEventListener('offline', setOffline);
		window.addEventListener('online', setOnline);

		// cleanup if we unmount
		return () => {
			window.removeEventListener('offline', setOffline);
			window.removeEventListener('online', setOnline);
		}
	}, []);

	if (isOnline) {
		return ""
	} else {
		return (<div className="offline-notification">
			<NotificationBanner
				backgroundColor="beige"
				header="Your are currently offline"
				description="Can't access the internet. Don't worry, you can still see your collection."
			/>
		</div>)

	}
}