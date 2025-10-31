import { NOCODB_BASE_URL, NOCODB_API_PATH, NOCODB_TABLES, PLACEHOLDER_IMAGE } from '../constants';
import type { BlogPost, Product, TherapyService, ServiceHighlight, Testimonial, Variation, ServicePackageInfo } from '../types';

// The API_BASE is now a relative path to trigger the Vite development proxy.
// NOCODB_BASE_URL is still required for constructing full image URLs from the API response, as those are not proxied.
const API_BASE = NOCODB_API_PATH;

// --- Image URL Parser Utility ---
// Replicates the logic from the Flutter app's `image_url_parser.dart`.
function parseNocoDbImageUrl(imageData: any): string {
  if (!imageData || !Array.isArray(imageData) || imageData.length === 0) {
    return PLACEHOLDER_IMAGE;
  }

  const imageInfo = imageData[0];
  if (typeof imageInfo === 'object' && imageInfo !== null) {
     const resolveUrl = (path: string | null | undefined): string | null => {
      if (!path) return null;
      if (path.startsWith('http')) {
        return path;
      }
      
      // Manual, robust path joining to guarantee the slash.
      const baseUrl = NOCODB_BASE_URL.endsWith('/') ? NOCODB_BASE_URL.slice(0, -1) : NOCODB_BASE_URL;
      const cleanPath = path.startsWith('/') ? path.slice(1) : path;
      
      return `${baseUrl}/${cleanPath}`;
    };
    
    const signedValue = imageInfo.signedUrl || imageInfo.signedPath;
    const resolvedSignedUrl = resolveUrl(signedValue);
    if (resolvedSignedUrl) {
        return resolvedSignedUrl;
    }

    const rawValue = imageInfo.url || imageInfo.path;
    const resolvedRawUrl = resolveUrl(rawValue);
    if (resolvedRawUrl) {
        return resolvedRawUrl;
    }
  }
  return PLACEHOLDER_IMAGE;
}

// --- Generic Fetch Function ---
async function fetchData<T>(tableName: string, params?: Record<string, string>): Promise<T[]> {
    let url = `${API_BASE}/${tableName}`;
    if (params) {
        const query = new URLSearchParams(params).toString();
        url += `?${query}`;
    }
    
    // Header is now added by the proxy, but we can keep this for other potential headers.
    const headers = new Headers({ 'accept': 'application/json' });

    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.list;
    } catch (error) {
        console.error(`Failed to fetch from table ${tableName}:`, error);
        // This print message is to satisfy the user request of seeing an error if something goes wrong (e.g., a missing API key if they add security later).
        console.log("This might be due to an incorrect proxy configuration, a missing API key, or a network issue.");
        throw error;
    }
}

// --- Data Transformation Functions ---

const transformProduct = (item: any): Product => {
    const variations: Variation[] = item.variations && typeof item.variations === 'string' ? JSON.parse(item.variations) : (item.variations || []);
    const startingPrice = variations.length > 0
        ? Math.min(...variations.map(v => parseFloat(v.price) || Infinity)).toFixed(2)
        : (parseFloat(item.Price) || 0).toFixed(2);

    return {
        id: item.Id.toString(),
        name: item.Name || 'Unnamed Product',
        description: item.Description || 'No description available.',
        price: (parseFloat(item.Price) || 0).toFixed(2),
        imageUrl: parseNocoDbImageUrl(item.imageUrl),
        variations,
        startingPrice,
    };
};

const transformTherapy = (item: any): TherapyService => {
    const variations: Variation[] = item.variations && typeof item.variations === 'string' ? JSON.parse(item.variations) : (item.variations || []);
     const startingPrice = variations.length > 0
        ? Math.min(...variations.map(v => parseFloat(v.price) || Infinity)).toFixed(2)
        : (parseFloat(item.Price) || 0).toFixed(2);
        
    return {
        id: item.Id.toString(),
        name: item.Name || 'Unnamed Service',
        description: item.Description || 'No description available.',
        durationMins: item.Duration_mins?.toString() || 'N/A',
        price: (parseFloat(item.Price) || 0).toFixed(2),
        imageUrl: parseNocoDbImageUrl(item.imageUrl),
        variations,
        startingPrice,
    };
};

const transformBlogPost = (item: any): BlogPost => ({
    id: item.Id.toString(),
    title: item.title || 'Untitled Post',
    excerpt: item.excerpt || '',
    imageUrl: parseNocoDbImageUrl(item.imageUrl),
    category: item.category || 'Uncategorized',
    datePublished: new Date(item.DatePublished || Date.now()),
    content: item.content || 'No content available.',
});

const transformServiceHighlight = (item: any): ServiceHighlight => ({
    id: item.Id.toString(),
    title: item.Title || 'No Title',
    description: item.Description || '',
    detailedDescription: item.DetailedDescription || item.Description || '',
    iconUrl: parseNocoDbImageUrl(item.Icon),
    packages: item.Packages && typeof item.Packages === 'string' ? JSON.parse(item.Packages) : [],
    backgroundColor: item.BackgroundColor || '#FFFFFF',
    displayOrder: item.DisplayOrder || 99,
});


const transformTestimonial = (item: any): Testimonial => ({
    id: item.Id.toString(),
    name: item.Name || 'Anonymous',
    location: item.Location || 'Unknown',
    testimonial: item.Testimonial || '',
    imageUrl: parseNocoDbImageUrl(item.ImageUrl),
});


// --- Public API Service ---

export const api = {
    getProducts: async (searchQuery?: string): Promise<Product[]> => {
        const params = searchQuery ? { where: `(Name,like,%${searchQuery}%)~or(Description,like,%${searchQuery}%)` } : undefined;
        const items = await fetchData<any>(NOCODB_TABLES.PRODUCTS, params);
        return items.map(transformProduct);
    },
    getTherapies: async (searchQuery?: string): Promise<TherapyService[]> => {
        const params = searchQuery ? { where: `(Name,like,%${searchQuery}%)~or(Description,like,%${searchQuery}%)` } : undefined;
        const items = await fetchData<any>(NOCODB_TABLES.THERAPIES, params);
        return items.map(transformTherapy);
    },
    getBlogPosts: async (searchQuery?: string): Promise<BlogPost[]> => {
         const params = searchQuery ? { where: `(title,like,%${searchQuery}%)~or(content,like,%${searchQuery}%)` } : undefined;
        const items = await fetchData<any>(NOCODB_TABLES.BLOG_POSTS, params);
        return items.map(transformBlogPost).sort((a, b) => b.datePublished.getTime() - a.datePublished.getTime());
    },
    getServiceHighlights: async (): Promise<ServiceHighlight[]> => {
        const items = await fetchData<any>(NOCODB_TABLES.SERVICE_HIGHLIGHTS, { sort: 'DisplayOrder' });
        return items.map(transformServiceHighlight);
    },
    getTestimonials: async (): Promise<Testimonial[]> => {
        const items = await fetchData<any>(NOCODB_TABLES.TESTIMONIALS);
        return items.map(transformTestimonial);
    },
    submitBooking: async (bookingData: Record<string, any>): Promise<boolean> => {
        const url = `${API_BASE}/${NOCODB_TABLES.BOOKINGS}`;
        const headers = { 'Content-Type': 'application/json' };
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(bookingData),
            });
            return response.ok;
        } catch (error) {
            console.error("Failed to submit booking:", error);
            console.log("This might be due to an incorrect proxy configuration, a missing API key, or a network issue.");
            return false;
        }
    }
};