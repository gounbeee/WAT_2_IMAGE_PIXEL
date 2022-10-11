//
// WASM_2_IMAGE_PIXEL SEARCHER
// by Gounbeee 2022
//
// THIS EXAMPLE LOADS IMAGE FILE AND
// PASS THE PIXEL DATA TO WASM MODULE
// THEN,
// WE SPECIFY PIXEL DATA USING INDEX NUMBER
//
// EVERY PIXEL CONSISTS OF 4 CHANNELS SO
// SINGLE INDEX CAN REPRESENTS 'SOMEWHAT CHANNEL' OF A PIXEL
//
//
// ----------------------------------------
// getPixel( pointerOfArray , pixelIndex )
// ----------------------------------------



const canvas_src = document.getElementById("cnvs_source");
const canvas = document.getElementById("cnvs");

var width_src = 384;
var height_src = 32;

canvas_src.width = width_src;
canvas_src.height = height_src;
canvas.width = 32;
canvas.height = 32;


const pixel_count = width_src * height_src;
const channels_pixel = 4; 							// RGBA


const x_offset = 0; // x attribute is bytes 0-3
const y_offset = 4; // y attribute is bytes 4-7


const memory = new WebAssembly.Memory({ initial: 80 }); 		// 5120000 BYTES = 5 MB




// ---------------------------------------------------------------------------
// LOADING IMAGE

console.log("loadSrcImage() FUNCTION EXECUTED !!");
loadSrcImage(canvas_src, 'char_01.png', 0, 0, width_src, height_src, main);



function main(imageDt) {

	console.log("main() FUNCTION EXECUTED !!");
	console.log(`PARAMETER : ${imageDt}`);
	console.log(imageDt.data);
	console.log(imageDt.data.length);



	// PREPARE IMPORT OBJECT FOR WASM MODULE
	const importObject = {
		env: {
			buffer: memory,
			cnvs_width: canvas.width,
			cnvs_height: canvas.height,
			cnvs_src_width: width_src,
			cnvs_src_height: height_src,
			x_offset: x_offset,
			y_offset: y_offset,
		}
	};

	// ---------------------------------------------------
	// JS CAN ACCESS WASM WITH THIS 'INSTANTIATING' OBJECT
	(async () => {


		let obj = await WebAssembly.instantiateStreaming(fetch('image.wasm'), importObject)
		.then( (module) => {
			
			// ----------------------------------------------------------
			// GETTING FUNCTION AND MEMORY ARRAYBUFFER FROM WASM MODULE
			let {getPixel, memory} = module.instance.exports;

			// JUST CONSOLE LOG PRINT
			console.log(getPixel)
			console.log(memory.buffer)


		
			// ------------------------------------------
		 	// CASTING PIXEL DATA TO NEW CONTAINER
		 	// FOR PASSING TO WASM MODULE !!!
			let pixArray = new Int32Array(memory.buffer, 0, pixel_count*channels_pixel);		// 49152 BUFFERS
			pixArray.set(imageDt.data)

			
			const pixelIndex = 22130;
			let pixel = getPixel(pixArray.byteoffset, pixelIndex);
			console.log(`**** RESULT FROM WASM MODULE :: PIXEL INDEX [ ${pixelIndex} ]  IS [ ${pixel} ] !!!! `);
			


		});

	})();

}



// ------------------------------------------------------------------------------------



function loadSrcImage(canvas, src, x, y, width, height, opt_callback) {
    var img = new window.Image();
    img.crossOrigin = '*';
    img.src = src;

    img.onload = function () {
	    context = canvas.getContext('2d');
	    canvas.width = width;
	    canvas.height = height;
	    context.drawImage(img, x, y, width, height);

	    const imageData = context.getImageData(0, 0, width, height);
	    console.log(imageData);

	    // PASS THIS OBEJECT (Image OBJECT) TO CALLBACK FUNCTION
	    opt_callback && opt_callback(imageData);

	    img = null;
    };
}



