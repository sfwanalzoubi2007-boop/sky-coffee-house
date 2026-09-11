/* ============================================
   RANNAGHOR - RESTAURANT ORDERING SYSTEM
   Complete JavaScript Application (FIXED)
   ============================================ */

// ==========================================
// 1. CONFIGURATION & DATA
// ==========================================

// Timing Constants (Issue #4: Magic Numbers)
const TIMINGS = {
    MODAL_TRANSITION: 300,      // Modal open/close animation duration
    TOAST_DURATION: 3000,        // How long toasts stay visible
    ANIMATION_DELAY: 100,        // General animation delay
    CART_TRANSITION: 300,        // Cart sidebar transition
    TABLE_SELECT_DELAY: 800,     // Delay before hiding welcome screen
    ORDER_STATUS_PREPARING: 5000,  // Time until order moves to "ready"
    ORDER_STATUS_READY: 15000,     // Time until order is "ready"
    ORDER_STATUS_SERVED: 25000     // Time until order is "served"
};

// Z-Index System (Issue #4: Magic Numbers)
const Z_INDEX = {
    MODAL: 3000,
    TOAST: 5000,
    NAVBAR: 1000,
    FLOATING: 1500,
    CART: 2000,
    OVERLAY: 1999,
    WELCOME: 100
};

const CONFIG = {
    vatRate: 0,
    currency: 'د.أ ',  // Fixed Issue #1: XSS - Changed from HTML to plain text
    currencySymbol: 'د.أ ',
    estimatedTime: '15-20 min',
    orderStatusDelay: {
        preparing: TIMINGS.ORDER_STATUS_PREPARING,
        ready: TIMINGS.ORDER_STATUS_READY,
        served: TIMINGS.ORDER_STATUS_SERVED
    },
    toastDuration: TIMINGS.TOAST_DURATION,
    animationDelay: TIMINGS.ANIMATION_DELAY
};

// Menu Items Data (Fallback data)
let menuItems = [
    {
        "id": 1,
        "name": "شاي منكّه",
        "nameEn": "Flavored Tea",
        "category": "hot",
        "price": 2.0,
        "image": "assets/images/sky-menu/hot.jpg",
        "desc": "شاي ساخن بنكهات مميزة.",
        "descEn": "Flavored Tea",
        "popular": false
    },
    {
        "id": 2,
        "name": "شاي أسود",
        "nameEn": "Black Tea",
        "category": "hot",
        "price": 1.5,
        "image": "assets/images/sky-menu/hot.jpg",
        "desc": "شاي أسود غني وعطري.",
        "descEn": "Black Tea",
        "popular": false
    },
    {
        "id": 3,
        "name": "قهوة تركية سنجل",
        "nameEn": "Turkish Single",
        "category": "hot",
        "price": 1.5,
        "image": "assets/images/sky-menu/hot.jpg",
        "desc": "قهوة تركية مركزة.",
        "descEn": "Turkish Single",
        "popular": false
    },
    {
        "id": 4,
        "name": "قهوة تركية دبل",
        "nameEn": "Turkish Double",
        "category": "hot",
        "price": 2.0,
        "image": "assets/images/sky-menu/hot.jpg",
        "desc": "قهوة تركية مضاعفة.",
        "descEn": "Turkish Double",
        "popular": false
    },
    {
        "id": 5,
        "name": "إسبريسو سنجل",
        "nameEn": "Espresso Single",
        "category": "hot",
        "price": 1.75,
        "image": "assets/images/sky-menu/hot.jpg",
        "desc": "إسبريسو مركز بحبوب مختارة.",
        "descEn": "Espresso Single",
        "popular": false
    },
    {
        "id": 6,
        "name": "إسبريسو دبل",
        "nameEn": "Espresso Double",
        "category": "hot",
        "price": 2.25,
        "image": "assets/images/sky-menu/hot.jpg",
        "desc": "إسبريسو دبل غني ومركز.",
        "descEn": "Espresso Double",
        "popular": false
    },
    {
        "id": 7,
        "name": "أمريكانو",
        "nameEn": "Americano",
        "category": "hot",
        "price": 2.5,
        "image": "assets/images/sky-menu/hot.jpg",
        "desc": "إسبريسو مع ماء ساخن.",
        "descEn": "Americano",
        "popular": false
    },
    {
        "id": 8,
        "name": "أمريكان",
        "nameEn": "American",
        "category": "hot",
        "price": 2.5,
        "image": "assets/images/sky-menu/hot.jpg",
        "desc": "قهوة أمريكية كلاسيكية.",
        "descEn": "American",
        "popular": false
    },
    {
        "id": 9,
        "name": "قهوة فلتر",
        "nameEn": "Filter Coffee",
        "category": "hot",
        "price": 2.5,
        "image": "assets/images/sky-menu/hot.jpg",
        "desc": "قهوة فلتر ناعمة وعطرية.",
        "descEn": "Filter Coffee",
        "popular": false
    },
    {
        "id": 10,
        "name": "كابتشينو",
        "nameEn": "Cappuccino",
        "category": "specialty-hot",
        "price": 2.5,
        "image": "assets/images/sky-menu/specialty.jpg",
        "desc": "إسبريسو مع حليب ورغوة ناعمة.",
        "descEn": "Cappuccino",
        "popular": false
    },
    {
        "id": 11,
        "name": "لاتيه",
        "nameEn": "Latte",
        "category": "specialty-hot",
        "price": 2.5,
        "image": "assets/images/sky-menu/specialty.jpg",
        "desc": "إسبريسو مع حليب كريمي.",
        "descEn": "Latte",
        "popular": false
    },
    {
        "id": 12,
        "name": "هوت شوكليت",
        "nameEn": "Hot Chocolate",
        "category": "specialty-hot",
        "price": 2.75,
        "image": "assets/images/sky-menu/specialty.jpg",
        "desc": "شوكولاتة ساخنة غنية وكريمية.",
        "descEn": "Hot Chocolate",
        "popular": false
    },
    {
        "id": 13,
        "name": "كراميل ماكياتو",
        "nameEn": "Caramel Macchiato",
        "category": "specialty-hot",
        "price": 3.5,
        "image": "assets/images/sky-menu/specialty.jpg",
        "desc": "إسبريسو وحليب مع لمسة كراميل.",
        "descEn": "Caramel Macchiato",
        "popular": false
    },
    {
        "id": 14,
        "name": "سبانش لاتيه",
        "nameEn": "Spanish Latte",
        "category": "specialty-hot",
        "price": 3.0,
        "image": "assets/images/sky-menu/specialty.jpg",
        "desc": "لاتيه كريمي بنكهة حلوة مميزة.",
        "descEn": "Spanish Latte",
        "popular": false
    },
    {
        "id": 15,
        "name": "موكا (أبيض، دارك)",
        "nameEn": "Mocha (White, Dark)",
        "category": "specialty-hot",
        "price": 3.5,
        "image": "assets/images/sky-menu/specialty.jpg",
        "desc": "إسبريسو مع الشوكولاتة والحليب.",
        "descEn": "Mocha (White, Dark)",
        "popular": false
    },
    {
        "id": 16,
        "name": "فلات وايت",
        "nameEn": "Flat White",
        "category": "specialty-hot",
        "price": 2.5,
        "image": "assets/images/sky-menu/specialty.jpg",
        "desc": "إسبريسو بحليب ناعم بقوام متوازن.",
        "descEn": "Flat White",
        "popular": true
    },
    {
        "id": 17,
        "name": "ماء",
        "nameEn": "Water",
        "category": "addons",
        "price": 0.0,
        "image": "assets/images/sky-menu/addons.jpg",
        "desc": "ماء.",
        "descEn": "Water",
        "popular": false
    },
    {
        "id": 18,
        "name": "شوت إضافي",
        "nameEn": "Extra Shot",
        "category": "addons",
        "price": 1.0,
        "image": "assets/images/sky-menu/addons.jpg",
        "desc": "إضافة شوت إسبريسو.",
        "descEn": "Extra Shot",
        "popular": false
    },
    {
        "id": 19,
        "name": "إضافة نكهة",
        "nameEn": "Add Flavor",
        "category": "addons",
        "price": 0.5,
        "image": "assets/images/sky-menu/addons.jpg",
        "desc": "إضافة نكهة حسب الاختيار.",
        "descEn": "Add Flavor",
        "popular": false
    },
    {
        "id": 20,
        "name": "كريمة مخفوقة إضافية",
        "nameEn": "Extra Whipped Cream",
        "category": "addons",
        "price": 0.5,
        "image": "assets/images/sky-menu/addons.jpg",
        "desc": "كريمة مخفوقة إضافية.",
        "descEn": "Extra Whipped Cream",
        "popular": false
    },
    {
        "id": 21,
        "name": "آيس كريم",
        "nameEn": "Ice Cream",
        "category": "addons",
        "price": 0.5,
        "image": "assets/images/sky-menu/addons.jpg",
        "desc": "إضافة آيس كريم.",
        "descEn": "Ice Cream",
        "popular": false
    },
    {
        "id": 22,
        "name": "فانيلا فرابيه",
        "nameEn": "Vanilla Frappe",
        "category": "frappe",
        "price": 3.5,
        "image": "assets/images/sky-menu/frappe.jpg",
        "desc": "فرابيه فانيلا بارد وكريمي.",
        "descEn": "Vanilla Frappe",
        "popular": false
    },
    {
        "id": 23,
        "name": "كراميل فرابيه",
        "nameEn": "Caramel Frappe",
        "category": "frappe",
        "price": 3.5,
        "image": "assets/images/sky-menu/frappe.jpg",
        "desc": "فرابيه كريمي بنكهة الكراميل.",
        "descEn": "Caramel Frappe",
        "popular": false
    },
    {
        "id": 24,
        "name": "موكا فرابيه (أبيض، دارك)",
        "nameEn": "Mocha Frappe (White, Dark)",
        "category": "frappe",
        "price": 3.5,
        "image": "assets/images/sky-menu/frappe.jpg",
        "desc": "فرابيه موكا بالشوكولاتة.",
        "descEn": "Mocha Frappe (White, Dark)",
        "popular": false
    },
    {
        "id": 25,
        "name": "آيس لاتيه",
        "nameEn": "Iced Latte",
        "category": "iced-coffee",
        "price": 2.5,
        "image": "assets/images/sky-menu/iced-coffee.jpg",
        "desc": "لاتيه بارد مع الثلج.",
        "descEn": "Iced Latte",
        "popular": false
    },
    {
        "id": 26,
        "name": "آيس أمريكان",
        "nameEn": "Iced American",
        "category": "iced-coffee",
        "price": 2.5,
        "image": "assets/images/sky-menu/iced-coffee.jpg",
        "desc": "قهوة أمريكية باردة.",
        "descEn": "Iced American",
        "popular": false
    },
    {
        "id": 27,
        "name": "آيس أمريكانو",
        "nameEn": "Iced Americano",
        "category": "iced-coffee",
        "price": 2.5,
        "image": "assets/images/sky-menu/iced-coffee.jpg",
        "desc": "أمريكانو بارد ومنعش.",
        "descEn": "Iced Americano",
        "popular": false
    },
    {
        "id": 28,
        "name": "آيس سبانش لاتيه",
        "nameEn": "Iced Spanish Latte",
        "category": "iced-coffee",
        "price": 3.0,
        "image": "assets/images/sky-menu/iced-coffee.jpg",
        "desc": "سبانش لاتيه بارد وكريمي.",
        "descEn": "Iced Spanish Latte",
        "popular": false
    },
    {
        "id": 29,
        "name": "شيكن إسبريسو",
        "nameEn": "Shaken Espresso",
        "category": "iced-coffee",
        "price": 3.5,
        "image": "assets/images/sky-menu/iced-coffee.jpg",
        "desc": "إسبريسو بارد مخفوق مع الثلج.",
        "descEn": "Shaken Espresso",
        "popular": false
    },
    {
        "id": 30,
        "name": "آيس موكا (أبيض، دارك)",
        "nameEn": "Iced Mocha (White, Dark)",
        "category": "iced-coffee",
        "price": 3.5,
        "image": "assets/images/sky-menu/iced-coffee.jpg",
        "desc": "موكا بارد بالشوكولاتة.",
        "descEn": "Iced Mocha (White, Dark)",
        "popular": false
    },
    {
        "id": 31,
        "name": "آيس كراميل ماكياتو",
        "nameEn": "Iced Caramel Macchiato",
        "category": "iced-coffee",
        "price": 3.5,
        "image": "assets/images/sky-menu/iced-coffee.jpg",
        "desc": "كراميل ماكياتو بارد.",
        "descEn": "Iced Caramel Macchiato",
        "popular": false
    },
    {
        "id": 32,
        "name": "آيس تي (خوخ، ليمون، توت العليق، باشن)",
        "nameEn": "Iced Tea (Peach, Lemon, Raspberry, Passion)",
        "category": "iced-tea",
        "price": 2.0,
        "image": "assets/images/sky-menu/iced-tea.jpg",
        "desc": "شاي بارد بنكهات منعشة.",
        "descEn": "Iced Tea (Peach, Lemon, Raspberry, Passion)",
        "popular": false
    },
    {
        "id": 33,
        "name": "برتقال",
        "nameEn": "Orange Juice",
        "category": "fresh-juice",
        "price": 3.5,
        "image": "assets/images/sky-menu/fresh-juice.jpg",
        "desc": "عصير برتقال طازج.",
        "descEn": "Orange Juice",
        "popular": false
    },
    {
        "id": 34,
        "name": "مانجا",
        "nameEn": "Mango Juice",
        "category": "fresh-juice",
        "price": 3.5,
        "image": "assets/images/sky-menu/fresh-juice.jpg",
        "desc": "عصير مانجا طازج.",
        "descEn": "Mango Juice",
        "popular": false
    },
    {
        "id": 35,
        "name": "فراولة",
        "nameEn": "Strawberry Juice",
        "category": "fresh-juice",
        "price": 3.5,
        "image": "assets/images/sky-menu/fresh-juice.jpg",
        "desc": "عصير فراولة منعش.",
        "descEn": "Strawberry Juice",
        "popular": false
    },
    {
        "id": 36,
        "name": "ليمون ونعنع",
        "nameEn": "Lemon & Mint",
        "category": "fresh-juice",
        "price": 3.5,
        "image": "assets/images/sky-menu/fresh-juice.jpg",
        "desc": "ليمون طازج مع النعنع.",
        "descEn": "Lemon & Mint",
        "popular": false
    },
    {
        "id": 37,
        "name": "كيوي",
        "nameEn": "Kiwi Juice",
        "category": "fresh-juice",
        "price": 3.5,
        "image": "assets/images/sky-menu/fresh-juice.jpg",
        "desc": "عصير كيوي منعش.",
        "descEn": "Kiwi Juice",
        "popular": false
    },
    {
        "id": 38,
        "name": "إضافة فراولة",
        "nameEn": "Strawberry Add-on",
        "category": "juice-addons",
        "price": 0.75,
        "image": "assets/images/sky-menu/fresh-juice.jpg",
        "desc": "إضافة فراولة.",
        "descEn": "Strawberry Add-on",
        "popular": false
    },
    {
        "id": 39,
        "name": "مانجا سموذي",
        "nameEn": "Mango Milk Smoothie",
        "category": "milk-smoothies",
        "price": 3.5,
        "image": "assets/images/sky-menu/milk-smoothies.jpg",
        "desc": "سموذي مانجا بالحليب.",
        "descEn": "Mango Milk Smoothie",
        "popular": false
    },
    {
        "id": 40,
        "name": "مانجا وباشن",
        "nameEn": "Mango & Passion Milk Smoothie",
        "category": "milk-smoothies",
        "price": 3.5,
        "image": "assets/images/sky-menu/milk-smoothies.jpg",
        "desc": "مانجا وباشن مع الحليب.",
        "descEn": "Mango & Passion Milk Smoothie",
        "popular": false
    },
    {
        "id": 41,
        "name": "فراولة سموذي",
        "nameEn": "Strawberry Milk Smoothie",
        "category": "milk-smoothies",
        "price": 3.5,
        "image": "assets/images/sky-menu/milk-smoothies.jpg",
        "desc": "سموذي فراولة بالحليب.",
        "descEn": "Strawberry Milk Smoothie",
        "popular": false
    },
    {
        "id": 42,
        "name": "ميكس بيري سموذي",
        "nameEn": "Mixed Berry Milk Smoothie",
        "category": "milk-smoothies",
        "price": 3.5,
        "image": "assets/images/sky-menu/milk-smoothies.jpg",
        "desc": "تشكيلة توت مع الحليب.",
        "descEn": "Mixed Berry Milk Smoothie",
        "popular": false
    },
    {
        "id": 43,
        "name": "ميلك بيناكولادا",
        "nameEn": "Milk Pina Colada",
        "category": "milk-smoothies",
        "price": 3.5,
        "image": "assets/images/sky-menu/milk-smoothies.jpg",
        "desc": "نكهة بيناكولادا كريمية بالحليب.",
        "descEn": "Milk Pina Colada",
        "popular": false
    },
    {
        "id": 44,
        "name": "سكاي ميلك سموذي",
        "nameEn": "SKY Milk Smoothie",
        "category": "milk-smoothies",
        "price": 4.0,
        "image": "assets/images/sky-menu/milk-smoothies.jpg",
        "desc": "خلطة سكاي المميزة بالحليب.",
        "descEn": "SKY Milk Smoothie",
        "popular": true
    },
    {
        "id": 45,
        "name": "مانجا مثلجة",
        "nameEn": "Frozen Mango",
        "category": "frozen",
        "price": 3.0,
        "image": "assets/images/sky-menu/frozen.jpg",
        "desc": "مشروب مانجا مثلج.",
        "descEn": "Frozen Mango",
        "popular": false
    },
    {
        "id": 46,
        "name": "باشن فروت مثلج",
        "nameEn": "Frozen Passionfruit",
        "category": "frozen",
        "price": 3.0,
        "image": "assets/images/sky-menu/frozen.jpg",
        "desc": "باشن فروت مثلج ومنعش.",
        "descEn": "Frozen Passionfruit",
        "popular": false
    },
    {
        "id": 47,
        "name": "مانجا وباشن مثلج",
        "nameEn": "Frozen Mango & Passion",
        "category": "frozen",
        "price": 3.0,
        "image": "assets/images/sky-menu/frozen.jpg",
        "desc": "مانجا وباشن مثلج.",
        "descEn": "Frozen Mango & Passion",
        "popular": false
    },
    {
        "id": 48,
        "name": "أناناس مثلج",
        "nameEn": "Frozen Pineapple",
        "category": "frozen",
        "price": 3.0,
        "image": "assets/images/sky-menu/frozen.jpg",
        "desc": "مشروب أناناس مثلج.",
        "descEn": "Frozen Pineapple",
        "popular": false
    },
    {
        "id": 49,
        "name": "فراولة مثلجة",
        "nameEn": "Frozen Strawberry",
        "category": "frozen",
        "price": 3.0,
        "image": "assets/images/sky-menu/frozen.jpg",
        "desc": "مشروب فراولة مثلج.",
        "descEn": "Frozen Strawberry",
        "popular": false
    },
    {
        "id": 50,
        "name": "ميكس بيري مثلج",
        "nameEn": "Frozen Mixed Berry",
        "category": "frozen",
        "price": 3.0,
        "image": "assets/images/sky-menu/frozen.jpg",
        "desc": "تشكيلة توت مثلجة.",
        "descEn": "Frozen Mixed Berry",
        "popular": false
    },
    {
        "id": 51,
        "name": "شيك فانيلا",
        "nameEn": "Vanilla Shake",
        "category": "shake",
        "price": 3.0,
        "image": "assets/images/sky-menu/shake.jpg",
        "desc": "شيك فانيلا كريمي.",
        "descEn": "Vanilla Shake",
        "popular": false
    },
    {
        "id": 52,
        "name": "شيك مانجا",
        "nameEn": "Mango Shake",
        "category": "shake",
        "price": 3.0,
        "image": "assets/images/sky-menu/shake.jpg",
        "desc": "شيك مانجا كريمي.",
        "descEn": "Mango Shake",
        "popular": false
    },
    {
        "id": 53,
        "name": "شيك شوكولاتة",
        "nameEn": "Chocolate Shake",
        "category": "shake",
        "price": 3.0,
        "image": "assets/images/sky-menu/shake.jpg",
        "desc": "شيك شوكولاتة غني.",
        "descEn": "Chocolate Shake",
        "popular": false
    },
    {
        "id": 54,
        "name": "آيس كريم عربي",
        "nameEn": "Arabic Ice Cream",
        "category": "shake",
        "price": 3.5,
        "image": "assets/images/sky-menu/shake.jpg",
        "desc": "آيس كريم عربي بنكهة مميزة.",
        "descEn": "Arabic Ice Cream",
        "popular": false
    }
];

