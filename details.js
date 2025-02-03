import { API_KEY, API_BASE_URL } from './api.js';

// دالة للحصول على معرف الأنمي من URL
function getAnimeUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('anime_url');
}

// دالة لعرض تفاصيل الأنمي
function displayAnimeDetails(animeUrl) {
    // إظهار مؤشر التحميل
    const loadingIndicator = document.getElementById('loadingIndicator');
    const animeDetails = document.getElementById('animeDetails');
    loadingIndicator.classList.remove('hidden');
    animeDetails.classList.add('hidden');

    // جلب تفاصيل الأنمي
    fetch(`https://anime.apiclub.site/anime/details/${animeUrl}`, {
        headers: {
            'accept': 'application/json',
            'X-API-Key': API_KEY,
            'ngrok-skip-browser-warning': 'true'
        }
    })
    .then(response => response.json())
    .then(data => {
        // إخفاء مؤشر التحميل وإظهار التفاصيل
        loadingIndicator.classList.add('hidden');
        animeDetails.classList.remove('hidden');

        // تحديث عناصر الصفحة بالبيانات
        document.getElementById('animeImage').src = data.image;
        document.getElementById('animeTitle').textContent = data.title;
        document.getElementById('animeType').textContent = data['النوع'] || 'غير معروف';
        document.getElementById('animeStatus').textContent = data['حالة الأنمي'] || 'غير معروف';
        document.getElementById('animeYear').textContent = data['سنة بداية العرض'] || 'غير معروف';
        document.getElementById('episodeCount').textContent = data['عدد الحلقات']?.split('/')[0].trim() || 'غير معروف';

        // إضافة معلومات إضافية
        const additionalInfo = document.createElement('div');
        additionalInfo.className = 'mt-4 space-y-2 text-sm text-gray-400';
        additionalInfo.innerHTML = `
            <div>مدة الحلقة: ${data['مدة الحلقة'] || 'غير معروف'}</div>
            <div>الموسم: ${data['الموسم'] || 'غير معروف'}</div>
        `;
        document.getElementById('animeTitle').parentNode.appendChild(additionalInfo);

        // إضافة الحلقات
        const episodesContainer = document.getElementById('episodesList');
        episodesContainer.innerHTML = '';
        if (data.episodes && data.episodes.length > 0) {
            data.episodes.forEach(episode => {
                episodesContainer.innerHTML += `
                    <a href="watch2.html?episode_url=${encodeURIComponent(episode.episode_url)}" 
                       class="bg-white/5 p-3 rounded-lg hover:bg-white/10 transition-colors">
                        <img src="${episode.thumbnail}" alt="${episode.episode_number}" class="w-full rounded-lg mb-2">
                        <span class="block text-center">${episode.episode_number}</span>
                    </a>
                `;
            });
        } else {
            episodesContainer.innerHTML = '<p class="text-gray-400 col-span-full text-center">لا توجد حلقات متاحة</p>';
        }
    })
    .catch(error => {
        console.error('Error fetching anime details:', error);
        loadingIndicator.classList.add('hidden');
        animeDetails.innerHTML = `
            <div class="text-center text-gray-400 py-20">
                حدث خطأ أثناء جلب تفاصيل الأنمي. الرجاء المحاولة مرة أخرى.
            </div>
        `;
    });
}

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    const animeUrl = getAnimeUrl();
    if (animeUrl) {
        displayAnimeDetails(animeUrl);
    } else {
        window.location.href = 'index.html';
    }
}); 
