import { API_KEY, API_BASE_URL } from './api.js';

// دالة للحصول على معرف الحلقة من URL
function getEpisodeUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('episode_url');
}

// دالة لعرض تفاصيل الحلقة
function displayEpisodeDetails(episodeUrl) {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const episodeContent = document.getElementById('episodeContent');
    
    // إظهار مؤشر التحميل
    loadingIndicator.classList.remove('hidden');
    episodeContent.classList.add('hidden');

    // جلب تفاصيل الحلقة - تحديث الرابط
    fetch(`https://guided-talented-snapper.ngrok-free.app/episode/servers/${episodeUrl}`, {
        headers: {
            'accept': 'application/json',
            'X-API-Key': API_KEY,
            'ngrok-skip-browser-warning': 'true'
        }
    })
    .then(response => response.json())
    .then(data => {
        // إخفاء مؤشر التحميل وإظهار المحتوى
        loadingIndicator.classList.add('hidden');
        episodeContent.classList.remove('hidden');

        // تحديث مشغل الفيديو مع أول سيرفر
        const videoPlayer = document.getElementById('videoPlayer');
        if (data.servers && data.servers.length > 0) {
            videoPlayer.innerHTML = `<iframe src="${data.servers[0].url}" class="w-full h-full" frameborder="0" allowfullscreen></iframe>`;
        } else {
            videoPlayer.innerHTML = '<div class="text-center p-4">لم يتم العثور على مصدر الفيديو</div>';
        }

        // تحديث قائمة السيرفرات
        const serversList = document.getElementById('serversList');
        serversList.innerHTML = '';
        if (data.servers && data.servers.length > 0) {
            data.servers.forEach(server => {
                const button = document.createElement('button');
                button.className = 'px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors';
                button.textContent = `${server.name} - ${server.quality}`;
                button.onclick = () => changeServer(server.url);
                serversList.appendChild(button);
            });
        } else {
            serversList.innerHTML = '<div class="text-gray-400">لا توجد سيرفرات متاحة</div>';
        }
    })
    .catch(error => {
        console.error('Error fetching episode details:', error);
        loadingIndicator.classList.add('hidden');
        episodeContent.innerHTML = `
            <div class="text-center text-gray-400 py-20">
                حدث خطأ أثناء تحميل الحلقة. الرجاء المحاولة مرة أخرى.
            </div>
        `;
    });
}

// دالة لتغيير السيرفر
function changeServer(serverUrl) {
    const videoPlayer = document.getElementById('videoPlayer');
    if (serverUrl) {
        videoPlayer.innerHTML = `<iframe src="${serverUrl}" class="w-full h-full" frameborder="0" allowfullscreen></iframe>`;
    }
}

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    const episodeUrl = getEpisodeUrl();
    if (episodeUrl) {
        displayEpisodeDetails(episodeUrl);
    } else {
        window.location.href = 'index.html';
    }

    // إضافة وظيفة البحث
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    function handleSearch() {
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        }
    }

    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
}); 