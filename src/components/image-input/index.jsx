import React, { useState } from 'react';
import App from '../../App';

const ImageInput = () => {
	const defaultButtonText = '📸';
	const [imageInputText, setImageInputText] = useState(defaultButtonText);

	const AZURE_API_IMAGE = "https://func-semantic-search.azurewebsites.net/api/SearchByImageStream"

	const resizeImage = imageFile => {
		console.log("Resizing")
		const reader = new FileReader();
		reader.onload = e => {
			const img = document.createElement('img');
			img.onload = () => {
				const MAX_WIDTH = 1000;
				const MAX_HEIGHT = 1000;

				let { width } = img;
				let { height } = img;

				// Change the resizing logic
				if (width > height) {
					if (width > MAX_WIDTH) {
						height *= MAX_WIDTH / width;
						width = MAX_WIDTH;
					}
				} else if (height > MAX_HEIGHT) {
					width *= MAX_HEIGHT / height;
					height = MAX_HEIGHT;
				}

				// Dynamically create a canvas element
				const canvas = document.createElement('canvas');
				canvas.width = width;
				canvas.height = height;
				// var canvas = document.getElementById("canvas");
				const ctx = canvas.getContext('2d');
				// Actual resizing
				ctx.drawImage(img, 0, 0, width, height);
				// canvas.toBlob(readImage);
				canvas.toBlob(postBlob, 'image/png');
			};
			img.src = e.target.result;
		};
		reader.readAsDataURL(imageFile);
	};

	const postBlob = async blob => {
		console.log("Uploading file...");
		const request = new XMLHttpRequest();
		const formData = new FormData();
	
		request.open("POST", AZURE_API_IMAGE, true);
		request.onreadystatechange = () => {
			if (request.readyState === 4 && request.status === 200) {
				const similarImages = JSON.parse(request.response)?.similarImages;
				App.setErrorMessage(null);
				const newObject = similarImages[0];
				App.handleNewActiveObject(newObject);
			}
		};
		formData.append("file", blob);
		request.send(formData);
	};
	
	

	// }

	const handleOnChange = e => {
		const file = e.target.files[0];
		if (file && file.type.includes('image')) {
			setImageInputText('Processing');
			resizeImage(file);
		}
	};

	return (
		<div className="image-input__container">
			<label
				htmlFor="image-input"
				className="image-input__label button button--secondary">
				<input
					onChange={handleOnChange}
					id="image-input"
					type="file"
					capture="environment"
					accept="image/jpeg,image/png"
					className="image-input__input"
				/>
				{imageInputText}
			</label>
		</div>
	);
};

// ImageInput.propTypes = {
// 	searchObjects: PropTypes.func
// };
export default ImageInput;
