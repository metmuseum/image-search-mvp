import React from 'react';
import PropTypes from 'prop-types';

const SavedObject = ({
	objectNumber,
	objectTitle,
	primaryImageSmall,
	handleNewActiveObject
}) => (
	<div
		className="saved-object"
		role="button"
		tabIndex={0}
		onClick={() => handleNewActiveObject(objectNumber)}
		onKeyDown={e => e.key === 'Enter' && handleNewActiveObject(objectNumber)}>
		{primaryImageSmall && (
			<img
				src={primaryImageSmall}
				alt={objectTitle}
				className="saved-object__image"
			/>
		)}
		<div
			className="saved-object__name"
			dangerouslySetInnerHTML={{ __html: objectTitle }}
		/>
	</div>
);

SavedObject.propTypes = {
	objectNumber: PropTypes.number,
	objectTitle: PropTypes.string,
	primaryImageSmall: PropTypes.string,
	handleNewActiveObject: PropTypes.func
};

export default SavedObject;
