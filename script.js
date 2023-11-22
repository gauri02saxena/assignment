let cropper;
let croppedImageDataURL; // To store the data URL of the cropped image
const imageInput = document.getElementById('imageInput');
const cropButton = document.getElementById('cropButton');
const imageContainer = document.getElementById('imageContainer');
const outputImage = document.getElementById('outputImage');

let selectedFrameSrc = null; // Store the selected frame source

imageInput.addEventListener('change', function (event) {
  const files = event.target.files;
  if (files && files.length) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const image = new Image();
      image.src = e.target.result;
      image.onload = function() {
        if (cropper) {
          cropper.destroy();
        }
        clearOutputImage(); // Clear previously displayed image
        imageContainer.innerHTML = ''; // Clear previously added image elements
        imageContainer.appendChild(image); // Add the new image
        cropper = new Cropper(image, {
          aspectRatio: 1,
          viewMode: 1,
          autoCropArea: 1,
          movable: false,
          zoomable: false,
          rotatable: false,
          scalable: false,
          ready: function() {
            cropButton.style.display = 'inline';
          }
        });
      };
    };
    reader.readAsDataURL(files[0]);
    cropButton.onclick = function() {
      croppedImageDataURL = cropper.getCroppedCanvas().toDataURL();
      clearOutputImage(); // Clear previously displayed image
      outputImage.src = croppedImageDataURL;
      outputImage.style.display = 'block'; // Show the image
      if (cropper) {
        cropper.destroy();
        cropper = null;
      }
    };
  }
});

// Function to apply the selected frame
function applyFrame(frameSrc) {
  if (selectedFrameSrc && croppedImageDataURL) {
    clearOutputImage(); // Clear previously displayed image

    // Create a new image element for the selected frame
    const frame = new Image();
    frame.onload = function() {
      // Create a canvas element to compose the frame and image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set canvas dimensions to match the frame size
      canvas.width = frame.width;
      canvas.height = frame.height;

      // Draw the frame
      ctx.drawImage(frame, 0, 0);

      // Draw the user's cropped image into the frame
      const croppedImage = new Image();
      croppedImage.onload = function() {
        // Draw the frame as a background
        ctx.drawImage(croppedImage, 0, 0, canvas.width, canvas.height);
        outputImage.src = canvas.toDataURL('image/png');
        outputImage.style.display = 'block'; // Show the image
      };
      croppedImage.src = croppedImageDataURL;
    };
    frame.src = frameSrc; // Use the selected frame source
  }
}

// Function to clear the previously displayed image
function clearOutputImage() {
  outputImage.src = '';
  outputImage.style.display = 'none';
}