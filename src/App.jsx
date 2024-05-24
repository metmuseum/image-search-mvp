import React, { useState, useEffect } from 'react';
import ActiveObject from './components/active-object';
import SavedObject from './components/saved-object';
import CollectionItem from './components/collection-item';
import ImageInput from './components/image-input';
import defaultObject from './helpers/defaultObjectModel';
import SearchInput from "./components/search-input";
import OfflineNotification from "./components/offline-notification";
import { searchAPI, fetchObjects } from "./helpers/api";
import Hashids from "hashids";
import './app.scss';

const url = new URL(`${window.location}`);
const params = new URLSearchParams(url.search.slice(1));

// const AZURE_API_TEXT = "http://TBD.com/searchByText"

const hashids = new Hashids()
let abortController = null;

const App = () => {
	const objectsGridRef = React.createRef();
	const collectionsRef = React.createRef();
	const objectSearchRef = React.createRef();

	const [sharableURL, setSharableURL] = useState();
	const [sharableURLCurrent, setSharableURLCurrent] = useState(false);

	const [searchQuery, setSearchQuery] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	const [activeCollectionName, setActiveCollectionName] = useState('');
	const [editingExistingCollection, setEditingExistingCollection] = useState(false);
	const [collections, setCollections] = useState(
		JSON.parse(localStorage.getItem('collections')) || {}
	);
	const [savedObjects, setSavedObjects] = useState(
		JSON.parse(localStorage.getItem('savedObjects')) || {}
	);
	const [activeObject, setActiveObject] = useState(
		Object.keys(savedObjects).length ? savedObjects[Object.keys(savedObjects)[0]] : defaultObject
	);

	const setURL = () => {
		const ids = Object.keys(savedObjects)
			.map(id => hashids.encode(id))
			.join("_")
		if (ids.length) {
			params.set('o', ids);
			setSharableURL(`${url.origin}?${params}`);
		} else {
			setSharableURL(null);
		}
	};


	const fetchAndSave = async objectID => {
		const newObject = await fetchObjects(objectID);
		const storedSavedObjects = JSON.parse(localStorage.getItem('savedObjects'));
		let { title, primaryImageSmall } = newObject;
		storedSavedObjects[newObject.objectID] = { title, primaryImageSmall };
		setSavedObjects(prevData => ({...prevData, ...storedSavedObjects}));
	};

	const handleNewActiveObject = async objectID => {
		document.querySelector('body').scrollIntoView({
			behavior: 'smooth'
		});
		const newActiveObject = await fetchObjects(objectID);
		setActiveObject(newActiveObject);
	};

	const handleSearch = event => {
		searchObjects(event.target.value);
	}

	const callSearchAPI = async query => {
		abortController && abortController.abort();
		abortController = new AbortController();
		if (query !== searchQuery) {
			setSearchQuery(query);
		}

		// update here: AZURE_API_TEXT
		const request = await fetch(`${searchAPI}${query}`, { signal: abortController.signal });
		const response = await request.json();
		if (response.objectIDs) {
			setErrorMessage(null);
			const newObject = response.objectIDs[0];
			handleNewActiveObject(newObject);
		} else if (query.length > 0) {
			setErrorMessage("No objects on view match your query");
		} else {
			setErrorMessage(null);
		}
	};

	const searchObjects = async query => {
		try {
			await callSearchAPI(query);
		} catch (e) {
			console.warn(e);
		} finally {
			abortController = null;
		}
	}

	const handleSaveObject = () => {
		const newObject = {
			title: activeObject.title,
			primaryImageSmall: activeObject.primaryImageSmall
		};

		const tempObjectsRef = JSON.parse(localStorage.getItem('savedObjects')) || {};
		tempObjectsRef[activeObject.objectID] = newObject;
		setSavedObjects(tempObjectsRef);
	};

	const handleRemoveObject = () => {
		const tempObjectsRef = JSON.parse(localStorage.getItem('savedObjects')) || {};
		delete tempObjectsRef[activeObject.objectID];
		setSavedObjects(tempObjectsRef);
	};

	const clearSavedObjects = () => {
		setActiveCollectionName('');
		setSavedObjects({});
	};

	const handleSavedObjectChange = () => {
		document.activeElement.blur();

		if (savedObjects[activeObject.objectID]) {
			handleRemoveObject();
		} else {
			handleSaveObject();
		}
	};

	const scrollToRef = ref => {
		ref.current.scrollIntoView({
			block: 'start',
			behavior: 'smooth'
		});
	};

	const copyURLtoClipboard = () => {
		navigator.clipboard.writeText(sharableURL);
		setSharableURLCurrent(true);
	};

	const createCollection = (
		newName = activeCollectionName,
		objects = savedObjects
	) => {
		const tempCollectionRef = JSON.parse(localStorage.getItem('collections'));
		const collectionObjects = objects;
		const newCollection = {
			collectionObjects
		};

		tempCollectionRef[newName] = newCollection;
		setCollections(tempCollectionRef);
		setEditingExistingCollection(true);
	};

	const removeCollection = collectionName => {
		const tempCollectionRef = JSON.parse(localStorage.getItem('collections'));
		delete tempCollectionRef[collectionName];
		setCollections(tempCollectionRef);
	};

	const saveCollectionToNewName = (count = 1) => {
		const newCollectionName = count === 1 ? 'Unnamed Collection' : `Unnamed Collection ${count}`;
		if (newCollectionName in collections) {
			saveCollectionToNewName(count + 1);
		} else {
			createCollection(newCollectionName);
		}
	};

	const handleSelectCollection = collectionName => {
		if (!activeCollectionName) {
			saveCollectionToNewName();
		}
		const newSavedObjects = collections[collectionName].collectionObjects;
		setActiveCollectionName(collectionName);
		setSavedObjects(newSavedObjects);

		if (Object.keys(newSavedObjects)[0]) {
			handleNewActiveObject(Object.keys(newSavedObjects)[0]);
		}
	};

	const handleDataFromURL = objectsFromURL => {
		if (Object.keys(savedObjects).length) {
			saveCollectionToNewName();
			clearSavedObjects();
		}
		const arrayOfSavedObjectsFromURL = objectsFromURL.split("_").map(id => hashids.decode(id))

		arrayOfSavedObjectsFromURL.forEach(objectID => {
			fetchAndSave(objectID);
		});
	};

	useEffect(() => {
		// If savedObjects doesn't exist in localStorage, create it.
		if (localStorage.getItem('savedObjects') === null) {
			localStorage.setItem('savedObjects', {});
		}
		// Also Set Collections
		if (localStorage.getItem('collections') === null) {
			localStorage.setItem('collections', {});
		}
		// If there are obects in the URL, set SavedObjects to match.
		const objectsFromURL = params.get('o');
		if (objectsFromURL) {
			handleDataFromURL(objectsFromURL);
			params.delete(`o`);
			const newRelativePathQuery = window.location.pathname + '?' + params.toString();
			history.pushState(null, '', newRelativePathQuery);
		}
		//If there is an objectID in the URL load that object
		const objectToLookUp = params.get('object');
		if (objectToLookUp) {
			handleNewActiveObject(objectToLookUp);
		} else if (Object.keys(savedObjects).length > 0) {
			// Set Initial Object to one from the user's saved objects.
			handleNewActiveObject(Object.keys(savedObjects)[0]);
		}
	}, []);

	useEffect(() => {
		const isExistingName = Object.keys(collections).some(
			collection => collection === activeCollectionName
		);
		setEditingExistingCollection(isExistingName);
	}, [activeCollectionName]);

	useEffect(() => {
		if(activeObject.objectID) {
			const newParams = new URLSearchParams();
			newParams.set("object", activeObject.objectID);
			const newRelativePathQuery = window.location.pathname + '?' + newParams.toString();
			history.replaceState(null, '', newRelativePathQuery);
		}
	}, [activeObject.objectID]);

	useEffect(() => {
		localStorage.setItem('savedObjects', JSON.stringify(savedObjects));
		setURL();
		setSharableURLCurrent(false);
	}, [savedObjects]);

	useEffect(() => {
		localStorage.setItem('collections', JSON.stringify(collections));
	}, [collections]);

	return (
		<div className="object-search-app">
			<main className="main__section" ref={objectSearchRef}>
				<OfflineNotification />
				<div className="main__title-bar">
					<a
						tabIndex="0"
						className="main__title-link"
						onClick={() => scrollToRef(objectSearchRef)}
						onKeyDown={e => e.key === 'Enter' && scrollToRef(objectSearchRef)}
						role="button">
						<h1 className="main-title">Object Look Up</h1>
					</a>
				</div>
				<div className="object-search__section">
					<div className="object-search__inputs">
						<SearchInput
							value={searchQuery}
							onChange={handleSearch}
						/>
						<span>or</span>
						<ImageInput />
					</div>
					{errorMessage ?
						<div>
							{errorMessage}
						</div> :
						<ActiveObject
							savedObjects={savedObjects}
							object={activeObject}
							handleSavedObjectChange={handleSavedObjectChange}
						/>
					}
				</div>
			</main>
			<section className="sidebar">
				<div className="sidebar__title">
					<h1 className="saved-objects__header">
						<a
							tabIndex="0"
							className="sidebar__title-link"
							onClick={() => scrollToRef(objectsGridRef)}
							onKeyDown={e => e.key === 'Enter' && scrollToRef(objectsGridRef)}
							role="button">
							Saved Objects
						</a>
					</h1>
					{Object.keys(savedObjects).length !== 0 && (
						<button
							type="button"
							className="saved-objects__copy-link"
							onKeyDown={e => e.key === 'Enter' && clearSavedObjects}
							onClick={clearSavedObjects}>
							Clear Objects
						</button>
					)}
				</div>
				<div className="sidebar__section">
					<div className="collections__save-bar">
						<input
							className="collection-input"
							key="activeCollectionNameBar"
							placeholder="Collection Name"
							value={activeCollectionName}
							onKeyDown={e => e.key === 'Enter' && createCollection()}
							onChange={event => setActiveCollectionName(event.target.value)}
						/>
						<button
							type="button"
							className="button button--secondary collections__save-button"
							onClick={() => createCollection()}
							onKeyDown={e => e.key === 'Enter' && createCollection()}>
							{editingExistingCollection
								? 'Update Collection'
								: 'Save Collection'}
						</button>
					</div>
					<div className="saved-objects__grid" ref={objectsGridRef}>
						{Object.keys(savedObjects).map(savedObject => {
							return (
								<SavedObject
									key={savedObject}
									objectNumber={savedObject}
									handleNewActiveObject={handleNewActiveObject}
									objectTitle={savedObjects[savedObject].title}
									primaryImageSmall={savedObjects[savedObject].primaryImageSmall}
								/>
							);
						})}
					</div>
				</div>
				<div className="sidebar__title sidebar__title--collections">
					<h1 className="saved-objects__header">
						<a
							tabIndex="0"
							className="sidebar__title-link"
							onClick={() => scrollToRef(collectionsRef)}
							onKeyDown={e => e.key === 'Enter' && scrollToRef(collectionsRef)}
							role="button">
							Collections
						</a>
					</h1>
					{sharableURL && (
						<button
							type="button"
							className="saved-objects__copy-link"
							onKeyDown={e => e.key === 'Enter' && copyURLtoClipboard}
							onClick={copyURLtoClipboard}>
							{sharableURLCurrent ? 'Copied!' : 'Copy Collection Link'}
						</button>
					)}
				</div>
				<div className="sidebar__section">
					<div ref={collectionsRef}>
						<div>
							<ul className="collection-items">
								{Object.keys(collections).map(collection => {
									return (
										<CollectionItem
											key={collection}
											removeCollection={removeCollection}
											handleSelectCollection={handleSelectCollection}
											collectionLength={Object.keys(collections[collection].collectionObjects).length}
											collectionName={collection}
										/>
									);
								})}
							</ul>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default App;
