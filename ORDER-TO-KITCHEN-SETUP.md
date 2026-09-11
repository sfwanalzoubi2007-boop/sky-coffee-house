# تشغيل الطلبات من الزبون إلى المطبخ

1. افتح Supabase الخاص بـ SKY.
2. SQL Editor → شغّل ملف `TABLE-SESSIONS-SETUP.sql` كاملًا.
3. Project Settings → API → انسخ Project URL و Anon/Publishable key.
4. ضع القيم في `js/supabase-config.js`.
5. ارفع المشروع.
6. الزبون يمسح QR للطاولة ويرسل الطلب.
7. افتح `management/kitchen.html` على جهاز المطبخ؛ الطلب يظهر مباشرة عبر Realtime، ويوجد تحديث احتياطي كل 5 ثوانٍ.

ملاحظة: السياسات الحالية للتشغيل الأولي وليست أفضل إعداد أمني للإنتاج. للحماية القوية نربط المطبخ بـ Supabase Auth ونمنع anon من قراءة/تعديل الطلبات.
