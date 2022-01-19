import React from 'react';
import PropTypes from 'prop-types';
import "@metmuseum/marble/src/components/notification-banner/notification-banner.scss"; // 😬

const NotificationBanner = ({
	mode="productive",
	backgroundColor="#fff",
	children,
	header="",
	textColor="#333",
	description,
	link={
		text: "",
		url: ""
	}
}) => {
	return (<section
		className={`notification-banner notification-banner--${mode}`}
		style={{color: textColor, backgroundColor}}>
		<h2 className="notification-banner__header">{header}</h2>
		<div className="notification-banner__body">
			<div className="notification-banner__subtext">{description}</div>
			<a href={link.url} className="notification-banner__link" onClick={link.handleOnClick}>{link.text}</a>
			{children}
		</div>
	</section>);
};

NotificationBanner.propTypes = {
	backgroundColor: PropTypes.string,
	textColor: PropTypes.string,
	// link: PropTypes.shape,// url, text, handleOnClick
	// header,
	// textColor
	// description
}

export default NotificationBanner;