// Hookah / Shisha Menu
const hookahItems = [
    { id: 101, name: 'ليمون ونعنع', nameEn: 'Lemon & Mint', category: 'hookah', price: 5.00, image: 'assets/images/sky-menu/hookah.jpg', desc: 'أرجيلة منعشة بنكهة الليمون والنعنع.', descEn: 'Refreshing hookah with lemon and mint.', popular: false },
    { id: 102, name: 'بطيخ ونعنع', nameEn: 'Watermelon & Mint', category: 'hookah', price: 5.00, image: 'assets/images/sky-menu/hookah.jpg', desc: 'نكهة بطيخ منعشة مع النعنع.', descEn: 'Refreshing watermelon and mint flavor.', popular: false },
    { id: 103, name: 'علكة وقرفة', nameEn: 'Gum & Cinnamon', category: 'hookah', price: 5.00, image: 'assets/images/sky-menu/hookah.jpg', desc: 'مزيج علكة وقرفة مميز.', descEn: 'A signature gum and cinnamon blend.', popular: false },
    { id: 104, name: 'علكة سهم', nameEn: 'Sahm Gum', category: 'hookah', price: 5.00, image: 'assets/images/sky-menu/hookah.jpg', desc: 'نكهة علكة مميزة.', descEn: 'Signature gum flavor.', popular: false },
    { id: 105, name: 'علكة ونعنع', nameEn: 'Gum & Mint', category: 'hookah', price: 5.00, image: 'assets/images/sky-menu/hookah.jpg', desc: 'علكة مع انتعاش النعنع.', descEn: 'Gum with a refreshing mint finish.', popular: false },
    { id: 106, name: 'مستكة', nameEn: 'Mastic', category: 'hookah', price: 5.00, image: 'assets/images/sky-menu/hookah.jpg', desc: 'نكهة مستكة عطرية.', descEn: 'Aromatic mastic flavor.', popular: false },
    { id: 107, name: 'كاندي', nameEn: 'Candy', category: 'hookah', price: 5.00, image: 'assets/images/sky-menu/hookah.jpg', desc: 'نكهة حلوة بطابع كاندي.', descEn: 'Sweet candy-inspired flavor.', popular: false },
    { id: 108, name: 'بلوبيري', nameEn: 'Blueberry', category: 'hookah', price: 5.00, image: 'assets/images/sky-menu/hookah.jpg', desc: 'نكهة بلوبيري غنية.', descEn: 'Rich blueberry flavor.', popular: false },
    { id: 109, name: 'LOVE', nameEn: 'LOVE', category: 'hookah', price: 5.00, image: 'assets/images/sky-menu/hookah.jpg', desc: 'خلطة LOVE المميزة.', descEn: 'Signature LOVE blend.', popular: false },
    { id: 110, name: 'عنب ونعنع', nameEn: 'Grape & Mint', category: 'hookah', price: 5.00, image: 'assets/images/sky-menu/hookah.jpg', desc: 'عنب منعش مع النعنع.', descEn: 'Refreshing grape and mint.', popular: false },
    { id: 111, name: 'عنب وتوت', nameEn: 'Grape & Berry', category: 'hookah', price: 5.00, image: 'assets/images/sky-menu/hookah.jpg', desc: 'مزيج العنب والتوت.', descEn: 'A blend of grape and berry.', popular: false },
    { id: 112, name: 'نعنع', nameEn: 'Mint', category: 'hookah', price: 5.00, image: 'assets/images/sky-menu/hookah.jpg', desc: 'نعنع منعش وكلاسيكي.', descEn: 'Classic refreshing mint.', popular: false },
    { id: 113, name: 'تفاحتين', nameEn: 'Two Apples', category: 'hookah', price: 5.00, image: 'assets/images/sky-menu/hookah.jpg', desc: 'نكهة التفاحتين الكلاسيكية.', descEn: 'Classic two-apple flavor.', popular: false },
    { id: 114, name: 'تفاحتين (نخلة)', nameEn: 'Two Apples (Nakhlah)', category: 'hookah', price: 6.00, image: 'assets/images/sky-menu/hookah.jpg', desc: 'تفاحتين من نخلة.', descEn: 'Nakhlah two-apple flavor.', popular: true }
];

