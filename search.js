import { API_KEY, API_BASE_URL } from './api.js';

// دالة للحصول على معامل البحث من URL
function getSearchQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('q');
}

// دالة لعرض نتائج البحث
function displaySearchResults(query) {
    // تحديث عنوان البحث
    document.getElementById('searchTerm').textContent = query;
    
    // إظهار مؤشر التحميل
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultsContainer = document.getElementById('searchResults');
    loadingIndicator.classList.remove('hidden');
    resultsContainer.innerHTML = ''; // مسح النتائج السابقة

    // جلب النتائج من API
    fetch(`https://anime.apiclub.site/search/web/${encodeURIComponent(query)}`, {
        headers: {
            'X-API-Key': API_KEY,
            'ngrok-skip-browser-warning': 'true'
        }
    })
    .then(response => response.json())
    .then(data => {
        // إخفاء مؤشر التحميل
        loadingIndicator.classList.add('hidden');

        // تحديث عدد النتائج
        document.getElementById('resultCount').innerHTML = `تم العثور على <span class="font-bold">${data.length}</span> نتيجة`;

        // عرض النتائج
        data.forEach(anime => {
            const animeCard = `
                <a href="details.html?anime_url=${encodeURIComponent(anime.anime_url)}" class="card-shine bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-colors">
                    <img src="${anime.image}" alt="${anime.alt}" class="w-full aspect-[2/3] object-cover">
                    <div class="p-4">
                        <h3 class="font-bold text-lg mb-2 line-clamp-1">${anime.title}</h3>
                        <div class="flex items-center gap-2 text-sm text-gray-400">
                            <span class="text-cyan-400">${anime.episodes}</span>
                        </div>
                    </div>
                </a>
            `;
            resultsContainer.innerHTML += animeCard;
        });
    })
    .catch(error => {
        // إخفاء مؤشر التحميل في حالة الخطأ
        loadingIndicator.classList.add('hidden');
        
        console.error('Error fetching search results:', error);
        resultsContainer.innerHTML = `
            <div class="col-span-full text-center text-gray-400">
                حدث خطأ أثناء جلب النتائج. الرجاء المحاولة مرة أخرى.
            </div>
        `;
    });
}

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    const query = getSearchQuery();
    if (query) {
        displaySearchResults(query);
    } else {
        window.location.href = 'index.html'; // إذا لم يكن هناك مصطلح بحث، عد إلى الصفحة الرئيسية
    }

    // إضافة وظيفة البحث للنموذج في صفحة البحث
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    searchInput.value = query; // تعيين قيمة البحث في حقل البحث

    function handleSearch() {
        const newQuery = searchInput.value.trim();
        if (newQuery) {
            window.location.href = `search.html?q=${encodeURIComponent(newQuery)}`;
        }
    }

    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
}); 
