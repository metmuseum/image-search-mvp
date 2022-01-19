import React from 'react';
import PropTypes from 'prop-types';
import "@metmuseum/marble/src/components/notification-banner/notification-banner.scss"; // 😬

const NotificationBanner = ({
	backgroundColor="#fff",
	header="",
	textColor="#333",
	description,
	link={}
}) => {
	return (<section
		className={`notification-banner`}
		style={{color: textColor, backgroundColor}}>
		<h2 className="notification-banner__header">{header}</h2>
		<div className="notification-banner__body">
			<div className="notification-banner__subtext">{description}</div>
			<a href={link.url} className="notification-banner__link">{link.text}</a>
		</div>
	</section>);
};

NotificationBanner.propTypes = {
	backgroundColor: PropTypes.string,
	textColor: PropTypes.string,
	// link: PropTypes.shape,// url, text,
	// header,
	// textColor
	// description
}

export default NotificationBanner;