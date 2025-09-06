    let previousPosts = [];
let previousTitles = []; // Track previous post  titles
let previousLength = 0; // Keep track of the previous data length
    const githubRawURL = 'https://gist.githubusercontent.com/silentmason/46d973b3702d6d81d8eeb7e5659caaa1/raw/f39d15024f176604e69d15962814771e8f600b98/posts.json'; // Replace with your Github Raw URL
    function displayPosts(posts) {
      const postsContainer = document.getElementById("posts-container");
      postsContainer.innerHTML = "";
      posts.forEach(post => {
        const postDiv = document.createElement("div");
        postDiv.innerHTML = `
          <h2>${post.Title}</h2>
          <p>${post.Content}</p>
          ${post.ImageURL ? `<img src="${post.ImageURL}" alt="${post.Title}">` : ""}
        `;
        postsContainer.appendChild(postDiv);
      });
    }

    async function sendToDiscord(post) {
      const webhookUrl = discordWebhookUrl;

      // Check if the Discord column contains 'X' or 'Y'
      if (post.Discord === "X") {
        console.log("Discord post disabled for this message.");
        return; // Prevent sending the webhook
    }

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
        const response = await fetch(githubRawURL);
         const data = await response.json()

        displayPosts(data);

        //NEW - Check the messages and only send newest
        if (data.length > previousLength) {

          const newestPost = data[0];
          await sendToDiscord(newestPost);
          previousLength = data.length
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    // Check for new posts every 5 seconds (adjust as needed)
    setInterval(checkForNewPosts, 5000);
    checkForNewPosts()