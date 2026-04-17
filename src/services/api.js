import axios from 'axios';

const API_BASE = 'https://api.vharasc.dev/api/v1/komiku';
const API_KEY = 'ak_rCTGDq_ut_1aMDQBxkTy-J8TM9HDAqJX';

// Axios instance untuk Vharasc API
const vharasAPI = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// Response transformer untuk Vharasc API
const transformVharasResponse = (response) => {
  let items = [];
  
  // Response structure: 
  // response.data = {status, success, author, data: {...}, message}
  // response.data.data = {data: [...items...]}  OR Array
  // Need to handle BOTH cases
  
  console.log('🔧 Transformer - checking structure...');
  console.log('  response.data.data.data exists?', Array.isArray(response.data?.data?.data));
  console.log('  response.data.data is array?', Array.isArray(response.data?.data));
  
  if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
    // 3-level nesting: data.data.data = array
    console.log('✅ Found items at data.data.data (3-level):', response.data.data.data.length);
    items = response.data.data.data;
  } else if (Array.isArray(response.data?.data)) {
    // Direct 2-level: data.data = array
    console.log('✅ Found items at data.data (2-level):', response.data.data.length);
    items = response.data.data;
  } else if (response.data?.data && typeof response.data.data === 'object' && !Array.isArray(response.data.data)) {
    // Single item or object with data property
    console.log('✅ Found single/wrapped item');
    items = response.data.data.data ? [response.data.data.data] : [response.data.data];
  }

  console.log('📊 Total items found:', items.length);

  const transformedItems = items.map(item => {
    // Parse genre string (e.g., "Fantasi 10.1jtx" -> "Fantasi")
    const genreStr = item.genre || '';
    const genreText = genreStr.replace(/\s*[\d\.jrtbkx]+\s*$/, '').trim();
    
    // IMPORTANT: Always ensure we have a valid slug/param for routing
    // Use slug from item, fallback to title converted to slug format
    const slug = item.slug || 
                 (item.title ? item.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : null) ||
                 `manga-${Math.random().toString(36).substr(2, 9)}`;
    
    // DON'T spread item directly - only include safe properties
    // This prevents object properties (first_chapter, latest_chapter) from being rendered
    return {
      id: slug || Math.random(),
      title: item.title || '',
      thumbnail: item.thumbnail || '',
      cover: item.thumbnail || '',
      rating: item.rating || '0',
      latest_chapter: item.latest_chapter?.chapter || item.chapter || '',
      param: slug, // Always set, never empty
      slug: slug,  // Always set, never empty
      type: item.type || 'Manga',
      author: item.author || '',
      status: item.status || '',
      synopsis: item.synopsis || item.description || '',
      genre: genreText || item.genre || '',
      chapter: item.chapter || item.latest_chapter?.chapter || '',
      info: item.info || '',
      first_chapter: item.first_chapter?.chapter || '',  // Extract just the chapter text
      // Don't spread ...item - it includes objects that can't be rendered
    };
  });

  return {
    data: {
      data: transformedItems
    }
  };
};

// Transformer untuk chapters list
const transformChaptersResponse = (response) => {
  let chapters = [];
  
  if (Array.isArray(response.data?.data)) {
    chapters = response.data.data;
  } else if (Array.isArray(response.data?.chapters)) {
    chapters = response.data.chapters;
  }

  const transformedChapters = chapters.map((ch, idx) => {
    const chapter_num = ch.chapter || String(idx + 1);
    // Ensure slug is always present - use provided slug or fallback to title_chapter slug
    const chapterSlug = ch.slug || 
                       (ch.title_chapter ? ch.title_chapter.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : null) ||
                       `chapter-${chapter_num.replace(/\./g, '-')}`;
    
    return {
      id: chapterSlug || Math.random(),
      slug: chapterSlug, // Always set
      chapter: chapter_num,
      chapter_number: chapter_num,
      title: ch.title_chapter || `Chapter ${chapter_num}`,
      release: ch.release || new Date().toISOString(),
      ...ch
    };
  });

  return {
    data: {
      data: transformedChapters
    }
  };
};

