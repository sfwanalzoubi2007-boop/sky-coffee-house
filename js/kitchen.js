function kitchenSupabaseReady() {
    return typeof SUPABASE_URL !== 'undefined' &&
        typeof SUPABASE_ANON_KEY !== 'undefined' &&
        typeof supabaseClient !== 'undefined' &&
        !String(SUPABASE_URL).includes('YOUR_SUPABASE') &&
        !String(SUPABASE_ANON_KEY).includes('YOUR_SUPABASE');
}

/**
 * Kitchen Dashboard Logic - SKY Coffee House
 * Handles Realtime Order Monitoring, Status Updates, Search, and Mobile UI
 */

// State
let orders = [];
let waiterCalls = [];
let openTableSessions = [];
let searchQuery = '';
let activeMobileColumn = 'received';

// DOM Elements
const DOM = {
    lists: {
        'received': document.getElementById('list-received'),
        'preparing': document.getElementById('list-preparing'),
        'ready': document.getElementById('list-ready'),
        'served': document.getElementById('list-served')
    },
    counts: {
        'received': document.getElementById('count-received'),
        'preparing': document.getElementById('count-preparing'),
        'ready': document.getElementById('count-ready'),
        'served': document.getElementById('count-served')
    },
    mobileCounts: {
        'received': document.getElementById('mobile-count-received'),
        'preparing': document.getElementById('mobile-count-preparing'),
        'ready': document.getElementById('mobile-count-ready'),
        'served': document.getElementById('mobile-count-served')
    },
    notificationSound: document.getElementById('orderSound'),
    orderSearch: document.getElementById('orderSearch'),
    clearSearch: document.getElementById('clearSearch'),
    mobileTabs: document.querySelectorAll('.mobile-tab'),
    columns: document.querySelectorAll('.order-column'),
    serviceAlerts: document.getElementById('serviceAlerts'),
    manualRefresh: document.getElementById('manualRefresh'),
    tableControls: document.getElementById('tableControls'),
    openTablesCount: document.getElementById('openTablesCount')
};

/**
 * Initialize Dashboard
 */
async function init() {

    setupEventListeners();
    if (!kitchenSupabaseReady()) {
        const statusEl = document.getElementById('connectionStatus');
        if (statusEl) { statusEl.textContent = 'وضع التجربة المحلي'; statusEl.className = 'status-badge status-online'; }
        loadSharedDemoOrders();
        loadSharedTableSessions();
        setupLocalDemoSync();
        return;
    }
    await Promise.all([
        fetchActiveOrders(),
        fetchWaiterCalls(),
        fetchOpenTableSessions()
    ]);
    // Setup Realtime connection (Instant updates)
    setupRealtime();

    // Background Sync Loop: Ensures data stays current even if Realtime is throttled/dropped
    // Runs every 5 seconds as a robust fallback for cross-device updates
    setInterval(async () => {
        await Promise.all([
            fetchActiveOrders(),
            fetchWaiterCalls(),
            fetchOpenTableSessions()
        ]);
        renderDashboard();
    }, 5000);

    // Initial render
    renderDashboard();

    // Initial Lucide icons render
    if (window.lucide) lucide.createIcons();
}

/**
 * Setup Event Listeners
 */
function setupEventListeners() {
    // Search
    if (DOM.orderSearch) {
        DOM.orderSearch.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase();
            if (DOM.clearSearch) {
                DOM.clearSearch.classList.toggle('hidden', !searchQuery);
            }
            renderDashboard();
        });
    }

    if (DOM.clearSearch) {
        DOM.clearSearch.addEventListener('click', () => {
            DOM.orderSearch.value = '';
            searchQuery = '';
            DOM.clearSearch.classList.add('hidden');
            renderDashboard();
        });
    }

    // Mobile Column Switching
    DOM.mobileTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const columnId = tab.dataset.column;
            switchMobileColumn(columnId);
        });
    });
    // Manual Refresh
    if (DOM.manualRefresh) {
        DOM.manualRefresh.addEventListener('click', () => {
            DOM.manualRefresh.classList.add('refreshing');
            Promise.all([
                fetchActiveOrders(),
                fetchWaiterCalls(),
                fetchOpenTableSessions()
            ]).finally(() => {
                setTimeout(() => DOM.manualRefresh.classList.remove('refreshing'), 500);
            });
        });
    }

    // Refresh on visibility change (more robust than focus)
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            Promise.all([
                fetchActiveOrders(),
                fetchWaiterCalls(),
                fetchOpenTableSessions()
            ]);
            // Ensure real-time is still healthy
            setupRealtime();
        }
    });

    // Also keep focus as a backup for some browsers
    window.addEventListener('focus', () => {
        if (document.visibilityState === 'visible') {
            fetchActiveOrders();
            fetchWaiterCalls();
            fetchOpenTableSessions();
        }
    });
}

