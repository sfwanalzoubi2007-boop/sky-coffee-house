# SKY Coffee House – QR Ordering System

تم تحويل الواجهة لتناسب SKY Coffee House باللونين الأبيض والأسود، مع قائمة عربية وزر للتبديل إلى الإنجليزية.

## ملاحظة مهمة قبل الإطلاق
النسخة ما زالت تستخدم إعداد Supabase الموجود في المشروع الأصلي حتى تبقى الطلبات وKitchen Dashboard تعمل. قبل استخدام النظام تجارياً لكافيه مستقل، أنشئ مشروع Supabase خاص بـ SKY Coffee House أو اعزل بيانات الطلبات في قاعدة البيانات حتى لا تختلط طلبات المشاريع.

## تشغيل
ارفع الملفات كما هي إلى GitHub Pages، ثم افتح `management/` لإدارة الطاولات وإنشاء QR لكل طاولة.

## 🔐 Security
The Management and Kitchen pages now require Supabase Auth. Use your own Supabase project and keep the GitHub repository private. See `SECURITY-SETUP.md` for the required database/RLS setup.


## Table Sessions / إغلاق الطاولات
- Run `TABLE-SESSIONS-SETUP.sql` once in your own Supabase project.
- Kitchen can close a table only after all active orders on that table are served.
- A new customer scanning the same table QR after closure automatically gets a new session.
- An old customer page cannot place another order after its session has been closed.