// Special Items Data (Fallback data)
let specialItems = [
    { id: 'special1', name: 'سكاي ميلك سموذي', nameEn: 'SKY Milk Smoothie', price: 4.00, image: 'assets/images/sky-menu/milk-smoothies.jpg', desc: 'خلطة سكاي المميزة بالحليب.', descEn: 'SKY signature milk smoothie.', category: 'milk-smoothies' },
    { id: 'special2', name: 'سبانش لاتيه', nameEn: 'Spanish Latte', price: 3.00, image: 'assets/images/sky-menu/specialty.jpg', desc: 'لاتيه كريمي بنكهة حلوة مميزة.', descEn: 'Creamy latte with a signature sweet flavor.', category: 'specialty-hot' },
    { id: 'special3', name: 'كراميل ماكياتو', nameEn: 'Caramel Macchiato', price: 3.50, image: 'assets/images/sky-menu/specialty.jpg', desc: 'إسبريسو وحليب مع لمسة كراميل.', descEn: 'Espresso and milk with a caramel finish.', category: 'specialty-hot' }
];

// ==========================================
// 2. STATE MANAGEMENT
// ==========================================

let currentLanguage = localStorage.getItem('sky_language') || 'ar';

const state = {
    currentTable: null,
    tableSessionId: null,
    cart: [],
    orders: [],
    ratings: {},  // { orderId: { itemId: { stars, feedback } } }
    itemRatingsData: {},  // { itemId: { avg, count, reviews: [{stars, feedback, date}] } }
    selectedCategory: 'all',
    searchQuery: '',
    selectedItem: null,
    selectedItemQty: 1,
    isCartOpen: false,
    specialItemsInitialized: false, // Flag to prevent multiple listeners
    html5QrCode: null, // QR Scanner instance
    ratingOrderId: null // Currently rating order
};

// ==========================================
// LANGUAGE & BRANDING
// ==========================================
function itemName(item) { return currentLanguage === 'ar' ? item.name : (item.nameEn || item.name); }
function itemDesc(item) { return currentLanguage === 'ar' ? (item.desc || '') : (item.descEn || item.desc || ''); }
function money(value) { return `${CONFIG.currency}${Number(value).toFixed(2)}`; }

const UI_TEXT = {
    ar: {
        orders:'طلباتي', waiter:'طلب النادل', cart:'السلة', yourOrder:'طلبك', empty:'السلة فارغة', emptySub:'أضف بعض المشروبات اللذيذة!', subtotal:'المجموع الفرعي', vat:'الضريبة', total:'الإجمالي', instructions:'ملاحظات خاصة (اختياري)', instructionsPh:'هل لديك حساسية أو طلب خاص؟', cash:'الدفع نقداً', cashSub:'يرجى الدفع عند الكاشير', place:'تأكيد الطلب', menu:'قائمة المشروبات', menuSub:'مشروبات محضّرة بعناية في SKY Coffee House', search:'ابحث عن مشروب...', all:'الكل', add:'إضافة +', popular:'الأكثر طلباً', specials:'اختيارات SKY', specialEyebrow:'اختياراتنا المميزة', features:'لماذا SKY؟', expert:'جودة عالية', fresh:'مكونات طازجة', quick:'خدمة سريعة', quality:'تجربة مميزة', noResults:'لم يتم العثور على نتائج', noResultsSub:'جرّب كلمة بحث أخرى', contact:'تواصل معنا', hours:'ساعات العمل', quickLinks:'روابط سريعة', menuLink:'القائمة', specialsLink:'اختيارات SKY', about:'من نحن', privacy:'الخصوصية', table:'الطاولة', close:'إغلاق', rate:'قيّم طلبك', english:'English'
    },
    en: {
        orders:'My Orders', waiter:'Call Waiter', cart:'Cart', yourOrder:'Your Order', empty:'Your cart is empty', emptySub:'Add some delicious drinks!', subtotal:'Subtotal', vat:'Tax', total:'Total', instructions:'Special Instructions (Optional)', instructionsPh:'Any allergies or special requests?', cash:'Cash Payment', cashSub:'Please pay at the counter', place:'Place Order', menu:'Drinks Menu', menuSub:'Carefully crafted drinks at SKY Coffee House', search:'Search drinks...', all:'All', add:'Add +', popular:'Popular', specials:'SKY Picks', specialEyebrow:'Our Signature Picks', features:'Why SKY?', expert:'High Quality', fresh:'Fresh Ingredients', quick:'Quick Service', quality:'Signature Experience', noResults:'No results found', noResultsSub:'Try a different search term', contact:'Contact Us', hours:'Opening Hours', quickLinks:'Quick Links', menuLink:'Menu', specialsLink:'SKY Picks', about:'About Us', privacy:'Privacy', table:'Table', close:'Close', rate:'Rate Your Order', english:'العربية'
    }
};
function applyLanguage() {
    const t=UI_TEXT[currentLanguage];
    document.documentElement.lang=currentLanguage; document.documentElement.dir=currentLanguage==='ar'?'rtl':'ltr';
    const set=(id,val)=>{const el=document.getElementById(id); if(el) el.textContent=val;};
    set('viewOrdersBtnText',t.orders); set('callWaiterBtnText',t.waiter); set('cartBtnText',t.cart); set('cartTitle',t.yourOrder);
    set('emptyCartTitle',t.empty); set('emptyCartSubtitle',t.emptySub); set('subtotalLabel',t.subtotal); set('vatLabel',t.vat); set('totalLabel',t.total);
    set('instructionsLabel',t.instructions); set('cashLabel',t.cash); set('cashSublabel',t.cashSub); set('placeOrderText',t.place);
    set('menuTitleText',t.menu); set('menuSubtitleText',t.menuSub); set('noResultsTitle',t.noResults); set('noResultsSubtitle',t.noResultsSub);
    set('featuresTitleText',t.features); set('featureExpertTitle',t.expert); set('featureFreshTitle',t.fresh); set('featureQuickTitle',t.quick); set('featureQualityTitle',t.quality);
    set('contactTitle',t.contact); set('hoursTitle',t.hours); set('quickLinksTitle',t.quickLinks); set('menuLinkText',t.menuLink); set('specialsLinkText',t.specialsLink); set('aboutLinkText',t.about); set('privacyLinkText',t.privacy);
    set('languageToggleText',t.english); document.title=currentLanguage==='ar'?'SKY Coffee House | القائمة':'SKY Coffee House | Menu';
    const search=document.getElementById('menuSearch'); if(search) search.placeholder=t.search;
    document.querySelectorAll('.category-tab').forEach(b=>{ const key=b.dataset.category; const names={all:['الكل','All'],hot:['مشروبات ساخنة','Hot Drinks'],'specialty-hot':['قهوة ساخنة مميزة','Specialty Hot'],frappe:['فرابيه','Frappe'],'iced-coffee':['قهوة باردة','Iced Coffee'],'iced-tea':['شاي بارد','Iced Tea'],'fresh-juice':['عصائر طازجة','Fresh Juice'],'juice-addons':['إضافات العصائر','Juice Add-ons'],'milk-smoothies':['سموذي بالحليب','Milk Smoothies'],frozen:['مشروبات مثلجة','Frozen Drinks'],shake:['شيك','Shake'],addons:['إضافات','Add-ons']}; if(names[key]) b.querySelector('.tab-text').textContent=names[key][currentLanguage==='ar'?0:1]; });
    renderSpecials(); renderMenu(state.selectedCategory,state.searchQuery); updateCart();
}
function toggleLanguage(){ currentLanguage=currentLanguage==='ar'?'en':'ar'; localStorage.setItem('sky_language',currentLanguage); applyLanguage(); }

// ==========================================
// 3. DOM ELEMENTS
// ==========================================

const DOM = {
    // Welcome Screen
    welcomeScreen: document.getElementById('welcomeScreen'),
    qrGridContainer: document.getElementById('qrGridContainer'),
    kitchenAdminBtn: document.getElementById('kitchenAdminBtn'),


    // Navigation
    navbar: document.getElementById('navbar'),
    tableBadge: document.getElementById('tableBadge'),
    tableNumberDisplay: document.getElementById('tableNumberDisplay'),


    // Main Content
    mainContent: document.getElementById('mainContent'),

    // Menu
    menuGrid: document.getElementById('menuGrid'),
    categoryTabs: document.querySelectorAll('.category-tab'),
    menuSearch: document.getElementById('menuSearch'),
    clearSearch: document.getElementById('clearSearch'),
    noResults: document.getElementById('noResults'),

    // Cart
    cartBtn: document.getElementById('cartBtn'),
    cartSidebar: document.getElementById('cartSidebar'),
    cartOverlay: document.getElementById('cartOverlay'),
    closeCart: document.getElementById('closeCart'),
    cartItems: document.getElementById('cartItems'),
    emptyCart: document.getElementById('emptyCart'),
    cartSummary: document.getElementById('cartSummary'),
    cartCount: document.getElementById('cartCount'),
    cartTableNumber: document.getElementById('cartTableNumber'),
    subtotal: document.getElementById('subtotal'),
    vat: document.getElementById('vat'),
    total: document.getElementById('total'),
    instructions: document.getElementById('instructions'),
    placeOrderBtn: document.getElementById('placeOrder'),

    // Floating Elements

    floatingTrackOrder: document.getElementById('floatingTrackOrder'),
    floatingTrackBtn: document.getElementById('floatingTrackBtn'),
    floatingOrderCount: document.getElementById('floatingOrderCount'),
    backToTop: document.getElementById('backToTop'),

    // Modals
    successModal: document.getElementById('successModal'),
    orderNumber: document.getElementById('orderNumber'),
    successTableNumber: document.getElementById('successTableNumber'),
    closeSuccessModal: document.getElementById('closeSuccessModal'),

    ordersModal: document.getElementById('ordersModal'),
    ordersList: document.getElementById('ordersList'),
    noOrders: document.getElementById('noOrders'),
    closeOrdersModal: document.getElementById('closeOrdersModal'),
    viewOrdersBtn: document.getElementById('viewOrdersBtn'),
    mobileOrdersBtn: document.getElementById('bottomNavOrdersBtn'), // Updated to new ID

    trackOrderModal: document.getElementById('trackOrderModal'),
    trackOrderList: document.getElementById('trackOrderList'),
    noActiveOrders: document.getElementById('noActiveOrders'),
    closeTrackOrderModal: document.getElementById('closeTrackOrderModal'),

    callWaiterBtn: document.getElementById('callWaiterBtn'),

    itemModal: document.getElementById('itemModal'),
    closeItemModal: document.getElementById('closeItemModal'),
    itemModalIcon: document.getElementById('itemModalIcon'),
    itemModalTitle: document.getElementById('itemModalTitle'),
    itemModalDesc: document.getElementById('itemModalDesc'),
    itemModalPrice: document.getElementById('itemModalPrice'),
    itemQtyMinus: document.getElementById('itemQtyMinus'),
    itemQtyValue: document.getElementById('itemQtyValue'),
    itemQtyPlus: document.getElementById('itemQtyPlus'),
    itemTotalPrice: document.getElementById('itemTotalPrice'),
    addItemToCart: document.getElementById('addItemToCart'),
    itemModalAvgRating: document.getElementById('itemModalAvgRating'),
    itemModalRatingCount: document.getElementById('itemModalRatingCount'),
    itemReviewsList: document.getElementById('itemReviewsList'),
    noReviews: document.getElementById('noReviews'),

    // Order Badges
    activeOrdersBadge: document.getElementById('activeOrdersBadge'),
    mobileOrdersBadge: document.getElementById('bottomNavOrdersBadge'),

    // Toast Container
    toastContainer: document.getElementById('toastContainer'),

    // Rating Modal
    ratingModal: document.getElementById('ratingModal'),
    ratingView: document.getElementById('ratingView'),
    ratingOrderNumber: document.getElementById('ratingOrderNumber'),
    ratingItemsList: document.getElementById('ratingItemsList'),
    closeRatingModal: document.getElementById('closeRatingModal'),
    skipRating: document.getElementById('skipRating'),
    submitRating: document.getElementById('submitRating'),

    // Item Modal Rating & Reviews
    itemModalRating: document.getElementById('itemModalRating'),
    itemModalAvgRating: document.getElementById('itemModalAvgRating'),
    itemModalRatingCount: document.getElementById('itemModalRatingCount'),
    itemReviewsList: document.getElementById('itemReviewsList'),
    noReviews: document.getElementById('noReviews'),
};