/**
 * Switch Mobile Column
 */
function switchMobileColumn(columnId) {
    activeMobileColumn = columnId;

    // Update tabs
    DOM.mobileTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.column === columnId);
    });

    // Update columns
    DOM.columns.forEach(col => {
        col.classList.toggle('active', col.id === `column-${columnId}`);
    });
}

/**
 * Fetch orders that are not served yet, plus a small history of served orders
 */
async function fetchActiveOrders() {
    if (!kitchenSupabaseReady()) {
        loadSharedDemoOrders();
        return;
    }
    try {
        
        // 1. Fetch all active orders (received, preparing, ready)
        // This ensures the kitchen never "loses" an order that needs action
        const { data: activeData, error: activeError } = await supabaseClient
            .from('orders')
            .select('*')
            .in('status', ['received', 'preparing', 'ready'])
            .order('created_at', { ascending: true }); // Oldest first for active

        if (activeError) throw activeError;

        // 2. Fetch recent history (served)
        const { data: servedData, error: servedError } = await supabaseClient
            .from('orders')
            .select('*')
            .eq('status', 'served')
            .order('created_at', { ascending: false })
            .limit(15);

        if (servedError) throw servedError;

        // Combine and update state
        const allOrders = [...(activeData || []), ...(servedData || [])];
        
        // Use a Set to ensure uniqueness if any duplicates occur during merge
        const uniqueOrders = [];
        const seenIds = new Set();
        
        allOrders.forEach(o => {
            if (!seenIds.has(o.id)) {
                uniqueOrders.push(o);
                seenIds.add(o.id);
            }
        });

        orders = uniqueOrders;
        renderDashboard();
    } catch (err) {
        console.error('CRITICAL: Error fetching orders:', err.message);
        // If we have no orders at all, maybe show a warning in the UI
        if (orders.length === 0) {
            const statusEl = document.getElementById('connectionStatus');
            if (statusEl) {
                statusEl.textContent = 'Offline - Error Loading Orders';
                statusEl.className = 'status-badge status-offline';
            }
        }
    }
}

function loadSharedDemoOrders() {
    try {
        const data = JSON.parse(localStorage.getItem('sky_shared_orders') || '[]');
        orders = (Array.isArray(data) ? data : []).map(o => ({
            ...o,
            id: o.id || o.order_number,
            order_number: o.order_number || o.id,
            table_number: Number(o.table_number || o.table || 0),
            created_at: o.created_at || new Date().toISOString(),
            status: o.status || 'received'
        }));
        renderDashboard();
        const statusEl = document.getElementById('connectionStatus');
        if (statusEl) {
            statusEl.textContent = 'وضع التجربة المحلي';
            statusEl.className = 'status-badge status-online';
        }
    } catch (e) {
        console.error('Local demo orders error:', e);
        orders = [];
        renderDashboard();
    }
}

async function fetchOpenTableSessions() {
    if (!kitchenSupabaseReady()) {
        loadSharedTableSessions();
        return;
    }
    try {
        if (typeof supabaseClient === 'undefined' || typeof SUPABASE_URL === 'undefined' || SUPABASE_URL.includes('YOUR_SUPABASE')) return;
        const { data, error } = await supabaseClient
            .from('table_sessions')
            .select('id, table_number, status, opened_at')
            .eq('status', 'open')
            .order('table_number', { ascending: true });
        if (error) throw error;
        openTableSessions = data || [];
        renderTableControls();
    } catch (err) {
        console.error('Error fetching table sessions:', err.message);
    }
}

