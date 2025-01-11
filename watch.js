import { API_KEY, API_BASE_URL } from './api.js';

let currentEpisodeData = null;
let currentQuality = 'HD';

// استخراج معرف الحلقة من URL
function getEpisodeId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// تحميل بيانات الحلقة
async function loadEpisodeData() {
    const episodeId = getEpisodeId();
    if (!episodeId) return;

    try {
        const response = await fetch(`${API_BASE_URL}/anime/${episodeId}`, {
            headers: {
                'X-API-Key': API_KEY,
                'ngrok-skip-browser-warning': '69420',
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        currentEpisodeData = data;
        updatePageContent();
    } catch (error) {
        console.error('Error loading episode:', error);
    }
}

// تحديث محتوى الصفحة
function updatePageContent() {
    if (!currentEpisodeData) return;

    // تحديث العناوين والصورة
    document.getElementById('episodeTitle').textContent = currentEpisodeData.title;
    document.getElementById('animeName').textContent = currentEpisodeData.anime_name;
    document.getElementById('animeImage').src = currentEpisodeData.image;

    // تحديث السيرفرات
    updateServerButtons();

    // تشغيل أول سيرفر متاح
    const servers = getServersByQuality(currentQuality);
    if (servers.length > 0) {
        changeServer(servers[0].url);
    }
}

// الحصول على السيرفرات حسب الجودة
function getServersByQuality(quality) {
    if (!currentEpisodeData?.episodes[0]?.servers) return [];
    return currentEpisodeData.episodes[0].servers.filter(server => server.quality === quality);
}

// تغيير الجودة
function changeQuality(quality) {
    currentQuality = quality;
    updateServerButtons();
    
    const servers = getServersByQuality(quality);
    if (servers.length > 0) {
        changeServer(servers[0].url);
    }
}

// تغيير السيرفر
function changeServer(url) {
    const player = document.getElementById('videoPlayer');
    // إضافة بروتوكول https إذا كان الرابط يبدأ بـ //
    const secureUrl = url.startsWith('//') ? 'https:' + url : url;
    player.src = secureUrl;
}

// تحديث أزرار السيرفرات
function updateServerButtons() {
    const container = document.getElementById('serverButtons');
    container.innerHTML = '';

    // تحديث حالة أزرار الجودة
    ['FHD', 'HD', 'SD'].forEach(quality => {
        const button = document.getElementById(`${quality}-button`);
        if (button) {
            button.classList.toggle('active', quality === currentQuality);
        }
    });

    const servers = getServersByQuality(currentQuality);
    servers.forEach(server => {
        const button = document.createElement('button');
        button.className = 'server-button';
        button.textContent = server.name.replace(currentQuality, '').trim();
        button.onclick = () => {
            // إزالة الحالة النشطة من جميع الأزرار
            document.querySelectorAll('.server-button').forEach(btn => 
                btn.classList.remove('bg-white/20'));
            // إضافة الحالة النشطة للزر المحدد
            button.classList.add('bg-white/20');
            changeServer(server.url);
        };
        container.appendChild(button);
    });
}

// تشغيل عند تحميل الصفحة
window.onload = loadEpisodeData; 