function isSupabaseConfigured() {
    return typeof SUPABASE_URL !== 'undefined' &&
        typeof SUPABASE_ANON_KEY !== 'undefined' &&
        typeof supabaseClient !== 'undefined' &&
        typeof SUPABASE_URL === 'string' &&
        typeof SUPABASE_ANON_KEY === 'string' &&
        !SUPABASE_URL.includes('YOUR_SUPABASE') &&
        !SUPABASE_ANON_KEY.includes('YOUR_SUPABASE');
}

// ==========================================
// 4. INITIALIZATION
// ==========================================

async function init() {
    const tableFromURL = getTableFromURL();

    if (tableFromURL) {
        setTable(tableFromURL);
        await ensureTableSession(tableFromURL);
    } else {
        // Redirect to Management Dashboard if no table is selected
        window.location.href = 'management/';
    }

    setupEventListeners();
    initScrollObserver();

    // Fetch dynamic menu items from Supabase
    await fetchMenuItems();

    // Fetch item ratings from Supabase
    await fetchItemRatings();

    // Initialize special items listeners ONCE
    initSpecialItems();

    // Sync active orders with Supabase Realtime
    syncActiveOrders();

    // Initial Lucide icons render
    if (window.lucide) lucide.createIcons();
}

/**
 * Sync active orders from LocalStorage with Supabase
 */
function syncActiveOrders() {
    if (typeof SUPABASE_URL === 'undefined' || !isSupabaseConfigured()) return;

    state.orders.forEach(order => {
        if (order.status !== 'served') {
            subscribeToOrderUpdates(order.id);
        }
    });
}

/**
 * Fetch menu items from Supabase
 */
async function fetchMenuItems() {
    // SKY Coffee House uses the local menu defined above.
    // Keeping the menu local prevents the original restaurant's menu from overwriting SKY's menu.
    renderSpecials();
    renderMenu(state.selectedCategory, state.searchQuery);
}

document.addEventListener('DOMContentLoaded', () => { init(); setTimeout(applyLanguage, 0); });

// ==========================================
// 5. TABLE DETECTION & SELECTION
// ==========================================

function getTableFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('table');
}

async function ensureTableSession(tableNumber) {
    if (!tableNumber) return false;

    // Local fallback: keep table sessions in shared localStorage so the
    // customer page and kitchen page still work together without Supabase.
    if (!isSupabaseConfigured()) {
        try {
            const table = parseInt(tableNumber, 10);
            if (!Number.isFinite(table)) return false;
            const key = 'sky_shared_table_sessions';
            const sessions = JSON.parse(localStorage.getItem(key) || '[]');
            const open = sessions.find(s => Number(s.table_number) === table && s.status === 'open');
            if (open) {
                state.tableSessionId = open.id;
                return true;
            }
            const id = (globalThis.crypto && crypto.randomUUID)
                ? crypto.randomUUID()
                : `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
            sessions.push({ id, table_number: table, status: 'open', opened_at: new Date().toISOString() });
            localStorage.setItem(key, JSON.stringify(sessions));
            state.tableSessionId = id;
            return true;
        } catch (err) {
            console.error('Local table session error:', err);
            return false;
        }
    }

    try {
        const table = parseInt(tableNumber, 10);
        if (!Number.isFinite(table)) return false;
        const { data: existing, error: readError } = await supabaseClient
            .from('table_sessions')
            .select('id, session_token, status')
            .eq('table_number', table)
            .eq('status', 'open')
            .order('opened_at', { ascending: false })
            .limit(1)
            .maybeSingle();
        if (readError) throw readError;
        if (existing) {
            state.tableSessionId = existing.id;
            return true;
        }
        const token = (crypto && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const { data: created, error: createError } = await supabaseClient
            .from('table_sessions')
            .insert([{ table_number: table, session_token: token, status: 'open' }])
            .select('id')
            .single();
        if (createError) {
            // Another phone may have opened the table at the same moment; reuse it.
            const { data: retry } = await supabaseClient
                .from('table_sessions')
                .select('id')
                .eq('table_number', table)
                .eq('status', 'open')
                .order('opened_at', { ascending: false })
                .limit(1)
                .maybeSingle();
            if (retry) {
                state.tableSessionId = retry.id;
                return true;
            }
            throw createError;
        }
        state.tableSessionId = created.id;
        return true;
    } catch (err) {
        console.error('Table session error:', err);
        showToast('تعذر فتح جلسة الطاولة. حاول مرة أخرى.', 'warning');
        return false;
    }
}

async function isTableSessionOpen() {
    if (!state.currentTable || !state.tableSessionId) return true;

    if (!isSupabaseConfigured()) {
        try {
            const sessions = JSON.parse(localStorage.getItem('sky_shared_table_sessions') || '[]');
            return sessions.some(s => String(s.id) === String(state.tableSessionId) && s.status === 'open');
        } catch (_) {
            return false;
        }
    }

    const { data, error } = await supabaseClient
        .from('table_sessions')
        .select('status')
        .eq('id', state.tableSessionId)
        .maybeSingle();
    if (error) {
        console.error('Session check failed:', error);
        return false;
    }
    return data?.status === 'open';
}

function setTable(tableNumber) {
    if (!tableNumber) return;

    state.currentTable = tableNumber;

    const url = new URL(window.location);
    url.searchParams.set('table', tableNumber);
    window.history.pushState({}, '', url);

    updateTableDisplays(tableNumber);
    hideWelcomeScreen();
    showMainContent();
    loadFromStorage();
    renderSpecials();
    renderMenu();
    updateOrderBadges();


}

function updateTableDisplays(tableNumber) {
    const displays = [
        DOM.tableNumberDisplay,
        DOM.heroTableNumber,
        DOM.cartTableNumber,
        DOM.successTableNumber
    ];

    displays.forEach(el => {
        if (el) el.textContent = tableNumber;
    });

    if (DOM.tableBadge) {
        DOM.tableBadge.classList.remove('hidden');
    }
}

function showWelcomeScreen() {
    if (DOM.welcomeScreen) {
        DOM.welcomeScreen.style.display = 'flex';
        document.body.classList.add('welcome-active');
    }
}

function hideWelcomeScreen() {
    if (DOM.welcomeScreen) {
        DOM.welcomeScreen.style.display = 'none';
        document.body.classList.remove('welcome-active');
    }
}

function showMainContent() {
    if (DOM.mainContent) {
        DOM.mainContent.classList.add('visible');
    }
}

// ==========================================
// 6. MENU FUNCTIONS
// ==========================================

function renderMenu(category = 'all', searchQuery = '') {
    if (!DOM.menuGrid) return;

    let filtered = category === 'hookah' ? [...hookahItems] : [...menuItems, ...hookahItems];

    if (category !== 'all') {
        filtered = filtered.filter(item => item.category === category);
    }

    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(item =>
            item.name.toLowerCase().includes(query) ||
            (item.nameEn || '').toLowerCase().includes(query) ||
            (item.desc || '').toLowerCase().includes(query) ||
            (item.descEn || '').toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)
        );
    }

    if (filtered.length === 0) {
        DOM.noResults.classList.remove('hidden');
        DOM.menuGrid.innerHTML = '';
        return;
    } else {
        DOM.noResults.classList.add('hidden');
    }

    DOM.menuGrid.innerHTML = filtered.map((item, index) => createMenuItemHTML(item, index)).join('');

    // Re-initialize icons for new menu items
    if (window.lucide) lucide.createIcons();

    observeScrollElements();
    attachMenuItemListeners();
}

function createMenuItemHTML(item, index) {
    const delay = Math.min(index * 0.05, 0.5);
    const ratingData = state.itemRatingsData[item.id];
    const avgRating = ratingData ? ratingData.avg.toFixed(1) : '0.0';
    const ratingCount = ratingData ? ratingData.count : 0;

    const ratingHTML = `
        <div class="food-card-rating">
            <span class="card-rating-star"><i data-lucide="star" class="icon-star-filled"></i></span>
            <span class="card-rating-value">${avgRating}</span>
            <span class="card-rating-count">(${ratingCount})</span>
        </div>
    `;

    return `
        <article class="food-card scroll-reveal" data-id="${item.id}" role="listitem" style="transition-delay: ${delay}s">
            <div class="food-card-image">
                <img src="${item.image}" alt="${itemName(item)}" loading="lazy" onerror="this.src='https://placehold.co/400x400/1a1a1a/ffffff?text=${encodeURIComponent(item.name)}'">
                <div class="food-card-badges">
                    ${item.popular ? `<span class="food-badge popular">${UI_TEXT[currentLanguage].popular}</span>` : ''}
                </div>
                ${ratingHTML}
            </div>
            <div class="food-card-content">
                <div class="food-card-header">
                    <h3 class="food-card-title">${itemName(item)}</h3>
                </div>
                <p class="food-card-description">${itemDesc(item)}</p>
                <div class="food-card-footer">
                    <span class="food-card-price gradient-text">${money(item.price)}</span>
                    <button class="btn btn-primary btn-add btn-menu-item" data-id="${item.id}" aria-label="Add ${itemName(item)} to cart">
                        ${UI_TEXT[currentLanguage].add}
                    </button>
                </div>
            </div>
        </article>
    `;
}

// Attach listeners ONLY to menu grid items (not special items)
function attachMenuItemListeners() {
    // No direct listeners needed - handled by universal event delegation in setupEventListeners()
}

// Render Special Items dynamically
function renderSpecials() {
    const specialsContainer = document.getElementById('specials');
    if (!specialsContainer || specialItems.length === 0) return;

    let slidesHTML = '';
    let dotsHTML = '<div class="slider-pagination">';

    specialItems.forEach((item, index) => {
        const isActive = index === 0 ? 'active' : '';
        const badgeHTML = item.price < (item.originalPrice || item.price)
            ? `<div class="special-badge discount">SALE</div>`
            : `<div class="special-badge chef">CHEF'S PICK</div>`;
        const originalPriceHTML = item.originalPrice
            ? `<span class="price-original">${money(item.originalPrice)}</span>`
            : '';

        slidesHTML += `
            <div class="slide ${isActive}">
                <div class="slide-bg" style="background-image: url('${item.image}');"></div>
                <div class="slide-overlay"></div>
                <div class="slide-content">
                    <span class="slide-eyebrow">${UI_TEXT[currentLanguage].specialEyebrow}</span>
                    ${badgeHTML}
                    <h3 class="slide-title">${itemName(item)}</h3>
                    <p class="slide-description">${itemDesc(item)}</p>
                    <div class="special-rating" data-id="${item.id}">
                        <span class="card-rating-star"><i data-lucide="star" class="icon-star-filled"></i></span>
                        <span class="card-rating-value">0.0</span>
                        <span class="card-rating-count">(0)</span>
                    </div>
                    <div class="slide-footer">
                        <div class="slide-price">
                            <span class="price-current">${money(item.price)}</span>
                            ${originalPriceHTML}
                        </div>
                        <button class="btn btn-primary btn-add btn-special" data-id="${item.id}">${UI_TEXT[currentLanguage].add}</button>
                    </div>
                </div>
            </div>
        `;
        dotsHTML += `<button class="slider-dot ${isActive}" aria-label="Go to slide ${index + 1}"></button>`;
    });

    dotsHTML += '</div>';
    specialsContainer.innerHTML = slidesHTML + dotsHTML;

    // Reset initialization state so listeners can be attached to new DOM elements
    state.specialItemsInitialized = false;

    // Clear old interval to prevent overlapping slider timers
    if (state.slideInterval) {
        clearInterval(state.slideInterval);
    }

    // Re-initialize Lucide icons for the new injected HTML
    if (window.lucide) {
        lucide.createIcons();
    }

    initSpecialItems();
}