function renderTableControls() {
    if (!DOM.tableControls) return;
    const activeTables = new Set(orders.filter(o => ['received','preparing','ready'].includes(o.status)).map(o => Number(o.table_number)));
    if (DOM.openTablesCount) DOM.openTablesCount.textContent = `${openTableSessions.length} طاولة مفتوحة`;
    DOM.tableControls.innerHTML = openTableSessions.length ? openTableSessions.map(session => {
        const table = Number(session.table_number);
        const busy = activeTables.has(table);
        return `<div class="table-control">
            <strong>طاولة ${table}</strong>
            <small>${busy ? 'عليها طلبات' : 'جاهزة للإغلاق'}</small>
            <button class="btn-close-table" ${busy ? 'disabled title="يجب إنهاء الطلبات أولاً"' : ''} onclick="closeTable('${session.id}', ${table})">إغلاق الطاولة</button>
        </div>`;
    }).join('') : '<div style="color:#888;font-size:13px">لا توجد طاولات مفتوحة حالياً.</div>';
}

async function closeTable(sessionId, tableNumber) {
    const hasActive = orders.some(o => Number(o.table_number) === Number(tableNumber) && ['received','preparing','ready'].includes(o.status));
    if (!kitchenSupabaseReady()) {
        if (hasActive) {
            alert(`لا يمكن إغلاق طاولة ${tableNumber} قبل إنهاء جميع الطلبات.`);
            return;
        }
        if (!confirm(`إغلاق طاولة ${tableNumber}؟ بعد ذلك، عند مسح QR من جديد تبدأ جلسة جديدة.`)) return;
        try {
            const key = 'sky_shared_table_sessions';
            const sessions = JSON.parse(localStorage.getItem(key) || '[]');
            const updated = sessions.map(s => String(s.id) === String(sessionId)
                ? { ...s, status: 'closed', closed_at: new Date().toISOString() }
                : s);
            localStorage.setItem(key, JSON.stringify(updated));
            openTableSessions = updated.filter(s => s.status === 'open');
            renderTableControls();
            if ('BroadcastChannel' in window) {
                const channel = new BroadcastChannel('sky-coffee-orders');
                channel.postMessage({ type: 'table-closed', sessionId, tableNumber });
                channel.close();
            }
        } catch (err) {
            console.error('Local close table failed:', err);
            alert('تعذر إغلاق الطاولة.');
        }
        return;
    }
    if (hasActive) {
        alert(`لا يمكن إغلاق طاولة ${tableNumber} قبل إنهاء جميع الطلبات.`);
        return;
    }
    if (!confirm(`إغلاق طاولة ${tableNumber}؟ بعد ذلك، عند مسح QR من جديد تبدأ جلسة زبون جديدة.`)) return;
    try {
        // Close atomically in the database; the RPC refuses to close a table
        // while any order for that session is still active.
        const { data, error } = await supabaseClient.rpc('close_table_session', {
            p_session_id: sessionId
        });
        if (error) throw error;
        if (data === false) {
            alert(`لا يمكن إغلاق طاولة ${tableNumber} قبل إنهاء جميع الطلبات.`);
            await fetchActiveOrders();
            await fetchOpenTableSessions();
            return;
        }
        openTableSessions = openTableSessions.filter(s => s.id !== sessionId);
        renderTableControls();
    } catch (err) {
        console.error('Close table failed:', err);
        alert('تعذر إغلاق الطاولة. تأكد من اتصال قاعدة البيانات.');
    }
}


function loadSharedTableSessions() {
    try {
        const data = JSON.parse(localStorage.getItem('sky_shared_table_sessions') || '[]');
        openTableSessions = Array.isArray(data) ? data.filter(s => s.status === 'open') : [];
        renderTableControls();
    } catch (e) {
        openTableSessions = [];
        renderTableControls();
    }
}

