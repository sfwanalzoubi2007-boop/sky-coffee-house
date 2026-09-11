/**
 * Rannaghor Table Management Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const tableInput = document.getElementById('tableCount');

    // Load persisted table count
    const savedCount = localStorage.getItem('sky_table_count');
    if (savedCount && tableInput) {
        tableInput.value = savedCount;
    }

    renderQRManagementGrid();

    // Listen for changes to table count
    if (tableInput) {
        tableInput.addEventListener('input', () => {
            // Persist the count
            localStorage.setItem('sky_table_count', tableInput.value);

            clearTimeout(tableInput._timeout);
            tableInput._timeout = setTimeout(renderQRManagementGrid, 300);
        });
    }

    // Initialize Lucide icons
    if (window.lucide) {
        lucide.createIcons();
    }
});

/**
 * Renders the grid of QR codes and table links
 */
function renderQRManagementGrid() {
    const qrGridContainer = document.getElementById('qrGridContainer');
    const tableInput = document.getElementById('tableCount');
    if (!qrGridContainer) return;

    // Use current value, fallback to HTML default value, fallback to 4 as absolute last resort
    const tableCount = parseInt(tableInput?.value) || parseInt(tableInput?.getAttribute('value')) || 4;
    const baseUrl = window.location.href.split('management/')[0];

    qrGridContainer.innerHTML = '';
    const fragment = document.createDocumentFragment();

    for (let i = 1; i <= tableCount; i++) {
        const tableNum = i;
        const orderUrl = `${baseUrl}index.html?table=${tableNum}`;

        const card = document.createElement('div');
        card.className = 'qr-management-card';

        card.innerHTML = `
            <div class="qr-card-header">
                <span class="qr-table-number">Table ${tableNum}</span>
                <button class="btn-icon-qr" title="Download QR" onclick="downloadQR('${tableNum}', 'https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(orderUrl)}&color=0d0500')">
                    <i data-lucide="download"></i>
                </button>
            </div>
            <div class="qr-card-body">
                <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(orderUrl)}&color=0d0500" 
                    alt="QR Table ${tableNum}"
                    loading="lazy"
                    class="qr-preview"
                />
            </div>
            <div class="qr-card-footer">
                <button class="btn btn-primary btn-sm btn-full" onclick="openTable('${orderUrl}')">
                    <i data-lucide="external-link"></i>
                    <span>Open Table Menu</span>
                </button>
            </div>
        `;

        fragment.appendChild(card);
    }

    qrGridContainer.appendChild(fragment);

    // Re-render icons for new elements
    if (window.lucide) {
        lucide.createIcons();
    }
}

/**
 * Opens a specific table menu in a new tab
 * @param {string} url - The full order URL
 */
window.openTable = (url) => {
    window.open(url, '_blank');
};

/**
 * Downloads the QR code as a PNG file.
 * @param {string} tableNum - The table number for the filename.
 * @param {string} url - The QR code image URL.
 */
window.downloadQR = async (tableNum, url) => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `table-${tableNum}-qr.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Cleanup
        setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    } catch (error) {
        console.error('Download failed:', error);
        alert("Failed to download QR code.");
    }
};
