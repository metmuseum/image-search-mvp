import React from 'react';
import PropTypes from 'prop-types';

const ActiveObject = ({ object, handleSavedObjectChange, savedObjects }) => (
	<div className="active-object">
		<div>
			<div className="active-object__title-box">
				<div className="active-object__titles">
					<h1
						className="active-object__header"
						dangerouslySetInnerHTML={{ __html: object.title }}
					/>
					<h2 className="active-object__artist">{object.artistDisplayName}
						{object.artistDisplayBio && (
							<span className="active-object__display-bio">
								({object.artistDisplayBio})
							</span>
						)}
					</h2>
				</div>
				<div className="active-object__buttons">
					{savedObjects[object.objectID] ? (
						<button
							onClick={handleSavedObjectChange}
							onKeyDown={e => e.key === 'Enter' && handleSavedObjectChange}
							className="active-object__button active-object__button--remove button button--ghost"
							type="submit">
							Remove
						</button>
					) : (
						<button
							onClick={handleSavedObjectChange}
							onKeyDown={e => e.key === 'Enter' && handleSavedObjectChange}
							className="active-object__button active-object__button--save button button--primary"
							type="submit">
							Save &#9829;
						</button>
					)}
					<a
						href={object.objectURL}
						target="_blank"
						rel="noreferrer"
						className="button button--tertiary">
						View Object Page
					</a>
				</div>
			</div>
			{object.primaryImageSmall && object.additionalImages && (
				<div className="active-object__image-container">
					<div className="active-object__images" draggable="true">
						<img
							crossorigin
							src={object.primaryImageSmall}
							className="active-object__image active-object__image--multiple"
							alt={object.objectName}
						/>
						{object.additionalImages.map(additionalImage => {
							const smallImage = additionalImage.replace(
								'original',
								'web-large'
							);
							return (
								<img
									crossorigin
									key={smallImage}
									src={smallImage}
									loading="lazy"
									className="active-object__image active-object__image--multiple"
									alt={object.objectName}
								/>
							);
						})}
					</div>
				</div>
			)}
			{object.primaryImageSmall && !object.additionalImages && (
				<img
					crossorigin
					src={object.primaryImageSmall}
					className="active-object__image"
					alt={object.objectName}
				/>
			)}
			<div>
				<div className="active-object__info">
					<span className="active-object__key">Name: </span>
					<span
						className="active-object__value"
						dangerouslySetInnerHTML={{ __html: object.objectName }}
					/>
				</div>
				{object.artistRole && object.artistDisplayName && (
					<div className="active-object__info">
						<span className="active-object__key">{object.artistRole}: </span>
						<span className="active-object__value">
							{object.artistDisplayName}
						</span>
					</div>
				)}
				<div className="active-object__info">
					<span className="active-object__key">Department: </span>
					<span className="active-object__value">{object.department}</span>
				</div>

				<div className="active-object__info">
					<span className="active-object__key">Medium: </span>
					<span className="active-object__value">{object.medium}</span>
				</div>

				<div className="active-object__info">
					<span className="active-object__key">Accession Number: </span>
					<span className="active-object__value">{object.accessionNumber}</span>
				</div>

				<div className="active-object__info">
					<span className="active-object__key">Accession Year: </span>
					<span className="active-object__value">{object.accessionYear}</span>
				</div>
			</div>

			<div className="active-object__info">
				<span className="active-object__key">
					<a
						target="_blank"
						className="active-object__link"
						href={object.primaryImage}
						rel="noreferrer">
						View High Resolution Image
					</a>
				</span>
			</div>

		</div>
	</div>
);

ActiveObject.propTypes = {
	savedObjects: PropTypes.object,
	object: PropTypes.object,
	handleSavedObjectChange: PropTypes.func
};

export default ActiveObject;
