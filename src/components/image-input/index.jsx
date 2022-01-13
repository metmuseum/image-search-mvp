import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createWorker } from 'tesseract.js';



const ImageInput = ({ searchObjects }) => {
	const [imageInputText, setImageInputText] = useState('Scan Accession #');
	const accessionRegex = /^[a-z]{0,4}?(.\d+(\.\d+)*$)/i;

	const worker = createWorker({
		logger: m => {
			console.log(m);
			let text = "Processing...";
			if (m.status === "recognizing text") {
				text += ` ${Math.floor(m.progress * 100)}%`;
			}
			setImageInputText(text);
		},
	});

	const readImage = file => {
		let success = false;
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = async () => {
			await worker.load();
			await worker.loadLanguage('eng');
			await worker.initialize('eng');
			const { data } = await worker.recognize(reader.result);
			await worker.terminate();
			data.lines.forEach(line => {
				const firstChunkOfText = line.text.split(' ')[0].replace(/\n/g, '');
				if (firstChunkOfText.match(accessionRegex)) {
					searchObjects(firstChunkOfText);
					success = true;
				}
			});
			if (!success) {
				setImageInputText('Error Reading Image');
			} else {
				setImageInputText('Scan Accession #');
			};
		};
	};

	const resizeImage = imageFile => {
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
				canvas.toBlob(readImage);
			};
			img.src = e.target.result;
		};
		reader.readAsDataURL(imageFile);
	};

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

ImageInput.propTypes = {
	searchObjects: PropTypes.func,
};
export default ImageInput;
