    let previousPosts = [];
let previousTitles = []; // Track previous post titles
const googleSheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTWHMfgoHQ33CDC9H30UMh67iQBpcBXv1s1cLH8-FQfZkW_VUsq2O0npXFmxBV7j9xkk16wWQo4tP29/pub?output=csv"; // Replace with your Google Sheet URL
const discordWebhookUrl = "https://discord.com/api/webhooks/1413630048845693048/Hivus0XpBn0UZPJlTkXI7sHKcL3fE9YfDH8H4790yF4fYkn8kThChwT111Oux5BA_Zy_"; // Replace with your Discord Webhook URL
fetch(googleSheetUrl)
  .then(response => response.text())
  .then(csvData => {
    const posts = parseCSV(csvData);
console.log(csvData)
console.log(posts)
    displayPosts(posts);
previousPosts = posts
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

  if (post.Discord && post.Discord.trim().toUpperCase() === "X") {
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
// Compare the new titles with the previous posts
 if (posts.length !== previousPosts.length) {

        //If the length of the array is not the same. This indicates a new post being present. This reduces the amount of re-triggering
        const newestPost = posts[0]; //ASSUMING YOURE ADDING IT TO THE TOP
          await sendToDiscord(newestPost);

        }
    // Update the displayed posts
    displayPosts(posts);


previousPosts = posts
      }
 catch (error) {
console.error("Error checking for new posts:", error);
    }
}
// Check for new posts every 5 seconds (adjust as needed)

setInterval(checkForNewPosts, 5000);
checkForNewPosts()