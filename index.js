    let previousPosts = [];
let previousTitles = []; // Track previous post titles
const googleSheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTWHMfgoHQ33CDC9H30UMh67iQBpcBXv1s1cLH8-FQfZkW_VUsq2O0npXFmxBV7j9xkk16wWQo4tP29/pub?output=csv"; // Replace with your Google Sheet URL
const discordWebhookUrl = "https://discord.com/api/webhooks/1413564287489671350/b-vIZS-1RaWHvSye5q0Bv-zW_0s5kDoZaYTt_KRe4QR7L77tGV5fX9DVeEiiynfARgNH"; // Replace with your Discord Webhook URL

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
        `;
        postsContainer.appendChild(postDiv);
      });
    }

    async function sendToDiscord(post) {
      const webhookUrl = discordWebhookUrl;

      // Check if the Discord column contains 'X' or 'Y'
    const headers = Object.keys(post); // Dynamically get headers from the post object
    const discordColumnHeader = headers.find(header => header.toLowerCase().includes('discord')); // Find a header that includes "discord"
  const discordValue = post[discordColumnHeader];

    if (discordValue && discordValue.trim().toUpperCase() === "X") {
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
    const response = await fetch(googleSheetUrl);
    const csvData = await response.text();
    const posts = parseCSV(csvData);

    // Get the titles of the new posts
    const newTitles = posts.map(post => post.Title);

    // Compare the new titles with the previous titles
    if (JSON.stringify(newTitles) !== JSON.stringify(previousTitles)) {
      // A new or modified post has been detected
      console.log('New or modified post detected!');

      // Find the newest post (assuming it's the first one)
      const newestPost = posts[0];

      // Send the newest post to Discord
          await sendToDiscord(newestPost);

      // Update the previous posts and titles
      previousPosts = posts;
      previousTitles = newTitles;
        }

    // Update the displayed posts
    displayPosts(posts);
      } catch (error) {
    console.error("Error checking for new posts:", error);
      }
    }
// Check for new posts every 5 seconds (adjust as needed)
setInterval(checkForNewPosts, 5000);
checkForNewPosts()