async function fetchWaiterCalls() {
    if (!kitchenSupabaseReady()) {
        loadSharedWaiterCalls();
        return;
    }
    try {
        const { data, error } = await supabaseClient
            .from('waiter_calls')
            .select('*')
            .eq('status', 'pending')
            .order('created_at', { ascending: true });

        if (error) throw error;
        waiterCalls = data || [];
        renderServiceAlerts();
    } catch (err) {
        console.error('Error fetching waiter calls:', err.message);
    }
}

function loadSharedWaiterCalls() {
    try {
        const data = JSON.parse(localStorage.getItem('sky_shared_waiter_calls') || '[]');
        waiterCalls = Array.isArray(data) ? data.filter(c => c.status === 'pending') : [];
        renderServiceAlerts();
    } catch (_) { waiterCalls = []; renderServiceAlerts(); }
}

/**
 * Setup Realtime Listeners
 */
let pollingInterval = null;

function setupRealtime() {
    if (!kitchenSupabaseReady()) return;
    supabaseClient.removeAllChannels();

    // Orders Channel
    const ordersChannel = supabaseClient
        .channel('kitchen-orders')
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'orders'
        }, (payload) => {
            handleOrderUpdate(payload);
        })
        .subscribe((status) => {
        });

    // Waiter Calls Channel
    const waiterChannel = supabaseClient
        .channel('waiter-calls')
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'waiter_calls'
        }, (payload) => {
            handleWaiterUpdate(payload);
        })
        .subscribe((status) => {
            // No action needed for waiter status anymore
        });
}

function startPollingFallback() {
    // Polling removed as per user request
}

/**
 * Handle Realtime Payloads for Waiter
 */
function handleWaiterUpdate(payload) {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    if (eventType === 'INSERT') {
        if (newRecord.status === 'pending') {
            waiterCalls.push(newRecord);
            playNotification(); // Maybe a different sound eventually
        }
    } else if (eventType === 'UPDATE') {
        if (newRecord.status === 'resolved') {
            waiterCalls = waiterCalls.filter(c => c.id !== newRecord.id);
        } else {
            const index = waiterCalls.findIndex(c => c.id === newRecord.id);
            if (index !== -1) waiterCalls[index] = newRecord;
        }
    } else if (eventType === 'DELETE') {
        waiterCalls = waiterCalls.filter(c => c.id !== oldRecord.id);
    }

    renderServiceAlerts();
}

/**
 * Render Service Alerts (Waiter Calls)
 */
function renderServiceAlerts() {
    if (!DOM.serviceAlerts) return;

    if (waiterCalls.length === 0) {
        DOM.serviceAlerts.classList.add('hidden');
        DOM.serviceAlerts.innerHTML = '';
        return;
    }

    DOM.serviceAlerts.classList.remove('hidden');
    DOM.serviceAlerts.innerHTML = waiterCalls.map(call => `
        <div class="service-alert" data-call-id="${call.id}">
            <span class="alert-icon"><i data-lucide="bell"></i></span>
            <span class="alert-text">Table ${call.table_number} is calling!</span>
            <button class="btn-resolve-alert" onclick="resolveServiceAlert('${call.id}')">Handled</button>
        </div>
    `).join('');
    
    if (window.lucide) lucide.createIcons();
}

/**
 * Resolve Service Alert
 */
async function resolveServiceAlert(id) {
    if (!kitchenSupabaseReady()) return;
    try {
        // Optimistic UI
        waiterCalls = waiterCalls.filter(c => c.id !== id);
        renderServiceAlerts();

        const { error } = await supabaseClient
            .from('waiter_calls')
            .update({ status: 'resolved' })
            .eq('id', id);

        if (error) throw error;
    } catch (err) {
        console.error('Resolve failed:', err);
        fetchWaiterCalls();
    }
}

/**
 * Handle Realtime Payloads for Orders
 */
function handleOrderUpdate(payload) {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    if (eventType === 'INSERT') {
        if (!orders.find(o => o.id === newRecord.id)) {
            orders.unshift(newRecord);
            playNotification();
        }
    } else if (eventType === 'UPDATE') {
        const index = orders.findIndex(o => o.id === newRecord.id);
        if (index !== -1) orders[index] = newRecord;
        else orders.unshift(newRecord);
    } else if (eventType === 'DELETE') {
        orders = orders.filter(o => o.id !== oldRecord.id);
    }

    renderDashboard();
}