export const api = {
  // Get Trending/Popular Manga
  getTrendingManga: async (page = 1) => {
    try {
      console.log('🔄 Fetching trending manga...');
      const res = await vharasAPI.get(`/popular?sorttime=all&page=${page}&apikey=${API_KEY}`);
      console.log('✅ Raw response:', res.data);
      console.log('📊 Response.data.data:', res.data?.data);
      console.log('✅ Trending response OK, items:', res.data?.data?.length);
      return transformVharasResponse(res);
    } catch (error) {
      console.warn('❌ Trending fetch failed:', error.message, error.response?.status);
      console.warn('❌ Full error:', error);
      // Fallback to home endpoint
      try {
        console.log('🔄 Trying fallback /home endpoint...');
        const fallbackRes = await vharasAPI.get(`/home?apikey=${API_KEY}`);
        if (fallbackRes.data?.data?.ranking) {
          const ranking = fallbackRes.data.data.ranking || [];
          console.log('✅ Fallback success, items:', ranking.length);
          return transformVharasResponse({ data: { data: ranking } });
        }
      } catch (e) {
        console.warn('❌ Fallback also failed:', e.message);
      }
      throw error;
    }
  },

  // Get Latest Manga
  getLatestManga: async (page = 1) => {
    try {
      console.log('🔄 Fetching latest manga...');
      const res = await vharasAPI.get(`/latest?page=${page}&apikey=${API_KEY}`);
      console.log('✅ Latest response OK, items:', res.data?.data?.length);
      return transformVharasResponse(res);
    } catch (error) {
      console.warn('❌ Latest fetch failed:', error.message, error.response?.status);
      throw error;
    }
  },

  // Search Manga - IMPORTANT: uses 'q' parameter, not 'query'
  searchManga: async (keyword, page = 1) => {
    try {
      console.log('🔄 Searching manga:', keyword);
      const res = await vharasAPI.get(`/search?q=${encodeURIComponent(keyword)}&page=${page}&apikey=${API_KEY}`);
      console.log('✅ Search response OK, items:', res.data?.data?.length);
      return transformVharasResponse(res);
    } catch (error) {
      console.warn('❌ Search failed:', error.message);
      throw error;
    }
  },

  // Get Manga Detail
  getMangaDetail: async (slug) => {
    try {
      const res = await vharasAPI.get(`/detail/${slug}?apikey=${API_KEY}`);
      // Handle different response structures
      if (res.data?.data) {
        // If detail endpoint returns wrapped data
        return transformVharasResponse(res);
      } else if (Array.isArray(res.data)) {
        // If it returns array
        return transformVharasResponse({ data: { data: res.data } });
      }
      return res;
    } catch (error) {
      console.error('Detail fetch failed:', error);
      throw error;
    }
  },

  // Get Manga Chapters - for displaying chapter list
  getMangaChapters: async (slug) => {
    try {
      console.log('🔄 Fetching chapters for:', slug);
      const res = await vharasAPI.get(`/detail/${slug}?apikey=${API_KEY}`);
      
      // Chapters are at response.data.data.chapters (3-level nesting)
      const chapters = res.data?.data?.chapters || res.data?.chapters || [];
      console.log('✅ Found chapters:', chapters.length);
      
      if (chapters && Array.isArray(chapters)) {
        return transformChaptersResponse({ data: { chapters: chapters } });
      }
      // Fallback: assume empty chapters
      console.warn('⚠️ No chapters found');
      return { data: { data: [] } };
    } catch (error) {
      console.error('❌ Chapters fetch failed:', error);
      throw error;
    }
  },

  // Get Chapter Images/Pages - uses /read/:chapter_slug endpoint
  getChapterPages: async (slug, chapterSlug) => {
    try {
      const res = await vharasAPI.get(`/read/${chapterSlug}?apikey=${API_KEY}`);
      // Response structure: { data: { images: [...], ... } }
      return res;
    } catch (error) {
      console.error('Chapter read failed:', error);
      throw error;
    }
  },

  // Get Genre List
  getGenres: async () => {
    try {
      const res = await vharasAPI.get(`/list-genre?apikey=${API_KEY}`);
      return res.data?.data || [];
    } catch (error) {
      console.warn('Genres fetch failed:', error.message);
      return [];
    }
  },

  // Get Manga by Genre
  getMangaByGenre: async (genreSlug, page = 1) => {
    try {
      const res = await vharasAPI.get(`/genre/${genreSlug}?page=${page}&apikey=${API_KEY}`);
      return transformVharasResponse(res);
    } catch (error) {
      console.warn('Genre fetch failed:', error.message);
      throw error;
    }
  },
};

export default api;
