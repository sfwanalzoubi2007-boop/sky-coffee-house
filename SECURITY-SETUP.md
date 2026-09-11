# SKY Coffee House — Security setup

## What is protected
- `/management/` and `/management/kitchen.html` require a Supabase Auth account.
- The password is NOT stored in the website source.
- Create only the owner's/staff accounts in Supabase Auth. Do not add a public sign-up page.

## Important: GitHub
GitHub Pages is not suitable for keeping the management source private if the repository/site is public.
Recommended setup:
1. Keep the GitHub repository **Private**.
2. Deploy the public customer menu from your chosen hosting service.
3. Keep the staff pages protected by Supabase Auth.
4. Apply Supabase Row Level Security (RLS) to orders/tables/service-call tables so authentication is enforced at the database layer too.

A client-side login screen alone is not enough to protect database data.

## Supabase
1. Create a new Supabase project owned by you.
2. Put the Project URL and anon/publishable key in `js/supabase-config.js`.
3. In Authentication, create the owner's user manually. Keep public sign-ups disabled.
4. Add RLS policies for every table used by management/kitchen. Staff users should be allowed to read/update staff data; customers should only be allowed to create the customer-side order records that your app needs.
5. Never use a `service_role` key in this project.

## GitHub Pages warning
If you publish the repository publicly, anyone can inspect the HTML/JS/CSS. A private GitHub repository protects the source, but GitHub Pages hosting options vary by account/organization. For a private admin area, use a deployment/hosting setup that supports your private repository and keep Supabase RLS enabled.


### كلمة مرور المطبخ الإضافية
كلمة مرور المطبخ الحالية: `SKY@2026`
لتغييرها افتح `js/kitchen-lock.js` وابحث عن `const KITCHEN_PASSWORD = 'SKY@2026';` ثم استبدل القيمة.
هذه طبقة حماية إضافية على واجهة المطبخ، وليست بديلًا عن حماية Supabase/Auth وقواعد RLS.
