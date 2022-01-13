import React from 'react';
import PropTypes from 'prop-types';

const CollectionItem = ({
	collectionName,
	collectionLength,
	handleSelectCollection,
	removeCollection
}) => (
	<li className="collection-item">
		<button
			type="button"
			className="collection-item__button"
			onClick={() => handleSelectCollection(collectionName)}
			onKeyDown={e =>
				e.key === 'Enter' && handleSelectCollection(collectionName)
			}>
			<span className="collection-item__title">{collectionName}</span>
			<span className="collection-item__count">
				({collectionLength} objects)
			</span>
		</button>
		<button
			type="button"
			className="collection-item__button-remove"
			onClick={() => removeCollection(collectionName)}
			onKeyDown={e => e.key === 'Enter' && removeCollection(collectionName)}>
			<span role="img" aria-label="Close Icon">✖️</span>
		</button>
	</li>
);

CollectionItem.propTypes = {
	removeCollection: PropTypes.func,
	handleSelectCollection: PropTypes.func,
	collectionLength: PropTypes.number,
	collectionName: PropTypes.string
};

export default CollectionItem;
