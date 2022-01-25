const tesseractFiles = [
	"/public/vendor/tesseract/2_1_5/dist/worker.min.js",
	"/public/vendor/tesseract/lang_data/eng.traineddata.gz",
	"/public/vendor/tesseract_core/2_2_0/dist/tesseract-core.wasm", // todo: wasm.js ?
]

export const fetchTesseractFiles = () => {
	tesseractFiles.forEach(path => fetch(path));
	// Promise.all(tesseractFiles.map(path => fetch(path))).then(results=>{
	// 	console.log(results)
	// })
}