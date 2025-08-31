const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');

// Load image and show form
function loadImage(e) {
  const file = e.target.files[0];

  // Check if file is an image
  if (!isFileImage(file)) {
    alertError('Please select an image');
    return;
  }

  // Add current height and width to form using the URL API
  const image = new Image();
  image.src = URL.createObjectURL(file);
  image.onload = function () {
    widthInput.value = this.width;
    heightInput.value = this.height;
  };

  // Show form, image name and output path
  form.style.display = 'block';
  filename.innerHTML = img.files[0].name;
  outputPath.innerText = path.join(os.homedir(), 'imageresizer');
}

async function sendImage(e) {
  e.preventDefault();

  if (!img.files[0]) return alertError('Please upload an image');
  if (!widthInput.value || !heightInput.value) return alertError('Please enter a width and height');

  const file = img.files[0];
  const arrayBuf = await file.arrayBuffer();
  
  const payload = {
    filename: file.name,
    bytes: new Uint8Array(arrayBuf),
    width: Number(widthInput.value),
    height: Number(heightInput.value),
  };

  ipcRenderer.send('image:resize', payload);
}
// Catch the image:done event
ipcRenderer.on('image:done', () => {
  alertSuccess(`Image resized to ${widthInput.value} X ${heightInput.value}`);
});

// Make sure file is imagem
function isFileImage(file){
  const acceptedImageTypes = ['image/gif','image/png','image/jpeg'];
  return file && acceptedImageTypes.includes(file['type']);
}

function alertError(message) {
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: 'red',
      color: 'white',
      textAlign: 'center'
    }
  });
}

function alertSuccess(message) {
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: 'green',
      color: 'white',
      textAlign: 'center'
    }
  });
}

img.addEventListener('change', loadImage);
form.addEventListener('submit', sendImage);