// Initialize special items separately
function initSpecialItems() {
    if (state.specialItemsInitialized) return;

    // No direct listeners needed for add buttons or click details - handled by delegation


    // Initial sync of ratings if data already exists
    if (Object.keys(state.itemRatingsData).length > 0) {
        updateSpecialsRatings();
    }

    // Slider logic
    const slides = document.querySelectorAll('.specials-slider .slide');
    const dots = document.querySelectorAll('.slider-dot');
    let currentSlide = 0;

    if (slides.length > 0) {
        const showSlide = (index) => {
            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));

            if (slides[index]) slides[index].classList.add('active');
            if (dots[index]) dots[index].classList.add('active');
            currentSlide = index;
        };

        const nextSlide = () => {
            let next = (currentSlide + 1) % slides.length;
            showSlide(next);
        };

        // Start auto-play
        const startSlider = () => {
            if (state.slideInterval) clearInterval(state.slideInterval);
            state.slideInterval = setInterval(nextSlide, 5000);
        };

        // Handle dot clicks and hovers
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                startSlider();
            });
            dot.addEventListener('mouseenter', () => {
                showSlide(index);
                clearInterval(state.slideInterval);
            });
            dot.addEventListener('mouseleave', () => {
                startSlider();
            });
        });

        // Initialize first slide and start playback
        showSlide(0);
        startSlider();
    }

    state.specialItemsInitialized = true;
}

function setCategory(category) {
    state.selectedCategory = category;

    DOM.categoryTabs.forEach(tab => {
        const isActive = tab.dataset.category === category;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', isActive);
    });

    renderMenu(category, state.searchQuery);
}

// ==========================================
// 7. SEARCH FUNCTIONALITY
// ==========================================

function handleSearch(query) {
    state.searchQuery = query;

    if (DOM.clearSearch) {
        DOM.clearSearch.classList.toggle('hidden', !query);
    }

    renderMenu(state.selectedCategory, query);
}

function clearSearch() {
    state.searchQuery = '';
    if (DOM.menuSearch) {
        DOM.menuSearch.value = '';
    }
    if (DOM.clearSearch) {
        DOM.clearSearch.classList.add('hidden');
    }
    renderMenu(state.selectedCategory, '');
}

// ==========================================
// 8. CART FUNCTIONS
// ==========================================

function addToCart(id) {
    try {
        let item = [...menuItems, ...specialItems, ...hookahItems].find(i => String(i.id) === String(id));
        if (!item) {
            console.error('Item not found for ID:', id);
            return;
        }

        const existingItem = state.cart.find(i => String(i.id) === String(id));

        if (existingItem) {
            existingItem.qty++;
        } else {
            state.cart.push({ ...item, qty: 1 });
        }

        updateCart();
        saveToStorage();
        showToast(`${itemName(item)} added to cart! 🛒`);
        animateCartIcon();
    } catch (error) {
        console.error('Error in addToCart:', error);
        showToast('Error adding to cart', 'error');
    }
}

function addToCartWithQty(id, qty) {
    let item = [...menuItems, ...specialItems, ...hookahItems].find(i => String(i.id) === String(id));
    if (!item || qty < 1) return;

    const existingItem = state.cart.find(i => String(i.id) === String(id));

    if (existingItem) {
        existingItem.qty += qty;
    } else {
        state.cart.push({ ...item, qty: qty });
    }

    updateCart();
    saveToStorage();
    showToast(`${qty}x ${itemName(item)} added to cart! 🛒`);
    animateCartIcon();
}

function updateCartItemQty(id, change) {
    const item = state.cart.find(i => String(i.id) === String(id));
    if (!item) return;

    item.qty += change;

    if (item.qty <= 0) {
        removeFromCart(id);
    } else {
        updateCart();
        saveToStorage();
    }
}

function removeFromCart(id) {
    state.cart = state.cart.filter(i => String(i.id) !== String(id));
    updateCart();
    saveToStorage();
}

function updateCart() {
    const totalItems = state.cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const vatAmount = Math.round(subtotal * CONFIG.vatRate);
    const totalAmount = subtotal + vatAmount;

    updateCartBadges(totalItems);

    if (DOM.subtotal) DOM.subtotal.textContent = money(subtotal);
    if (DOM.vat) DOM.vat.textContent = money(vatAmount);
    if (DOM.total) DOM.total.textContent = money(totalAmount);

    const isEmpty = state.cart.length === 0;
    if (DOM.emptyCart) DOM.emptyCart.classList.toggle('hidden', !isEmpty);
    if (DOM.cartSummary) DOM.cartSummary.classList.toggle('hidden', isEmpty);

    renderCartItems();
}

function updateCartBadges(count) {
    const badges = [DOM.cartCount];

    badges.forEach(badge => {
        if (badge) {
            badge.textContent = count;
            badge.classList.toggle('hidden', count === 0);
        }
    });
}

function renderCartItems() {
    if (!DOM.cartItems) return;

    DOM.cartItems.innerHTML = state.cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${itemName(item)}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${itemName(item)}</div>
                <div class="cart-item-price">${money(item.price)} ${currentLanguage==='ar'?'للقطعة':'each'}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="qty-btn" onclick="updateCartItemQty('${item.id}', -1)" aria-label="Decrease quantity">−</button>
                <span class="qty-value">${item.qty}</span>
                <button class="qty-btn" onclick="updateCartItemQty('${item.id}', 1)" aria-label="Increase quantity">+</button>
            </div>
        </div>
    `).join('');
}

function animateCartIcon() {
    if (DOM.cartCount) {
        DOM.cartCount.classList.add('cart-bounce');
        setTimeout(() => DOM.cartCount.classList.remove('cart-bounce'), 400);
    }
}

function openCart() {
    state.isCartOpen = true;
    if (DOM.cartSidebar) DOM.cartSidebar.classList.add('open');
    if (DOM.cartOverlay) DOM.cartOverlay.classList.remove('hidden');
    setTimeout(() => {
        if (DOM.cartOverlay) DOM.cartOverlay.classList.add('visible');
    }, 10);
    document.body.classList.add('cart-open');
}

function closeCart() {
    state.isCartOpen = false;
    if (DOM.cartSidebar) DOM.cartSidebar.classList.remove('open');
    if (DOM.cartOverlay) DOM.cartOverlay.classList.remove('visible');
    setTimeout(() => {
        if (DOM.cartOverlay) DOM.cartOverlay.classList.add('hidden');
    }, 300);
    document.body.classList.remove('cart-open');
}

// ==========================================
// 9. ORDER FUNCTIONS
// ==========================================

async function placeOrder() {
    if (state.cart.length === 0) {
        showToast('Your cart is empty!', 'warning');
        return;
    }

    const sessionOpen = await isTableSessionOpen();
    if (!sessionOpen) {
        showToast('انتهت جلسة هذه الطاولة. يرجى إعادة مسح QR لفتح جلسة جديدة.', 'warning');
        return;
    }

    const orderNumber = generateOrderNumber();

    const order = {
        id: orderNumber,
        table: state.currentTable,
        items: [...state.cart],
        subtotal: state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0),
        vat: Math.round(state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0) * CONFIG.vatRate),
        total: 0,
        instructions: DOM.instructions?.value || '',
        status: 'received',
        timestamp: new Date().toISOString()
    };
    order.total = order.subtotal + order.vat;

    // Save to the cloud when Supabase is configured.
    // If no cloud is configured yet, use the built-in shared demo mode so the
    // cart and kitchen still work immediately (same browser/origin).
    if (isSupabaseConfigured()) {
        try {
            // Use the database RPC so the session is checked atomically.
            // This prevents a customer from placing an order after the kitchen closes the table.
            const { data: savedOrder, error } = await supabaseClient.rpc('place_order', {
                p_order_number: order.id,
                p_table_number: parseInt(order.table, 10),
                p_session_id: state.tableSessionId || null,
                p_items: order.items,
                p_subtotal: order.subtotal,
                p_vat: order.vat,
                p_total: order.total,
                p_instructions: order.instructions
            });

            if (error) throw error;
            const row = Array.isArray(savedOrder) ? savedOrder[0] : savedOrder;
            order.dbId = row?.id || null;
            if (row?.order_number) order.id = row.order_number;
        } catch (err) {
            console.error('Error saving order to Supabase:', err);
            showToast(err?.message?.includes('closed') || err?.message?.includes('session')
                ? 'الطاولة مغلقة. امسح QR من جديد لبدء جلسة جديدة.'
                : 'تعذر إرسال الطلب للمطبخ. حاول مرة ثانية.', 'warning');
            return;
        }
    } else {
        saveSharedDemoOrder(order);
    }

    state.orders.unshift(order);
    saveToStorage();

    state.cart = [];
    updateCart();
    if (DOM.instructions) DOM.instructions.value = '';

    updateOrderBadges();
    closeCart();
    showSuccessModal(orderNumber);

    // Listen for status changes made by the kitchen.
    subscribeToOrderUpdates(orderNumber);
}

function saveSharedDemoOrder(order) {
    const key = 'sky_shared_orders';
    try {
        const current = JSON.parse(localStorage.getItem(key) || '[]');
        current.unshift({
            id: order.id,
            order_number: order.id,
            table_number: Number(order.table),
            items: order.items,
            subtotal: order.subtotal,
            vat: order.vat,
            total: order.total,
            instructions: order.instructions || '',
            status: 'received',
            created_at: order.timestamp || new Date().toISOString()
        });
        localStorage.setItem(key, JSON.stringify(current.slice(0, 200)));
        if ('BroadcastChannel' in window) {
            const channel = new BroadcastChannel('sky-coffee-orders');
            channel.postMessage({ type: 'new-order' });
            channel.close();
        }
    } catch (e) {
        console.error('Could not save shared demo order:', e);
        throw e;
    }
}

function generateOrderNumber() {
    return Math.floor(10000 + Math.random() * 90000);
}

function simulateOrderProgress(orderNumber) {
    const { preparing, ready, served } = CONFIG.orderStatusDelay;

    setTimeout(() => {
        updateOrderStatus(orderNumber, 'preparing');
        showToast('👨‍🍳 Your order is being prepared!');
    }, preparing);

    setTimeout(() => {
        updateOrderStatus(orderNumber, 'ready');
        showToast('🍽️ Your order is ready!');
    }, ready);

    setTimeout(() => {
        updateOrderStatus(orderNumber, 'served');
        showToast('✅ Order served. Enjoy your meal!');
        updateOrderBadges();
        // Auto-trigger rating modal for served order
        setTimeout(() => showRatingModal(orderNumber), 5000);
    }, served);
}

function updateOrderStatus(orderNumber, newStatus) {

    // Use loose equality and string conversion to be safe with IDs
    const order = state.orders.find(o => String(o.id) === String(orderNumber));

    if (!order) {
        console.warn(`Order #${orderNumber} not found in local state.`);
        return;
    }

    const statusIndex = { 'received': 0, 'preparing': 1, 'ready': 2, 'served': 3 };
    const normalizedStatus = String(newStatus || '').toLowerCase();
    const newStatusIndex = statusIndex[normalizedStatus] ?? 0;

    // Trigger animation BEFORE changing status (if modal is open)
    if (DOM.trackOrderModal && !DOM.trackOrderModal.classList.contains('hidden')) {
        // We update the status first so renderTrackOrders sees the new state
        order.status = newStatus;
        renderTrackOrders();
    }

    order.status = newStatus;
    saveToStorage();
    updateOrderBadges();

    // If modal is open, we need to refresh the list
    if (DOM.trackOrderModal && !DOM.trackOrderModal.classList.contains('hidden')) {
        renderTrackOrders();
    }

    if (DOM.ordersModal && !DOM.ordersModal.classList.contains('hidden')) {
        renderOrders();
    }
}

