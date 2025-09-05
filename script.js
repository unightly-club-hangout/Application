document.addEventListener('mousemove', function(e) {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    document.body.style.setProperty('background-position-x', x * 100 + '%');
    document.body.style.setProperty('background-position-y', y * 100 + '%');
});

function displayPosts() {
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


displayPosts();

async function addPost() {
  const newPostTitle = document.getElementById('new-post-title').value;
  const newPostContent = document.getElementById('new-post-content').value;
  const newPostImage = document.getElementById('new-post-image').value;

  if (newPostTitle && newPostContent) {
    posts.push({ title: newPostTitle, content: newPostContent, image: newPostImage });

    const postsString = `const posts = ${JSON.stringify(posts, null, 4)};`;

    // Update posts.js file content
    await default_api.create_new_file({
        filepath: 'posts.js',
        contents: postsString,
      });
    displayPosts();

    document.getElementById('new-post-title').value = '';
    document.getElementById('new-post-content').value = '';
    document.getElementById('new-post-image').value = '';
  }
}

