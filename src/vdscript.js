const apiKey = 'AIzaSyAaVT-l1P4IhS7NInhY7re--qeYW2yHP0E';



// YouTube IFrame API callback function
function onYouTubeIframeAPIReady() {
    // Get the video ID from the URL query parameter
    const params = new URLSearchParams(window.location.search);
    const videoId = params.get('videoId');

    // Create the video player
    new YT.Player('player', {
        videoId: videoId,
        playerVars: {
            autoplay: 1, // Autoplay the video
        },
        events: {
            onReady: onPlayerReady, // Call the onPlayerReady function when the player is ready
        },
    });
}

function onPlayerReady(event) {
    // Show the player once it is ready
    const playerElement = document.getElementById('player');
    playerElement.style.display = 'block';
}

async function fetchVideoDetails(videoId) {
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${apiKey}`
        );
        const data = await response.json();

        // ... Your code to extract video details from the data ...

        // Return the video details as an object
        return {
            title: data.items[0].snippet.title,
            channelTitle: data.items[0].snippet.channelTitle,
            viewCount: data.items[0].statistics.viewCount,
            thumbnailUrl: data.items[0].snippet.thumbnails.medium.url,
            formattedDuration: formatDuration(data.items[0].contentDetails.duration),
        };

    } catch (error) {
        console.error('Error fetching video details:', error);
    }
}

async function fetchAndDisplayVideoDetails() {
    const videoId = new URLSearchParams(window.location.search).get('videoId');

    if (!videoId) {
        console.error('No video ID found in the URL.');
        return;
    }

    try {
        // Fetch video details based on the video ID
        const videoDetails = await fetchVideoDetails(videoId);

        // Display the video details in the "details" div
        const detailsContainer = document.getElementById('details');
        detailsContainer.innerHTML = `
            <h3>${videoDetails.title}</h3>
            <p>Total Views: ${videoDetails.viewCount}</p>
            <p>Published: ${videoDetails.publishedDate}</p>
        `;

        // Create the video player
        new YT.Player('player', {
            videoId: videoId,
            playerVars: {
                autoplay: 1, // Autoplay the video
            },
        });
    } catch (error) {
        console.error('Error fetching and displaying video details:', error);
    }
}

// Call the function when the page loads
window.addEventListener('load', fetchAndDisplayVideoDetails);