function updateOrderBadges() {
    const activeOrdersCount = state.orders.filter(o => o.status !== 'served').length;

    const badges = [DOM.activeOrdersBadge, DOM.mobileOrdersBadge];
    badges.forEach(badge => {
        if (badge) {
            badge.textContent = activeOrdersCount;
            badge.classList.toggle('hidden', activeOrdersCount === 0);
        }
    });

    if (DOM.floatingTrackOrder) {
        // Hide tracking button if all orders are served
        DOM.floatingTrackOrder.classList.toggle('hidden', activeOrdersCount === 0);
    }
    if (DOM.floatingOrderCount) {
        DOM.floatingOrderCount.textContent = activeOrdersCount;
        DOM.floatingOrderCount.classList.toggle('hidden', activeOrdersCount === 0);
    }
}

function renderOrders() {
    if (!DOM.ordersList) return;

    if (state.orders.length === 0) {
        DOM.ordersList.innerHTML = '';
        if (DOM.noOrders) DOM.noOrders.classList.remove('hidden');
        return;
    }

    if (DOM.noOrders) DOM.noOrders.classList.add('hidden');

    DOM.ordersList.innerHTML = state.orders.map(order => {
        const statusConfig = {
            'received': { label: '<i data-lucide="file-text"></i> Received', class: 'active' },
            'preparing': { label: '<i data-lucide="chef-hat"></i> Preparing', class: 'active' },
            'ready': { label: '<i data-lucide="utensils"></i> Ready', class: 'active' },
            'served': { label: '<i data-lucide="check-circle"></i> Served', class: 'completed' }
        };

        const status = statusConfig[order.status];
        const orderRatings = state.ratings[order.id];
        const isRated = orderRatings && Object.keys(orderRatings).length > 0;
        const isServed = order.status === 'served';

        return `
            <div class="order-item">
                <div class="order-header">
                    <div>
                        <div class="order-id">Order #${order.id}</div>
                        <div class="order-time">${formatDate(order.timestamp)}</div>
                    </div>
                    <span class="order-status ${status.class}">${status.label}</span>
                </div>
                <div class="order-items-list">
                    ${order.items.map(item => {
            const itemRating = orderRatings && orderRatings[item.id];
            const starsHTML = itemRating ? `<span class="order-item-rating">${'<i data-lucide="star"></i>'.repeat(itemRating.stars)}</span>` : '';
            return `
                        <div class="order-item-row">
                            <span class="order-item-name">
                                <img src="${item.image}" alt="${itemName(item)}" class="order-item-thumb">
                                ${itemName(item)} 
                                <span class="item-qty">×${item.qty}</span>
                                ${starsHTML}
                            </span>
                            <span>${money(item.price * item.qty)}</span>
                        </div>
                    `}).join('')}
                </div>
                <div class="order-total">
                    <span>Total (incl. VAT)</span>
                    <span class="total-value gradient-text">${money(order.total)}</span>
                </div>
                ${isServed && !isRated ? `<button class="rate-order-btn" onclick="showRatingModal('${order.id}')"><i data-lucide="star"></i> Rate Items</button>` : ''}
                ${isRated ? '<span class="rated-badge"><i data-lucide="check-circle"></i> Rated</span>' : ''}
            </div>
        `;
    }).join('');

    if (window.lucide) lucide.createIcons();
}

function renderTrackOrders() {
    if (!DOM.trackOrderList) return;

    const activeOrders = state.orders;
    const statusMapping = { 'received': 0, 'preparing': 1, 'ready': 2, 'served': 3 };

    if (activeOrders.length === 0) {
        DOM.trackOrderList.innerHTML = '';
        return;
    }

    // 1. CAPTURE current visual states BEFORE any DOM changes
    const previousStates = {};
    document.querySelectorAll('.track-order-card').forEach(card => {
        const id = card.getAttribute('data-order-id');
        const progress = card.querySelector('.status-progress-fill');
        if (id && progress) {
            previousStates[id] = parseInt(progress.getAttribute('data-current-step'));
        }
    });

    // 2. BUILD the HTML blocks, incorporating previous states to prevent reset flicker
    const listEl = DOM.trackOrderList;
    const currentCards = Array.from(listEl.children);

    const orderHTMLBlocks = activeOrders.map((order) => {
        const normalized = String(order.status || '').toLowerCase();
        const targetStep = statusMapping[normalized] ?? 0;
        const isServed = normalized === 'served';

        // Use previous step as starting point if it exists
        const startStep = previousStates[order.id] !== undefined ? previousStates[order.id] : -1;
        const initialWidth = startStep >= 0 ? (startStep / 3) * 100 : 0;

        // Helper for initial step visuals
        const getStepStyle = (idx) => {
            if (startStep === -1) return '';
            if (idx < startStep || (idx === startStep && idx === 3))
                return 'background: #10b981;'; // Removed glow for Served
            if (idx === startStep)
                return 'background: var(--gradient-primary); box-shadow: 0 0 20px rgba(255, 140, 0, 0.6);';
            return '';
        };


        const getLabelClass = (idx) => {
            if (idx < startStep || (idx === startStep && idx === 3)) return 'completed';
            if (idx === startStep) return 'active';
            return '';
        };

        return {
            id: order.id,
            status: order.status,
            html: `
            <div class="track-order-card ${isServed ? 'order-served' : ''}" 
                 data-order-id="${order.id}" 
                 data-last-status="${order.status}">
                <div class="track-order-header">
                    <div>
                        <div class="track-order-id">Order #${order.id}</div>
                        <div class="track-order-time">${formatTime(order.timestamp)}</div>
                    </div>
                    ${isServed ? `
                        <span class="track-status-badge completed"><i data-lucide="check-circle"></i> Served</span>
                    ` : `
                        <span class="track-status-badge">
                            <span class="live-dot"></span>
                            In Progress
                        </span>
                    `}
                </div>

                <!-- Status Tracker (Shows if active, or if just transitioning to Served) -->
                ${(() => {
                    const showTracker = !isServed || (isServed && startStep >= 0 && startStep < 3);
                    return `
                    <div class="status-tracker ${showTracker ? '' : 'hidden'}">
                        <div class="status-steps">
                            <div class="status-progress-line">
                                <div class="track-progress-${order.id} status-progress-fill" 
                                     style="width: ${initialWidth}%" 
                                     data-current-step="${startStep}"></div>
                            </div>
                            
                            ${['Received', 'Preparing', 'Ready', 'Served'].map((label, idx) => `
                                <div class="track-step-${order.id}-${idx} status-step">
                                    <div class="step-icon" style="${getStepStyle(idx)}">
                                        <i data-lucide="${['file-text', 'chef-hat', 'utensils', 'check-circle'][idx]}"></i>
                                    </div>
                                    <span class="step-label ${getLabelClass(idx)}">${label}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    `;
                })()}

                ${isServed ? `
                    <div class="served-confirmation">
                        <p>This order was served. Enjoy your meal! <i data-lucide="heart" class="icon-heart inline-icon"></i></p>
                    </div>
                ` : ''}

                <div class="track-order-items">
                    ${order.items.map(item => `
                        <div class="order-item-row">
                            <span class="order-item-name">
                                <img src="${item.image}" alt="${itemName(item)}" class="order-item-thumb">
                                ${itemName(item)} 
                                <span class="item-qty">×${item.qty}</span>
                            </span>
                            <span>${money(item.price * item.qty)}</span>
                        </div>
                    `).join('')}
                </div>

                <div class="track-order-footer">
                    <div class="track-total">
                        <span class="track-total-label">Total</span>
                        <span class="track-total-value gradient-text">${money(order.total)}</span>
                    </div>
                    ${!isServed ? `
                        <div class="track-eta">
                            <span class="track-eta-label">Estimated</span>
                            <span class="track-eta-value">${CONFIG.estimatedTime}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
            `
        };
    });

    // 3. GRANULAR DOM UPDATE
    if (currentCards.length === orderHTMLBlocks.length && currentCards.length > 0) {
        orderHTMLBlocks.forEach((data, idx) => {
            const card = currentCards[idx];
            if (card.getAttribute('data-order-id') !== String(data.id) ||
                card.getAttribute('data-last-status') !== data.status) {
                card.outerHTML = data.html;
            }
        });
    } else {
        listEl.innerHTML = orderHTMLBlocks.map(d => d.html).join('');
    }

    if (window.lucide) lucide.createIcons();

    // 4. TRIGGER targeted animations
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            activeOrders.forEach((order) => {
                const normalized = String(order.status || '').toLowerCase();
                const targetStep = statusMapping[normalized] ?? 0;
                const progressBar = document.querySelector(`.track-progress-${order.id}`);

                if (!progressBar) return;

                const currentStep = parseInt(progressBar.getAttribute('data-current-step'));
                let animationMode = false;

                if (!DOM.trackOrderModal.classList.contains('visible')) {
                    animationMode = 'full';
                } else if (currentStep < targetStep) {
                    animationMode = 'delta';
                }

                animateTrackOrderStatus(order.id, targetStep, animationMode);
            });
        });
    });
}

// Animate the track order status - animates UP TO the actual order status
function animateTrackOrderStatus(orderId, targetStep, mode = 'full') {
    const progressBar = document.querySelector(`.track-progress-${orderId}`);
    if (!progressBar) return;

    // Helper function to set step visual state immediately
    const setStepState = (step, state) => {
        const stepEl = document.querySelector(`.track-step-${orderId}-${step}`);
        if (!stepEl) return;
        const icon = stepEl.querySelector('.step-icon');
        const text = stepEl.querySelector('.step-label');

        if (state === 'completed') {
            if (icon) {
                icon.style.background = '#10b981';
                // Remove glow for Served step (step 3)
                icon.style.boxShadow = step === 3 ? 'none' : '0 0 15px rgba(16, 185, 129, 0.5)';
                icon.classList.remove('active');
                icon.classList.add('completed');
            }
            if (text) {
                text.style.color = '#10b981';
                text.classList.remove('active');
                text.classList.add('completed');
            }
        } else if (state === 'active') {
            if (icon) {
                icon.style.background = 'linear-gradient(135deg, #FF8C00 0%, #DC143C 100%)';
                icon.style.boxShadow = '0 0 20px rgba(255, 140, 0, 0.6)';
                icon.classList.add('active');
                icon.classList.remove('completed');
            }
            if (text) {
                text.style.color = '#FF8C00';
                text.classList.add('active');
                text.classList.remove('completed');
            }
        } else {
            if (icon) {
                icon.style.background = 'rgba(255, 255, 255, 0.1)';
                icon.style.boxShadow = 'none';
                icon.classList.remove('active', 'completed');
            }
            if (text) {
                text.style.color = '';
                text.classList.remove('active', 'completed');
            }
        }
    };

    const currentStep = parseInt(progressBar.getAttribute('data-current-step'));

    if (!mode) {
        // Immediate sync: No animation
        for (let i = 0; i <= 3; i++) {
            if (i < targetStep) {
                setStepState(i, 'completed');
            } else if (i === targetStep) {
                // If it's the final step (Served), show as completed
                setStepState(i, i === 3 ? 'completed' : 'active');
            } else {
                setStepState(i, 'disabled');
            }
        }
        progressBar.style.width = `${(targetStep / 3) * 100}%`;
        progressBar.setAttribute('data-current-step', targetStep);
        return;
    }

    if (mode === 'full') {
        // Full Intro: Reset and animate from 0
        for (let i = 0; i <= 3; i++) setStepState(i, 'disabled');
        progressBar.style.width = '0%';
        progressBar.setAttribute('data-current-step', -1);

        animateSteps(0, targetStep);
    } else if (mode === 'delta') {
        // Delta Update: Animate from current to target
        // We DO NOT reset the progress bar here. We start from where we left off.
        const startFrom = Math.max(0, currentStep + 1);
        if (startFrom <= targetStep) {
            animateSteps(startFrom, targetStep);
        }
    }

    function animateSteps(start, end) {
        const stepDelay = 600;
        let animatedCount = 0;

        for (let step = start; step <= end; step++) {
            (function (s, index) {
                const delay = index * stepDelay;
                setTimeout(() => {
                    // Turn PREVIOUS step green (completed)
                    if (s > 0) {
                        setStepState(s - 1, 'completed');
                    }

                    // For the VERY LAST STEP (3 - Served), we want it to look completed (green)
                    // instead of remaining orange (active) forever
                    if (s === 3) {
                        setStepState(s, 'completed');
                        // Use a longer delay to hide the tracker after the completion is seen
                        setTimeout(() => {
                            const tracker = progressBar.closest('.status-tracker');
                            if (tracker) {
                                tracker.style.opacity = '0';
                                tracker.style.transition = 'opacity 0.6s ease';
                                setTimeout(() => tracker.classList.add('hidden'), 600);
                            }
                        }, 2000);
                    } else {
                        // Make CURRENT step orange (active)
                        setStepState(s, 'active');
                    }

                    // Update progress bar
                    const progressWidth = (s / 3) * 100;
                    progressBar.style.width = `${progressWidth}%`;
                    progressBar.setAttribute('data-current-step', s);
                }, delay);
            })(step, animatedCount);
            animatedCount++;
        }
    }
}

