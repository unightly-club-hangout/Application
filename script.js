let previousPosts = [];

async function fetchPosts() {
    const githubRawUrl = 'https://raw.githubusercontent.com/unightly-club-hangout/unightlyclubhangout/refs/heads/main/posts.json'; // Replace with your GitHub raw URL
    try {
        const response = await default_api.fetch_url_content({
            url: githubRawUrl
        });
        console.log('Response from GitHub:', response);
        const posts = JSON.parse(response.fetch_url_content_response.content);

        if (JSON.stringify(posts) !== JSON.stringify(previousPosts)) {
            // New post detected
            const newPost = posts[0]; // Assuming the newest post is at the beginning
            sendToDiscord(newPost);
            previousPosts = posts;
        }
        displayPosts(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        console.error('Detailed error:', error.message, error.stack);
        document.getElementById('posts-container').textContent = 'Failed to load posts. Check console for details.';
    }
}

async function sendToDiscord(post) {
    const webhookUrl = 'https://discord.com/api/webhooks/1413564287489671350/b-vIZS-1RaWHvSye5q0Bv-zW_0s5kDoZaYTt_KRe4QR7L77tGV5fX9DVeEiiynfARgNH'; // Replace with your Discord webhook URL

    const message = {
        embeds: [{
            title: post.title,
            description: post.content,
            image: post.image ? { url: post.image } : null
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

function displayPosts(posts) {
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = ''; // Clear existing posts

    for (const post of posts) {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');

        const titleElement = document.createElement('h2');
        titleElement.textContent = post.title;

        postDiv.appendChild(titleElement);

        if (post.image) {
            const imageElement = document.createElement('img');
            imageElement.src = post.image;
            imageElement.style.maxWidth = '100%'; // Set a maximum width
            postDiv.appendChild(imageElement);
        }

        const contentElement = document.createElement('p');
        contentElement.textContent = post.content;

        postDiv.appendChild(contentElement);

        postsContainer.appendChild(postDiv);
    }
}

// Fetch posts every 5 seconds (adjust as needed)
setInterval(fetchPosts, 5000);

fetchPosts();

