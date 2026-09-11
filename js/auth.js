/**
 * SKY Coffee House - local staff login
 * Change ADMIN_EMAIL and ADMIN_PASSWORD below to customize access.
 */
(function () {
  const ADMIN_EMAIL = 'admin@skycoffee.com';
  const ADMIN_PASSWORD = 'SKY@2026';
  const SESSION_KEY = 'sky_staff_logged_in';
  const path = location.pathname;
  const isStaffPage = /\/management(?:\/|$)/.test(path);
  if (!isStaffPage) return;

  const style = document.createElement('style');
  style.textContent = `
    #sky-auth-lock{position:fixed;inset:0;z-index:99999;background:#050505;display:flex;align-items:center;justify-content:center;padding:20px;color:#fff;font-family:Arial,sans-serif}
    #sky-auth-card{width:min(420px,100%);background:#0d0d0d;border:1px solid #333;border-radius:22px;padding:30px;box-shadow:0 20px 70px #000;text-align:center}
    #sky-auth-card img{width:76px;height:76px;object-fit:contain;border-radius:50%;margin-bottom:12px}
    #sky-auth-card h1{margin:0 0 8px;font-size:28px}
    #sky-auth-card p{color:#aaa;margin:0 0 24px}
    #sky-auth-card input{box-sizing:border-box;width:100%;padding:14px 15px;margin:7px 0;background:#171717;border:1px solid #444;border-radius:12px;color:#fff;font-size:16px;outline:none}
    #sky-auth-card input:focus{border-color:#fff}
    #sky-auth-card button{width:100%;padding:14px;margin-top:10px;border:0;border-radius:12px;background:#fff;color:#000;font-weight:700;font-size:16px;cursor:pointer}
    #sky-auth-error{min-height:22px;color:#ff7777;font-size:14px;margin-top:10px}
    body.sky-auth-pending > *:not(#sky-auth-lock){visibility:hidden}
  `;
  document.head.appendChild(style);
  document.documentElement.classList.add('sky-auth-pending');

  function showGate(){
    const gate=document.createElement('div');
    gate.id='sky-auth-lock';
    gate.innerHTML=`<div id="sky-auth-card" dir="rtl">
      <img src="../assets/images/logo.jpg" alt="SKY">
      <h1>SKY Coffee House</h1>
      <p>منطقة الموظفين — تسجيل الدخول مطلوب</p>
      <form id="sky-login-form">
        <input id="sky-email" type="email" autocomplete="username" placeholder="البريد الإلكتروني" required>
        <input id="sky-password" type="password" autocomplete="current-password" placeholder="كلمة المرور" required>
        <button type="submit">دخول الإدارة</button>
        <div id="sky-auth-error"></div>
      </form>
    </div>`;
    document.body.appendChild(gate);
    document.getElementById('sky-login-form').addEventListener('submit',e=>{
      e.preventDefault();
      const email=document.getElementById('sky-email').value.trim();
      const pass=document.getElementById('sky-password').value;
      const err=document.getElementById('sky-auth-error');
      if(email===ADMIN_EMAIL && pass===ADMIN_PASSWORD){
        sessionStorage.setItem(SESSION_KEY,'1');
        gate.remove(); document.documentElement.classList.remove('sky-auth-pending');
      }else err.textContent='البريد الإلكتروني أو كلمة المرور غير صحيحة.';
    });
  }

  if(sessionStorage.getItem(SESSION_KEY)==='1'){
    document.documentElement.classList.remove('sky-auth-pending');
  }else if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',showGate); else showGate();
})();