// ==========================================
// 10. MODAL FUNCTIONS
// ==========================================

function showModal(modal) {
    if (!modal) return;
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.add('visible'), 10);
}

function hideModal(modal) {
    if (!modal) return;
    modal.classList.remove('visible');
    setTimeout(() => modal.classList.add('hidden'), 300);
}

function showSuccessModal(orderNumber) {
    if (DOM.orderNumber) DOM.orderNumber.textContent = orderNumber;
    if (DOM.successTableNumber) DOM.successTableNumber.textContent = state.currentTable;
    showModal(DOM.successModal);
}

function showOrdersModal() {
    renderOrders();
    showModal(DOM.ordersModal);
}

function showTrackOrderModal() {
    renderTrackOrders();
    showModal(DOM.trackOrderModal);
}

function openItemModal(id) {
    const item = menuItems.find(i => i.id == id) || specialItems.find(i => i.id == id);
    if (!item) return;

    state.selectedItem = item;
    state.selectedItemQty = 1;

    if (DOM.itemModalIcon) {
        DOM.itemModalIcon.innerHTML = `<img src="${item.image}" alt="${itemName(item)}">`;
    }
    if (DOM.itemModalTitle) DOM.itemModalTitle.textContent = item.name;
    if (DOM.itemModalDesc) DOM.itemModalDesc.textContent = item.desc;


    if (DOM.itemModalPrice) DOM.itemModalPrice.textContent = money(item.price);
    if (DOM.itemQtyValue) DOM.itemQtyValue.textContent = '1';
    if (DOM.itemTotalPrice) DOM.itemTotalPrice.textContent = money(item.price);

    // Display average rating and reviews
    const ratingData = state.itemRatingsData[item.id];
    if (DOM.itemModalAvgRating) DOM.itemModalAvgRating.textContent = ratingData ? ratingData.avg.toFixed(1) : '0.0';
    if (DOM.itemModalRatingCount) DOM.itemModalRatingCount.textContent = ratingData ? `(${ratingData.count} reviews)` : '(0 reviews)';

    // Render reviews
    if (DOM.itemReviewsList && DOM.noReviews) {
        if (ratingData && ratingData.reviews.length > 0) {
            DOM.noReviews.classList.add('hidden');
            DOM.itemReviewsList.innerHTML = ratingData.reviews.slice(0, 10).map(review => `
                <div class="review-card">
                    <div class="review-header">
                        <span class="review-stars">
                            ${'<i data-lucide="star" class="icon-star-filled"></i>'.repeat(review.stars)}
                            ${'<i data-lucide="star"></i>'.repeat(5 - review.stars)}
                        </span>
                        ${review.date ? `<span class="review-date">${formatReviewDate(review.date)}</span>` : ''}
                    </div>
                    ${review.feedback ? `<p class="review-text">${escapeHTML(review.feedback)}</p>` : ''}
                </div>
            `).join('');
        } else {
            DOM.noReviews.classList.remove('hidden');
            DOM.itemReviewsList.innerHTML = '';
        }
    }

    // Attach control listeners dynamically every time modal opens to ensure they aren't stale
    const minusBtn = document.getElementById('itemQtyMinus');
    const plusBtn = document.getElementById('itemQtyPlus');
    const addBtn = document.getElementById('addItemToCart');
    const closeBtn = document.getElementById('closeItemModal');

    if (minusBtn) minusBtn.onclick = () => updateItemModalQty(-1);
    if (plusBtn) plusBtn.onclick = () => updateItemModalQty(1);
    if (addBtn) addBtn.onclick = addSelectedItemToCart;
    if (closeBtn) closeBtn.onclick = () => hideModal(DOM.itemModal);

    showModal(DOM.itemModal);
    if (window.lucide) lucide.createIcons();
}

function updateSpecialsRatings() {
    document.querySelectorAll('.special-rating').forEach(el => {
        const id = el.dataset.id;
        const ratingData = state.itemRatingsData[id];
        if (ratingData) {
            const avgEl = el.querySelector('.card-rating-value');
            const countEl = el.querySelector('.card-rating-count');
            if (avgEl) avgEl.textContent = ratingData.avg.toFixed(1);
            if (countEl) countEl.textContent = `(${ratingData.count})`;
        }
    });
}

function updateItemModalQty(change) {
    state.selectedItemQty = Math.max(1, state.selectedItemQty + change);
    if (DOM.itemQtyValue) DOM.itemQtyValue.textContent = state.selectedItemQty;
    if (DOM.itemTotalPrice && state.selectedItem) {
        DOM.itemTotalPrice.textContent = money(state.selectedItem.price * state.selectedItemQty);
    }
}

function addSelectedItemToCart() {
    if (!state.selectedItem) return;
    addToCartWithQty(state.selectedItem.id, state.selectedItemQty);
    hideModal(DOM.itemModal);
    state.selectedItem = null;
    state.selectedItemQty = 1;
}

// ==========================================
// 11. WAITER FUNCTIONS
// ==========================================



async function callWaiter() {
    if (!state.currentTable) {
        showToast('Please select a table first!', 'error');
        return;
    }

    if (!isSupabaseConfigured()) {
        try {
            const key = 'sky_shared_waiter_calls';
            const calls = JSON.parse(localStorage.getItem(key) || '[]');
            calls.unshift({
                id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                table_number: Number(state.currentTable),
                status: 'pending',
                created_at: new Date().toISOString()
            });
            localStorage.setItem(key, JSON.stringify(calls.slice(0, 100)));
            if ('BroadcastChannel' in window) {
                const channel = new BroadcastChannel('sky-coffee-orders');
                channel.postMessage({ type: 'waiter-call' });
                channel.close();
            }
            showToast('تم طلب النادل بنجاح.', 'success');
        } catch (err) {
            console.error('Local waiter call failed:', err);
            showToast('تعذر طلب النادل.', 'error');
        }
        return;
    }

    try {
        const { error } = await supabaseClient
            .from('waiter_calls')
            .insert([{
                table_number: state.currentTable,
                status: 'pending'
            }]);

        if (error) throw error;

        showToast('Waiter has been notified.', 'success');
    } catch (err) {
        console.error('Error calling waiter:', err.message);
        showToast('Failed to notify waiter. Please try again.', 'error');
    }
}
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleScroll() {
    const scrollY = window.scrollY;

    if (DOM.navbar) {
        DOM.navbar.classList.toggle('scrolled', scrollY > 50);
    }

    if (DOM.backToTop) {
        DOM.backToTop.classList.toggle('visible', scrollY > 500);
    }
}

// ==========================================
// 13. TOAST NOTIFICATIONS
// ==========================================

function showToast(message, type = 'success') {
    if (!DOM.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.setAttribute('role', 'alert');

    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-out');
        setTimeout(() => toast.remove(), 300);
    }, CONFIG.toastDuration);
}

// ==========================================
// 14. SCROLL & ANIMATION
// ==========================================

const scrollObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);

function initScrollObserver() {
    observeScrollElements();
}

function observeScrollElements() {
    document.querySelectorAll('.scroll-reveal:not(.revealed)').forEach(el => {
        scrollObserver.observe(el);
    });
}

function handleMouseMove(e) {
    const orbs = document.querySelectorAll('.orb');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 15;
        orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
}

// ==========================================
// 15. EVENT LISTENERS
// ==========================================

function setupEventListeners() {
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) languageToggle.addEventListener('click', toggleLanguage);

    // 1. UNIVERSAL CLICK DELEGATION
    document.addEventListener('click', (e) => {
        const target = e.target;

        // Table selection on welcome screen (Manual Selection)
        const tableBtn = target.closest('.table-btn-compact, .table-card-premium');
        if (tableBtn) {
            const table = tableBtn.dataset.table;

            // Visual feedback
            document.querySelectorAll('.table-btn-compact, .table-card-premium').forEach(c => {
                c.setAttribute('aria-checked', 'false');
                c.classList.remove('selected');
            });
            tableBtn.setAttribute('aria-checked', 'true');
            tableBtn.classList.add('selected');

            setTimeout(() => setTable(table), 100);
            return;
        }

        // Toggle Manual Selection Button
        if (target.closest('#toggleManualBtn')) {
            toggleManualSelection();
            return;
        }

        // Add to Cart from Menu Card (Regular Items)
        const menuAddBtn = target.closest('.btn-menu-item');
        if (menuAddBtn) {
            e.stopPropagation();
            addToCart(menuAddBtn.dataset.id);
            return;
        }

        // Add to Cart from Special Slide
        const specialAddBtn = target.closest('.btn-special');
        if (specialAddBtn) {
            e.stopPropagation();
            e.preventDefault();
            addToCart(specialAddBtn.dataset.id);
            return;
        }

        // Open Modal from Menu Card
        const foodCard = target.closest('.food-card');
        if (foodCard && !target.closest('.btn-add')) {
            openItemModal(foodCard.dataset.id);
            return;
        }

        // Open Modal from Special Slide Detail (Title, Desc, Rating)
        if (target.closest('.slide-title, .slide-description, .special-rating')) {
            const slide = target.closest('.slide-content');
            if (slide) {
                const btn = slide.querySelector('.btn-special');
                if (btn) openItemModal(btn.dataset.id);
            }
            return;
        }

        // Item Modal: Quantity Controls
        if (target.closest('#itemQtyMinus')) {
            updateItemModalQty(-1);
            return;
        }
        if (target.closest('#itemQtyPlus')) {
            updateItemModalQty(1);
            return;
        }

        // Item Modal: Add to Cart
        if (target.closest('#addItemToCart')) {
            addSelectedItemToCart();
            return;
        }

        // Item Modal: Close
        if (target.closest('#closeItemModal')) {
            hideModal(DOM.itemModal);
            return;
        }

        // Cart Actions
        if (target.closest('#cartBtn')) {
            openCart();
            return;
        }
        if (target.closest('#closeCart') || target.closest('#cartOverlay')) {
            closeCart();
            return;
        }
        if (target.closest('#placeOrder')) {
            placeOrder();
            return;
        }

        // Navigation / Modals
        if (target.closest('#viewOrdersBtn') || target.closest('#bottomNavOrdersBtn')) {
            showOrdersModal();
            return;
        }
        if (target.closest('#closeOrdersModal')) {
            hideModal(DOM.ordersModal);
            return;
        }
        if (target.closest('#floatingTrackBtn')) {
            showTrackOrderModal();
            return;
        }
        if (target.closest('#closeTrackOrderModal')) {
            hideModal(DOM.trackOrderModal);
            return;
        }
        if (target.closest('#closeSuccessModal')) {
            hideModal(DOM.successModal);
            return;
        }

        // Waiter Calling
        if (target.closest('#callWaiterBtn')) {
            callWaiter();
            return;
        }

        // Rating Modal
        if (target.closest('#closeRatingModal') || target.closest('#skipRating')) {
            hideModal(DOM.ratingModal);
            return;
        }
        if (target.closest('#submitRating')) {
            handleSubmitRatings();
            return;
        }

        // Back to top
        if (target.closest('#backToTop')) {
            scrollToTop();
            return;
        }
    });

    // 2. INPUT LISTENERS (Non-click events)
    if (DOM.menuSearch) {
        DOM.menuSearch.addEventListener('input', (e) => handleSearch(e.target.value));
        DOM.menuSearch.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') clearSearch();
        });
    }

    if (DOM.categoryTabs) {
        DOM.categoryTabs.forEach(tab => {
            tab.addEventListener('click', () => setCategory(tab.dataset.category));
        });
    }

    if (DOM.clearSearch) {
        DOM.clearSearch.addEventListener('click', clearSearch);
    }

    // Scroll events
    window.addEventListener('scroll', debounce(handleScroll, 10));

    // Mouse move for parallax
    document.addEventListener('mousemove', throttle(handleMouseMove, 50));



    // Window resize
    window.addEventListener('resize', debounce(handleResize, 100));

    // Modal backdrop clicks
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) hideModal(modal);
        });
    });

    // Prevent body scroll when modal is open
    document.addEventListener('touchmove', (e) => {
        if (document.body.classList.contains('modal-open') || document.body.classList.contains('cart-open')) {
            const target = e.target;
            if (!target.closest('.modal-body') && !target.closest('.cart-content')) {
                e.preventDefault();
            }
        }
    }, { passive: false });
}

