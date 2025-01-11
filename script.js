import { API_KEY, API_BASE_URL } from './api.js';

// دالة لعرض بطاقات الأنمي
function displayAnime() {
    const animeList = document.getElementById('animeList');
    animeList.innerHTML = ''; // تنظيف القائمة قبل إضافة العناصر الجديدة
    
    fetch(`${API_BASE_URL}/anime`, {
        headers: {
            'X-API-Key': API_KEY,
            'ngrok-skip-browser-warning': '69420',
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        data.forEach(anime => {
            // استخراج رقم آخر حلقة من مصفوفة الحلقات
            const latestEpisode = anime.episodes[0].episode_number;
            // استخراج أعلى جودة متوفرة
            const qualities = anime.episodes[0].servers.map(server => server.quality);
            const bestQuality = qualities.includes('FHD') ? 'FHD' : 'HD';
            
            const animeCard = `
                <div class="card-shine group relative rounded-lg overflow-hidden bg-white/5 hover:bg-white/10 transition-all duration-300">
                    <div class="aspect-[2/3] relative">
                        <img src="${anime.image}" alt="${anime.title}" 
                             class="w-full h-full object-cover">
                        
                        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div class="absolute bottom-0 left-0 right-0 p-2 sm:p-4">
                                <h3 class="text-white font-bold text-sm sm:text-base mb-1 sm:mb-2">${anime.anime_name}</h3>
                                <div class="flex items-center justify-between mb-2">
                                    <div class="flex items-center">
                                        <span class="text-yellow-400 ml-1 text-xs sm:text-sm">★</span>
                                        <span class="text-white text-xs sm:text-sm">${latestEpisode}</span>
                                    </div>
                                    <span class="bg-red-600 text-white px-1.5 py-0.5 rounded text-xs">${bestQuality}</span>
                                </div>
                                
                                <a href="watch.html?id=${anime.id}" 
                                   class="block w-full bg-white/20 hover:bg-white/30 text-white py-1.5 sm:py-2 rounded text-xs sm:text-sm text-center transition-colors backdrop-blur-sm">
                                    مشاهدة الآن
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            animeList.innerHTML += animeCard;
        });
    })
    .catch(error => {
        console.error('Error:', error);
        animeList.innerHTML = '<p class="text-white text-center">حدث خطأ في تحميل البيانات</p>';
    });
}

// تشغيل الدالة عند تحميل الصفحة
window.onload = displayAnime;

// دالة البحث
function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    if (query) {
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
}

// تصدير دالة البحث لاستخدامها في HTML
window.handleSearch = handleSearch; 