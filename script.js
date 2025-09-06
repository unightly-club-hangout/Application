let previousPosts = [];

const googleSheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTWHMfgoHQ33CDC9H30UMh67iQBpcBXv1s1cLH8-FQfZkW_VUsq2O0npXFmxBV7j9xkk16wWQo4tP29/pub?output=csv";
const discordWebhookUrl = "https://discord.com/api/webhooks/1413564287489671350/b-vIZS-1RaWHvSye5q0Bv-zW_0s5kDoZaYTt_KRe4QR7L77tGV5fX9DVeEiiynfARgNH";


fetch(googleSheetUrl)
    .then(response => response.text())
    .then(csvData => {
        const posts = parseCSV(csvData);
        displayPosts(posts);
    })
    .catch(error => console.error("Error fetching data:", error));

function parseCSV(csvData) {
    const lines = csvData.split("\n");
    const headers = lines[0].split(",").map(header => header.trim());
    const posts = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map(value => value.trim());
        if (values.length === headers.length) {
            const post = {};
            for (let j = 0; j < headers.length; j++) {
                post[headers[j]] = values[j];
            }
            posts.push(post);
        }
    }
    return posts;
}

function displayPosts(posts) {
    const postsContainer = document.getElementById("posts-container");
    postsContainer.innerHTML = "";
    posts.forEach(post => {
        const productId = post.Title.replace(/\s+/g, '-').toLowerCase();
        const postDiv = document.createElement("div");
        postDiv.innerHTML = `
          <h2>${post.Title}</h2>
          <p>${post.Content}</p>
          ${post.ImageURL ? `<img src="${post.ImageURL}" alt="${post.Title}">` : ""}
          <button class="view-button" data-product-id="${productId}">View</button>
        `;
        postsContainer.appendChild(postDiv);
    });
}

async function sendToDiscord(post) {
    const webhookUrl = discordWebhookUrl;

    const message = {
        embeds: [{
            title: post.Title,
            description: post.Content,
            image: post.ImageURL ? { url: post.ImageURL } : null
        }]
    };

    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        });
        console.log('Post sent to Discord!');
    } catch (error) {
        console.error('Error sending to Discord:', error);
    }
}

async function checkForNewPosts() {
    try {
        const response = await fetch(googleSheetUrl);
        const csvData = await response.text();
        const posts = parseCSV(csvData);

        if (JSON.stringify(posts) !== JSON.stringify(previousPosts)) {
            console.log('New post detected!');
            const newestPost = posts[0];
            await sendToDiscord(newestPost);
            previousPosts = posts;
        }
        displayPosts(posts);

    } catch (error) {
        console.error("Error checking for new posts:", error);
    }
}
setInterval(checkForNewPosts, 5000);

let productCounter = 2; // Start from 2 since you have 2 products already
let isLoggedIn = false; // Track login status

// Function to show the login form
function showLogin() {
    const loginForm = document.getElementById('loginForm');
    loginForm.style.display = 'block';
    const addProductButton = document.querySelector('.add-product-button');
        addProductButton.style.display = 'none';


}




// Function to handle login submission
function login() {
    const passwordInput = document.getElementById('password');
    const password = passwordInput.value;

    // Replace 'YOUR_PASSWORD' with your actual password
    if (password === 'YOUR_PASSWORD') {
        isLoggedIn = true;
        const loginForm = document.getElementById('loginForm');
        loginForm.style.display = 'none';

        const addProductButton = document.querySelector('.add-product-button');
        addProductButton.style.display = 'inline-block'; // Show the add product button
    } else {
        alert('Incorrect password');
    }
}

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('view-button')) {
        const productId = event.target.dataset.productId;
        const modal = document.getElementById('myModal');
        const modalTitle = document.getElementById('modal-title');
        const modalImage = document.getElementById('modal-image');
        const modalDescription = document.getElementById('modal-description');
        const modalPrice = document.getElementById('modal-price');
        const downloadLink = document.getElementById('download-link');

        //Set fake downloads and all the products


         if (productId === '1') {
            modalTitle.textContent = "Product 1";
            modalImage.src = "image1.jpg";
            modalImage.alt = "Product 1";
            modalDescription.textContent = "Description of Product 1 This Item is Free!";
            modalPrice.textContent = "This item is free!";
            downloadLink.style.display = "block";
            downloadLink.href = "https://www.easygifanimator.net/images/samples/video-to-gif-sample.gif";

        } else if (productId === '2') {
            modalTitle.textContent = "Product 2";
            modalImage.src = "image2.jpg";
            modalImage.alt = "Product 2";
            modalDescription.textContent = "Description of Product 2";
            modalPrice.textContent = "$20.00";
            downloadLink.style.display = "none";
        }

         modal.style.display = "block";
    }
    if (event.target.classList.contains('add-product-button')) {
      addProduct();
    }

    if (event.target.classList.contains('close')) {
        const modal = document.getElementById('myModal');
        modal.style.display = "none";
    }
     if (event.target.classList.contains('login-button')) {
          login();
    }


});


function addProduct() {
    productCounter++;
    const productList = document.querySelector('.product-list');

    // Create the product HTML
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');
    productDiv.innerHTML = `
        <img src="image${productCounter}.jpg" alt="Product ${productCounter}">
        <h2>Product ${productCounter}</h2>
        <p>Description of Product ${productCounter}.</p>
        <p>$10.00</p>
        <button class="view-button" data-product-id="${productCounter}">View Item</button>
    `;
    productList.appendChild(productDiv);

    // Update modal content in the if statements


}

