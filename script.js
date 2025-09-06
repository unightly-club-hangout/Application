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
        const postDiv = document.createElement("div");
        postDiv.innerHTML = `
          <h2>${post.Title}</h2>
          <p>${post.Content}</p>
          ${post.ImageURL ? `<img src="${post.ImageURL}" alt="${post.Title}">` : ""}
          <button class="buy-button" data-product-id="${post.Title.replace(/\s+/g, '-').toLowerCase()}">Buy</button>
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

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('buy-button')) {
        const productId = event.target.dataset.productId;
        alert('You clicked Buy for product ID: ' + productId);
    }
});