/**
 * Render all columns
 */
function renderDashboard() {
    // Apply search filter if active
    let filteredOrders = orders;
    if (searchQuery) {
        filteredOrders = orders.filter(o => {
            const tableNum = (o.table_number || '').toString();
            const orderNum = (o.order_number || '').toString();

            // Flexible table match: matches "4", "Table 4", or "t4"
            const tableMatch = tableNum.includes(searchQuery) ||
                `table ${tableNum}`.toLowerCase().includes(searchQuery) ||
                `t${tableNum}`.toLowerCase().includes(searchQuery);

            const orderMatch = orderNum.includes(searchQuery);

            // Check items for food names safely
            let foodMatch = false;
            try {
                const items = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
                if (Array.isArray(items)) {
                    foodMatch = items.some(item =>
                        (item.name && item.name.toLowerCase().includes(searchQuery))
                    );
                }
            } catch (e) {
                console.error("Error parsing items for search:", e);
            }

            return tableMatch || orderMatch || foodMatch;
        });
    }

    // Grouping
    const groups = {
        'received': filteredOrders.filter(o => o.status === 'received').sort((a, b) => new Date(a.created_at) - new Date(b.created_at)),
        'preparing': filteredOrders.filter(o => o.status === 'preparing').sort((a, b) => new Date(a.created_at) - new Date(b.created_at)),
        'ready': filteredOrders.filter(o => o.status === 'ready').sort((a, b) => new Date(a.created_at) - new Date(b.created_at)),
        'served': filteredOrders.filter(o => o.status === 'served').sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10)
    };

    // Update Counts
    let activeTotal = 0;
    Object.keys(groups).forEach(status => {
        const count = groups[status].length;
        if (DOM.counts[status]) DOM.counts[status].textContent = count;
        if (DOM.mobileCounts[status]) DOM.mobileCounts[status].textContent = count;
        if (status !== 'served') activeTotal += count;

        // Render List
        if (DOM.lists[status]) {
            const listEl = DOM.lists[status];
            const newOrders = groups[status];

            // Generate IDs string to check if the sequence changed
            const newIds = newOrders.map(o => o.id).join(',');
            const currentIds = Array.from(listEl.children).map(child => child.dataset.orderId).join(',');

            if (newIds !== currentIds) {
                // Sequence or items changed: Full refresh
                listEl.innerHTML = newOrders.map(o => createOrderCard(o)).join('');
            } else {
                // Sequence is same: Only update time labels for existing cards
                newOrders.forEach((order, idx) => {
                    const card = listEl.children[idx];
                    const timeInfo = getTimeInfo(order.created_at);
                    const timeEl = card.querySelector('.time-elapsed');
                    if (timeEl) {
                        const newTimeHtml = `<span class="time-icon"><i data-lucide="clock"></i></span> ${timeInfo.label}`;
                        if (timeEl.innerHTML !== newTimeHtml) {
                            timeEl.innerHTML = newTimeHtml;
                            // Also update classes for warnings
                            timeEl.className = `time-elapsed ${timeInfo.textClass}`;
                        }
                    }
                });
            }
        }
    });

    renderTableControls();
    if (window.lucide) lucide.createIcons();
}

/**
 * Helper to fix image paths for subfolder pages
 */
function fixImagePath(path) {
    if (!path) return '';
    // If it's a relative path starting with assets/, prefix with ../
    if (path.startsWith('assets/')) {
        return '../' + path;
    }
    return path;
}

/**
 * Create HTML for an order card
 */
