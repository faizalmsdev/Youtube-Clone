const apiKey = 'AIzaSyAaVT-l1P4IhS7NInhY7re--qeYW2yHP0E';
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
    'esGUbfbOy9U'
];

async function fetchAndDisplayVideos() {
    const cardsContainer = document.querySelector('.cards');

    
    for (const videoId of videoIds) {
        const card = document.createElement('div');
        card.classList.add('card');
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
        datasContainer.classList.add('datas');

        const profileLogo = document.createElement('img');
        profileLogo.id = `profile-logo-${videoId}`;
        profileLogo.alt = 'Profile Picture';
        profileLogo.classList.add('dp');
        profileLogo.style.borderRadius = '50%'; // Apply the border-radius style
        profileLogo.style.height = '38px'; // Apply the height style
        profileLogo.style.width = '38px'; // Apply the width style
        profileLogo.style.marginTop = '12px'; // Apply the margin-top style
        datasContainer.appendChild(profileLogo);

        const dataTextContainer = document.createElement('div');
        dataTextContainer.id = `data-txt-${videoId}`;
        dataTextContainer.style.width = '300px'; // Apply the width style
        datasContainer.appendChild(dataTextContainer);

        const title = document.createElement('h3');
        title.classList.add('title');
        title.textContent = 'Loading...';
        dataTextContainer.appendChild(title);

        const name = document.createElement('p');
        name.classList.add('name');
        name.textContent = 'Loading...';
        dataTextContainer.appendChild(name);

        const views = document.createElement('p');
        views.classList.add('views');
        views.textContent = 'Loading...';
        dataTextContainer.appendChild(views);

        card.appendChild(datasContainer);

        const duration = document.createElement('p');
        duration.id = `duration-${videoId}`;
        duration.textContent = '';
        duration.classList.add('duration'); // Add a class for styling
        card.appendChild(duration);

        cardsContainer.appendChild(card);

        // Fetch video details and update the card
        await fetchVideoDetails(videoId);
    }
}

async function fetchVideoDetails(videoId) {
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${apiKey}`
        );
        const data = await response.json();

        const channelId = data.items[0].snippet.channelId;
        await fetchChannelDetails(channelId, videoId);

        const titleElement = document.querySelector(`#data-txt-${videoId} .title`);
        const nameElement = document.querySelector(`#data-txt-${videoId} .name`);
        const viewsElement = document.querySelector(`#data-txt-${videoId} .views`);
        const thumbnailElement = document.querySelector(`[src='https://img.youtube.com/vi/${videoId}/mqdefault.jpg']`);
        const durationElement = document.querySelector(`#duration-${videoId}`);

        titleElement.textContent = data.items[0].snippet.title;
        nameElement.textContent = data.items[0].snippet.channelTitle;
        viewsElement.textContent = `${data.items[0].statistics.viewCount} Views`;

        const thumbnailUrl = data.items[0].snippet.thumbnails.medium.url;
        thumbnailElement.src = thumbnailUrl;

        const duration = data.items[0].contentDetails.duration;
        const formattedDuration = formatDuration(duration);
        durationElement.textContent = formattedDuration;

    } catch (error) {
        console.error('Error fetching video details:', error);
    }
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

function formatDuration(duration) {
    // Function to format the duration as MM:SS (minutes and seconds)

    // Parse the duration string from ISO 8601 format
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

    // Extract minutes and seconds from the match
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const seconds = match[3] ? parseInt(match[3]) : 0;

    // Format the duration as MM:SS
    const formattedDuration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    return formattedDuration;
}
window.addEventListener('load', fetchAndDisplayVideos);


//Card component 
