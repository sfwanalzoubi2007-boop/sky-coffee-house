(function(){
  // كلمة مرور إضافية لصفحة المطبخ فقط.
  // لتغييرها: عدّل قيمة KITCHEN_PASSWORD هنا.
  const KITCHEN_PASSWORD = 'SKY@2026';
  const SESSION_KEY = 'sky_kitchen_unlocked';

  const style=document.createElement('style');
  style.textContent=`
    #sky-kitchen-lock{position:fixed;inset:0;z-index:100000;background:#050505;display:flex;align-items:center;justify-content:center;padding:20px;color:#fff;font-family:Arial,sans-serif}
    #sky-kitchen-card{width:min(420px,100%);background:#0d0d0d;border:1px solid #333;border-radius:22px;padding:30px;box-shadow:0 20px 70px #000;text-align:center}
    #sky-kitchen-card img{width:78px;height:78px;object-fit:contain;border-radius:50%;margin-bottom:12px}
    #sky-kitchen-card h1{margin:0 0 8px;font-size:27px}
    #sky-kitchen-card p{color:#aaa;margin:0 0 22px}
    #sky-kitchen-password{box-sizing:border-box;width:100%;padding:14px;background:#171717;border:1px solid #444;border-radius:12px;color:#fff;font-size:17px;text-align:center;outline:none}
    #sky-kitchen-password:focus{border-color:#fff}
    #sky-kitchen-enter{width:100%;padding:14px;margin-top:12px;border:0;border-radius:12px;background:#fff;color:#000;font-weight:700;font-size:16px;cursor:pointer}
    #sky-kitchen-error{min-height:22px;color:#ff7777;font-size:14px;margin-top:10px}
  `;
  document.head.appendChild(style);

  function showLock(){
    const gate=document.createElement('div'); gate.id='sky-kitchen-lock';
    gate.innerHTML=`<div id="sky-kitchen-card" dir="rtl">
      <img src="../assets/images/logo.jpg" alt="SKY">
      <h1>SKY Coffee House</h1>
      <p>منطقة المطبخ — أدخل كلمة المرور للمتابعة</p>
      <form id="sky-kitchen-form">
        <input id="sky-kitchen-password" type="password" autocomplete="off" placeholder="كلمة مرور المطبخ" required>
        <button id="sky-kitchen-enter" type="submit">دخول المطبخ</button>
        <div id="sky-kitchen-error"></div>
      </form>
    </div>`;
    document.body.appendChild(gate);
    document.documentElement.classList.add('sky-kitchen-pending');
    document.getElementById('sky-kitchen-form').addEventListener('submit',function(e){
      e.preventDefault();
      const input=document.getElementById('sky-kitchen-password');
      const err=document.getElementById('sky-kitchen-error');
      if(input.value===KITCHEN_PASSWORD){
        sessionStorage.setItem(SESSION_KEY,'1'); gate.remove(); document.documentElement.classList.remove('sky-kitchen-pending');
      }else{ err.textContent='كلمة المرور غير صحيحة.'; input.value=''; input.focus(); }
    });
  }

  if(sessionStorage.getItem(SESSION_KEY)==='1') return;
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',showLock); else showLock();
})();
