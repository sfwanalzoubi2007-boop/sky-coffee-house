// SKY Coffee House - Supabase configuration
// Leave these placeholders until you create/use YOUR OWN Supabase project.
// The client must NOT be created with placeholder values because that stops the whole
// customer JavaScript from loading (which would break the cart).
const SUPABASE_URL = 'https://aadsgpjfqzhkysrirgos.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable__Jr_khPA8_bItZj03E_yDA_BeUTjtzq';

let supabaseClient;

function hasValidSupabaseConfig() {
    return typeof SUPABASE_URL === 'string' &&
        typeof SUPABASE_ANON_KEY === 'string' &&
        SUPABASE_URL.startsWith('https://') &&
        !SUPABASE_URL.includes('YOUR_SUPABASE') &&
        !SUPABASE_ANON_KEY.includes('YOUR_SUPABASE');
}

if (typeof supabase !== 'undefined' && hasValidSupabaseConfig()) {
    try {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            realtime: { params: { eventsPerSecond: 20 }, multiTab: true }
        });
    } catch (error) {
        console.error('Supabase initialization failed:', error);
        supabaseClient = undefined;
    }
}
