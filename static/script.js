// Ensure the DOM is loaded before adding event listeners
document.addEventListener('DOMContentLoaded', function () {
    // Encrypt button event listener
    document.getElementById('encrypt-btn').addEventListener('click', async function () {
        const formData = new FormData();
        const image = document.getElementById('image').files[0]; // Ensure image input exists
        const key = document.getElementById('key').value;

        if (!image || !key) {
            document.getElementById('output-message').textContent = "Please provide both an image and a key.";
            return;
        }

        formData.append('image', image);
        formData.append('key', key);

        try {
            const response = await fetch('/encrypt', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                document.getElementById('output-message').textContent = "Encryption Successful!";
                document.getElementById('output-image').src = `data:image/png;base64,${result.encrypted_image}`;
                document.getElementById('output-image').style.display = "block";
            } else {
                const error = await response.json();
                document.getElementById('output-message').textContent = error.error || "Encryption failed.";
            }
        } catch (error) {
            document.getElementById('output-message').textContent = "Error encrypting image.";
        }
    });

    // Decrypt button event listener
    document.getElementById('decrypt-btn').addEventListener('click', async function () {
        const key = document.getElementById('key').value;
        const encryptedImage = document.getElementById('output-image').src.split(',')[1]; // Base64 part of image

        if (!key || !encryptedImage) {
            document.getElementById('output-message').textContent = "Please provide both a key and an encrypted image.";
            return;
        }

        const formData = new FormData();
        formData.append('key', key);
        formData.append('encrypted_image', encryptedImage);

        try {
            const response = await fetch('/decrypt', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                document.getElementById('output-message').textContent = "Decryption Successful!";
                document.getElementById('output-image').src = `data:image/png;base64,${result.decrypted_image}`;
            } else {
                const error = await response.json();
                document.getElementById('output-message').textContent = error.error || "Decryption failed.";
            }
        } catch (error) {
            document.getElementById('output-message').textContent = "Error decrypting image.";
        }
    });
});
