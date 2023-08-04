const apiKey = 'AIzaSyAaVT-l1P4IhS7NInhY7re--qeYW2yHP0E';
//To display video with its id :> 

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
            onReady: function(event) {
                // Show the player once it is ready
                const playerElement = document.getElementById('player');
                playerElement.style.display = 'block';

                // Fetch and display the video title and date
                getVideoTitle(videoId, apiKey);
            },
        },
    });
}

function onPlayerReady(event) {
    // Show the player once it is ready
    const playerElement = document.getElementById('player');
    playerElement.style.display = 'block';
}

//Home video title 

function getVideoTitle(videoId, apiKey) {
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const videoTitle = data.items[0].snippet.title;
            const videoDate = data.items[0].snippet.publishedAt;

            document.getElementById('title').textContent = videoTitle;
            document.getElementById('videoDate').textContent = formatDate(videoDate);
        })
        .catch(error => {
            console.error('Error fetching video details:', error);
        });
}

 // Helper function to format the date
 function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}


///////
const videoIds = [
    'DuudSp4sHmg',
    'akyrqYDWe34',
    'FBybBAo_254',
    '8brpYL2-Sok',
    'E24FK3mVhiA',
    'F63cVoK0GAs',
    'rn6YKmqA2-k',
    'c6guls4N-k8',
    'zxWAUZKKCbI',
    'esGUbfbOy9U',
    '9FhIxhKxLKc',
    'ARbkbwvyIXw',
    'hRsdYW5XhK0',
    'DymLVe-ypaE',
    'O0JaDDNmUhE',
    'izY5Hfo4_ug',
    'Xw1XfN7iutQ',
    '8JMFggfEerY',
    'SObxDUTr6ds',
    '5GCJS0_taBo'
];


async function fetchAndDisplayVideos() {
    const cardsContainer = document.querySelector('.s-cards');

    for (const videoId of videoIds) {
        const card = document.createElement('div');
        card.classList.add('s-card');
        card.setAttribute('data-video-id', videoId);

        // Create an anchor tag for the thumbnail image
        const thumbnailLink = document.createElement('a');
        thumbnailLink.href = `videoDetails.html?videoId=${videoId}`;
        thumbnailLink.target = '_blank'; // Open the link in a new tab
        card.appendChild(thumbnailLink);

        // Add the thumbnail image inside the anchor tag
        const thumbnail = document.createElement('img');
        thumbnail.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        thumbnail.alt = 'Video Thumbnail';
        thumbnail.id = 'thumbnail'; // Add an ID to the thumbnail for the styles to apply
        thumbnailLink.appendChild(thumbnail);

        const datasContainer = document.createElement('div');
        datasContainer.classList.add('text-details');

        const dataTextContainer = document.createElement('div');
        dataTextContainer.id = `data-txt-${videoId}`;
        dataTextContainer.style.width = '300px'; // Apply the width style
        datasContainer.appendChild(dataTextContainer);

        const title = document.createElement('h2');
        title.classList.add('title');
        title.textContent = 'Loading...';
        datasContainer.appendChild(title);

        const name = document.createElement('h3');
        name.classList.add('name');
        name.textContent = 'Loading...';
        datasContainer.appendChild(name);

        // const views = document.createElement('h3');
        // views.classList.add('views');
        // views.textContent = 'Loading...';
        // datasContainer.appendChild(views);

        card.appendChild(datasContainer);
        cardsContainer.appendChild(card);

        await fetchVideoDetails(videoId);
    }
}

async function fetchVideoDetails(videoId) {
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${apiKey}`
        );
        const data = await response.json();
        const videoDetails = data.items[0].snippet;

        const channelId = data.items[0].snippet.channelId;
        await fetchChannelDetails(channelId, videoId);

        const titleElement = document.querySelector(`[data-video-id="${videoId}"] .title`);
        const nameElement = document.querySelector(`[data-video-id="${videoId}"] .name`);
        const viewsElement = document.querySelector(`[data-video-id="${videoId}"] .views`);
        const thumbnailElement = document.querySelector(`[src='https://img.youtube.com/vi/${videoId}/mqdefault.jpg']`);
        const durationElement = document.querySelector(`#duration-${videoId}`);


        titleElement.textContent = videoDetails.title;
        nameElement.textContent = videoDetails.channelTitle;
        // viewsElement.textContent = 'Views: ' + getFormattedViews(videoDetails.viewCount);
        thumbnailElement.alt = videoDetails.title;
        // titleElement.textContent = data.items[0].snippet.title;
        // nameElement.textContent = data.items[0].snippet.channelTitle;
        // viewsElement.textContent = `${data.items[0].statistics.viewCount} Views`;

        // const thumbnailUrl = data.items[0].snippet.thumbnails.medium.url;
        // thumbnailElement.src = thumbnailUrl;

        // const duration = data.items[0].contentDetails.duration;
        // const formattedDuration = formatDuration(duration);
        // durationElement.textContent = formattedDuration;

    } catch (error) {
        console.error('Error fetching video details:', error);
    }
}

function getFormattedViews(views) {
    return Number(views).toLocaleString();
}

async function fetchChannelDetails(channelId, videoId) {
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`
        );
        const data = await response.json();

        const profileLogoElement = document.querySelector(`#profile-logo-${videoId}`);
        const profileImageUrl = data.items[0].snippet.thumbnails.default.url;
        profileLogoElement.src = profileImageUrl;
    } catch (error) {
        console.error('Error fetching channel details:', error);
    }
}

window.addEventListener('load', fetchAndDisplayVideos);