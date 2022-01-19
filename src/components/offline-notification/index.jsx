import React, { useState, useEffect } from 'react';
import NotificationBanner from "../marble/notification-banner";
import "./offline-notification.scss";

export default () => {
	const [isOnline, setIsOnline] = useState(navigator.onLine);
	const [gotIt, setGotIt] = useState(false);

	const setOnline = () => {
		console.log('We are online!');
		setIsOnline(true);
	};

	const setOffline = () => {
		console.log('We are offline!');
		setIsOnline(false);
	};

	const handleGotIt = () => {
		setGotIt(true);
	}

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
		return "";
	} else if (gotIt) {
		return ""; // TODO: minimize to a lil "Offline" pill thing
	} else {
		return (<div className="offline-notification">
			<NotificationBanner
				mode=""
				backgroundColor="#FFD7C7"
				header="Your are currently offline"
				description="The app can't access the internet right now. Don't worry, you can still see your saved collections."
				link={{text: "Got it", url: "#", handleOnClick: handleGotIt}}
			/>
		</div>)
	}
}