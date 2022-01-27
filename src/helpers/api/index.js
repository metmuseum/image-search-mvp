const searchAPI = 'https://collectionapi.metmuseum.org/public/collection/v1/search?isOnView=true?q=';
const objectAPI = 'https://collectionapi.metmuseum.org/public/collection/v1/objects/';

const fetchObjects = async objectID => {
	const objects = await fetch(`${objectAPI}${objectID}`)
		.then(response => response.json())
		.catch(err => console.error(`Couldn't hit API`, err));
	return objects || null;
};

export { searchAPI, objectAPI, fetchObjects }