function createOrderCard(order) {
    const timeInfo = getTimeInfo(order.created_at);
    const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;

    let actionBtn = '';
    if (order.status === 'received') {
        actionBtn = `<button class="btn-kitchen btn-next" onclick="updateStatus('${order.id}', 'preparing')">Start Cooking</button>`;
    } else if (order.status === 'preparing') {
        actionBtn = `<button class="btn-kitchen btn-finish" onclick="updateStatus('${order.id}', 'ready')">Ready</button>`;
    } else if (order.status === 'ready') {
        actionBtn = `<button class="btn-kitchen btn-serve" onclick="updateStatus('${order.id}', 'served')">Serve</button>`;
    } else {
        actionBtn = `<span class="served-badge">Served <i data-lucide="check-circle"></i></span>`;
    }

    return `
        <article class="kitchen-card ${timeInfo.class}" data-order-id="${order.id}">
            <div class="card-header">
                <span class="order-id">#${order.order_number}</span>
                <span class="table-badge">Table ${order.table_number}</span>
            </div>
            <div class="card-items">
                ${items.map(item => `
                    <div class="card-item-row">
                        <div class="item-name-wrapper">
                            ${item.image ? `<img src="${fixImagePath(item.image)}" alt="${item.name}" class="kitchen-item-thumb">` : `<span class="item-emoji">${item.emoji || '🍽️'}</span>`}
                            <span>${item.name}</span>
                        </div>
                        <span class="item-qty">x${item.qty}</span>
                    </div>
                `).join('')}
            </div>
            ${order.instructions ? `<div class="card-instructions">"${order.instructions}"</div>` : ''}
            <div class="card-footer">
                <span class="time-elapsed ${timeInfo.textClass}">
                    <span class="time-icon"><i data-lucide="clock"></i></span> ${timeInfo.label}
                </span>
                <div class="card-actions">
                    ${actionBtn}
                </div>
            </div>
        </article>
    `;
}

/**
 * Get time-based classes and labels
 */
function getTimeInfo(timestamp) {
    const diffMs = new Date() - new Date(timestamp);
    const mins = Math.floor(diffMs / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    let label = '';
    if (days > 0) {
        label = `${days}d ago`;
    } else if (hours > 0) {
        label = `${hours}h ago`;
    } else if (mins < 1) {
        label = 'Just now';
    } else {
        label = `${mins}m ago`;
    }

    let textClass = '';
    if (mins >= 15) textClass = 'time-danger';
    else if (mins >= 10) textClass = 'time-warning';

    return { label, textClass, class: '' };
}

/**
 * Update order status
 */
async function updateStatus(id, newStatus) {
    if (!kitchenSupabaseReady()) {
        const o = orders.find(o => String(o.id) === String(id));
        if (!o) return;
        o.status = newStatus;
        try {
            const all = JSON.parse(localStorage.getItem('sky_shared_orders') || '[]');
            const updated = all.map(x => String(x.id || x.order_number) === String(id) ? { ...x, status: newStatus } : x);
            localStorage.setItem('sky_shared_orders', JSON.stringify(updated));
            if ('BroadcastChannel' in window) {
                const channel = new BroadcastChannel('sky-coffee-orders');
                channel.postMessage({ type: 'status', id, status: newStatus });
                channel.close();
            }
        } catch (e) { console.error(e); }
        renderDashboard();
        return;
    }
    try {
        // Optimistic UI
        const o = orders.find(o => o.id === id);
        if (o) o.status = newStatus;
        renderDashboard();

        const { error } = await supabaseClient
            .from('orders')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) throw error;
    } catch (err) {
        console.error('Update failed:', err);
        await fetchActiveOrders();
    }
    await fetchOpenTableSessions();
}

function setupLocalDemoSync() {
    window.addEventListener('storage', (event) => {
        if (event.key === 'sky_shared_orders') loadSharedDemoOrders();
        if (event.key === 'sky_shared_waiter_calls') loadSharedWaiterCalls();
        if (event.key === 'sky_shared_table_sessions') loadSharedTableSessions();
    });
    if ('BroadcastChannel' in window) {
        const channel = new BroadcastChannel('sky-coffee-orders');
        channel.onmessage = () => { loadSharedDemoOrders(); loadSharedWaiterCalls(); };
    }
    setInterval(() => { loadSharedDemoOrders(); loadSharedWaiterCalls(); loadSharedTableSessions(); }, 2000);
}

function playNotification() {
    if (DOM.notificationSound) {
        DOM.notificationSound.play().catch(() => { });
    }
}

// Global scope for onclick
window.updateStatus = updateStatus;
window.closeTable = closeTable;

// Start app
document.addEventListener('DOMContentLoaded', init);
