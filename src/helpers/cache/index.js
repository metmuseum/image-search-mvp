import { createWorker } from 'tesseract.js';

export const warmUpTesseract = async () => {
	console.log("running warm up")
	const worker = createWorker({
		logger: m => {
			console.log(m);
		}
	});
	await worker.load();
	await worker.loadLanguage('eng');
	await worker.initialize('eng');
	await worker.recognize("/public/favicon-32x32.png");
	await worker.terminate();
}