function handleResize() {
}

// ==========================================
// 16. UTILITY FUNCTIONS
// ==========================================

function saveToStorage() {
    if (!state.currentTable) return;

    const data = {
        cart: state.cart,
        orders: state.orders,
        ratings: state.ratings
    };

    try {
        localStorage.setItem(`rannaghor_table_${state.currentTable}`, JSON.stringify(data));
    } catch (e) {
        // Issue #2: Improved error handling with user-friendly toast
        showToast('Unable to save data. Please check your browser settings.', 'warning');
    }
}

function loadFromStorage() {
    if (!state.currentTable) return;

    try {
        const data = localStorage.getItem(`rannaghor_table_${state.currentTable}`);
        if (data) {
            const parsed = JSON.parse(data);
            state.cart = parsed.cart || [];
            state.orders = parsed.orders || [];
            state.ratings = parsed.ratings || {};
            updateCart();
        }
    } catch (e) {
        // Issue #2: Improved error handling - silently handle corrupted data
        state.cart = [];
        state.orders = [];
        state.ratings = {};
    }
}

function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

function formatTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ==========================================
// EXPOSE FUNCTIONS TO GLOBAL SCOPE
// ==========================================

/**
 * Realtime subscription for customer's specific order
 */
// Local demo-mode sync: lets customer/kitchen tabs on the same browser update instantly.
window.addEventListener('storage', (event) => {
    if (event.key !== 'sky_shared_orders' || !event.newValue) return;
    try {
        const shared = JSON.parse(event.newValue);
        shared.forEach(o => {
            const local = state.orders.find(x => String(x.id) === String(o.order_number || o.id));
            if (local && local.status !== o.status) updateOrderStatus(local.id, o.status);
        });
    } catch (_) {}
});

function subscribeToOrderUpdates(orderNumber) {
    if (typeof supabaseClient === 'undefined') return;


    // Ensure we don't have multiple subscriptions for the same order
    const channelName = `cust-order-${orderNumber}`;

    const channel = supabaseClient
        .channel(channelName)
        .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'orders',
            filter: `order_number=eq.${orderNumber}`
        }, (payload) => {
            updateOrderStatus(orderNumber, payload.new.status);

            // Show toast for transparency
            const statusEmojis = { 'preparing': '👨‍🍳', 'ready': '🍽️', 'served': '✅' };
            const emoji = statusEmojis[payload.new.status] || '🔔';
            showToast(`${emoji} Order #${orderNumber} status: ${payload.new.status}`);

            // Auto-trigger rating when order is served
            if (payload.new.status === 'served') {
                setTimeout(() => showRatingModal(orderNumber), 5000);
            }
        })
        .subscribe((status) => {
        });

    return channel;
}

window.updateCartItemQty = updateCartItemQty;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.openItemModal = openItemModal;
window.showRatingModal = showRatingModal;

// ==========================================
// RATING SYSTEM
// ==========================================

function showRatingModal(orderNumber) {
    const order = state.orders.find(o => String(o.id) === String(orderNumber));
    if (!order) return;

    // Don't show if already rated
    if (state.ratings[orderNumber] && Object.keys(state.ratings[orderNumber]).length > 0) {
        showToast('You already rated this order!', 'info');
        return;
    }

    state.ratingOrderId = orderNumber;

    // Reset views
    if (DOM.ratingView) DOM.ratingView.classList.remove('hidden');
    if (DOM.ratingThankYou) DOM.ratingThankYou.classList.add('hidden');
    if (DOM.ratingOrderNumber) DOM.ratingOrderNumber.textContent = orderNumber;

    // Build per-item rating rows
    if (DOM.ratingItemsList) {
        DOM.ratingItemsList.innerHTML = order.items.map(item => `
            <div class="rating-item-row" data-item-id="${item.id}">
                <img src="${item.image}" alt="${itemName(item)}" class="rating-item-thumb"
                     onerror="this.src='https://placehold.co/112x112/1a1a1a/ffffff?text=${encodeURIComponent(item.name)}'">
                <div class="rating-item-info">
                    <div class="rating-item-name">${itemName(item)}</div>
                    <div class="rating-item-qty">Qty: ${item.qty}</div>
                    <div class="star-selector" data-item-id="${item.id}">
                        ${[1, 2, 3, 4, 5].map(s => `<button class="star-btn" data-star="${s}" aria-label="${s} star"><i data-lucide="star"></i></button>`).join('')}
                    </div>
                    <input type="text" class="rating-feedback-input" data-item-id="${item.id}"
                           placeholder="Any feedback? (optional)" maxlength="120">
                </div>
            </div>
        `).join('');
        if (window.lucide) lucide.createIcons();

        // Attach star interaction listeners
        DOM.ratingItemsList.querySelectorAll('.star-selector').forEach(selector => {
            const stars = selector.querySelectorAll('.star-btn');

            stars.forEach((star, idx) => {
                star.addEventListener('mouseenter', () => {
                    stars.forEach((s, i) => {
                        s.classList.toggle('hovered', i <= idx);
                    });
                });

                star.addEventListener('mouseleave', () => {
                    stars.forEach(s => s.classList.remove('hovered'));
                });

                star.addEventListener('click', () => {
                    const rating = parseInt(star.dataset.star);
                    stars.forEach((s, i) => {
                        s.classList.toggle('active', i < rating);
                    });
                    // Mark the row as rated visually
                    selector.closest('.rating-item-row').classList.add('rated');
                });
            });
        });
    }

    showModal(DOM.ratingModal);
}

function handleSubmitRatings() {
    const orderNumber = state.ratingOrderId;
    if (!orderNumber) return;

    const order = state.orders.find(o => String(o.id) === String(orderNumber));
    if (!order) return;

    const itemRatings = {};
    let hasAnyRating = false;

    order.items.forEach(item => {
        const selector = DOM.ratingItemsList.querySelector(`.star-selector[data-item-id="${item.id}"]`);
        const feedbackInput = DOM.ratingItemsList.querySelector(`.rating-feedback-input[data-item-id="${item.id}"]`);

        if (selector) {
            const activeStars = selector.querySelectorAll('.star-btn.active').length;
            if (activeStars > 0) {
                hasAnyRating = true;
                itemRatings[item.id] = {
                    stars: activeStars,
                    feedback: feedbackInput ? feedbackInput.value.trim() : '',
                    itemName: item.name
                };
            }
        }
    });

    if (!hasAnyRating) {
        showToast('Please rate at least one item!', 'warning');
        return;
    }

    // Save ratings
    state.ratings[orderNumber] = itemRatings;
    saveToStorage();

    // Update local itemRatingsData cache so menu shows new avg
    Object.entries(itemRatings).forEach(([itemId, rating]) => {
        if (!state.itemRatingsData[itemId]) {
            state.itemRatingsData[itemId] = { avg: 0, count: 0, reviews: [] };
        }
        const data = state.itemRatingsData[itemId];
        const newCount = data.count + 1;
        const newAvg = ((data.avg * data.count) + rating.stars) / newCount;
        data.avg = newAvg;
        data.count = newCount;
        data.reviews.unshift({
            stars: rating.stars,
            feedback: rating.feedback,
            date: new Date().toISOString()
        });
    });

    // Re-render menu to update avg ratings on cards
    renderMenu(state.selectedCategory, state.searchQuery);

    // Update special items ratings in DOM
    document.querySelectorAll('.special-rating').forEach(el => {
        const id = el.dataset.id;
        const ratingData = state.itemRatingsData[id];
        if (ratingData) {
            const avgEl = el.querySelector('.card-rating-value');
            const countEl = el.querySelector('.card-rating-count');
            if (avgEl) avgEl.textContent = ratingData.avg.toFixed(1);
            if (countEl) countEl.textContent = `(${ratingData.count})`;
        }
    });

    // Save to Supabase if configured
    if (typeof SUPABASE_URL !== 'undefined' && isSupabaseConfigured()) {
        saveRatingsToSupabase(orderNumber, itemRatings);
    }

    // Hide the rating modal immediately
    hideModal(DOM.ratingModal);

    showToast('Thank you for your feedback! ⭐');

    // Refresh order history if open
    if (DOM.ordersModal && !DOM.ordersModal.classList.contains('hidden')) {
        renderOrders();
    }

    state.ratingOrderId = null;
}

async function saveRatingsToSupabase(orderNumber, itemRatings) {
    try {
        const ratingRows = Object.entries(itemRatings).map(([itemId, rating]) => ({
            order_number: String(orderNumber),
            table_number: parseInt(state.currentTable),
            item_id: String(itemId),
            item_name: rating.itemName,
            stars: rating.stars,
            feedback: rating.feedback || '',
            created_at: new Date().toISOString()
        }));

        const { error } = await supabaseClient
            .from('ratings')
            .insert(ratingRows);

        if (error) throw error;
    } catch (err) {
        console.error('Error saving ratings to Supabase:', err.message);
    }
}

/**
 * Fetch aggregated item ratings from Supabase
 */
async function fetchItemRatings() {
    if (typeof SUPABASE_URL === 'undefined' || !isSupabaseConfigured()) {
        console.warn('Supabase not configured. No ratings to fetch.');
        return;
    }

    try {
        const { data, error } = await supabaseClient
            .from('ratings')
            .select('item_id, stars, feedback, created_at')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase Ratings Error:', error);
            return;
        }


        if (data && data.length > 0) {
            // Aggregate ratings per item
            const aggregated = {};
            data.forEach(row => {
                const id = String(row.item_id); // Force to string
                if (!aggregated[id]) {
                    aggregated[id] = { total: 0, count: 0, reviews: [] };
                }
                aggregated[id].total += row.stars;
                aggregated[id].count++;
                aggregated[id].reviews.push({
                    stars: row.stars,
                    feedback: row.feedback || '',
                    date: row.created_at
                });
            });

            // Calculate averages and update state
            Object.keys(aggregated).forEach(id => {
                const d = aggregated[id];
                state.itemRatingsData[id] = {
                    avg: d.total / d.count,
                    count: d.count,
                    reviews: d.reviews
                };
            });


            // Re-render menu with updated ratings
            renderMenu(state.selectedCategory, state.searchQuery);

            // Update special items ratings in DOM
            updateSpecialsRatings();
        }
    } catch (err) {
        console.error('Error fetching item ratings:', err.message);
    }
}

/**
 * Format a review date for display
 */
function formatReviewDate(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Escape HTML to prevent XSS in review text
 */
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

