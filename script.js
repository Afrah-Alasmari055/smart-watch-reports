// ================================================================
// إعدادات — نفس قاعدة بيانات موقع النشاط الطلابي، بعقدة (node) منفصلة خاصة بهذا الموقع
// ================================================================
const FIREBASE_DB = "https://nashat-4479d-default-rtdb.asia-southeast1.firebasedatabase.app";
const DB_NODE = "smartHourTeachers";
const ADMIN_PASSWORD = "Afrah055155@1"; // نفس كلمة سر موقع النشاط — غيّريها هنا لو تبين كلمة مختلفة
const ADMIN_HASH = "#adminlogin";
const CRITERIA_LABELS = ["توظيف الساعة في الدرس","تنشيط مهارات الطالبات","إدارة الوقت الرقمي","التفاعل والمشاركة","ربط التقنية بالمنهج"];

let isAdmin = false;
function checkAdminMode(){
  if(localStorage.getItem('smarthour_admin') === '1'){ isAdmin = true; return; }
  if(location.hash === ADMIN_HASH){
    const pass = prompt('كلمة سر الإدارة:');
    if(pass === ADMIN_PASSWORD){
      localStorage.setItem('smarthour_admin', '1');
      isAdmin = true;
      alert('تم تفعيل وضع الإدارة على هذا المتصفح.');
    }
    history.replaceState(null, '', location.pathname + location.search);
  }
}

function esc(s){
  return String(s == null ? '' : s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

const seedTeachers = [
  { name:"افراح الاسمري",   role:"منسقة برنامج الساعة الذكية",  grade:"الثاني الابتدائي",  subject:"الرياضيات",
    criteria:[{label:"توظيف الساعة في الدرس",score:95},{label:"تنشيط مهارات الطالبات",score:90},{label:"إدارة الوقت الرقمي",score:88},{label:"التفاعل والمشاركة",score:92},{label:"ربط التقنية بالمنهج",score:87}],
    notes:"تُبدع في دمج الساعة الذكية مع تدريس الوحدات الرياضية، وتستخدم خاصية المؤقت لتنظيم وقت الحل بطريقة تنافسية محفزة. يُنصح بتوسيع التجربة لتشمل قياس النشاط البدني." },
  { name:"تهاني الثبيتي",   role:"مشرفة النشاط التقني",          grade:"الثالث الابتدائي", subject:"العلوم",
    criteria:[{label:"توظيف الساعة في الدرس",score:88},{label:"تنشيط مهارات الطالبات",score:85},{label:"إدارة الوقت الرقمي",score:91},{label:"التفاعل والمشاركة",score:89},{label:"ربط التقنية بالمنهج",score:84}],
    notes:"تتميز باستخدام خاصية قياس ضربات القلب ضمن درس الجهاز الدوري بطريقة عملية مبتكرة. تُشجع على توثيق التجارب وإشراك أولياء الأمور في المتابعة." },
  { name:"نوف السفياني",    role:"مطوِّرة المحتوى الرقمي",       grade:"الأول الابتدائي",  subject:"اللغة العربية",
    criteria:[{label:"توظيف الساعة في الدرس",score:82},{label:"تنشيط مهارات الطالبات",score:90},{label:"إدارة الوقت الرقمي",score:86},{label:"التفاعل والمشاركة",score:94},{label:"ربط التقنية بالمنهج",score:80}],
    notes:"تنجح في تحويل التعلم إلى تجربة ممتعة عبر تنبيهات الساعة لإدارة أوقات القراءة. يُقترح تطوير بنك مؤقتات مخصصة لأنشطة اللغة." },
  { name:"عزيزه الغامدي",  role:"قائدة فريق التقنية",           grade:"الرابع الابتدائي", subject:"التربية الإسلامية",
    criteria:[{label:"توظيف الساعة في الدرس",score:93},{label:"تنشيط مهارات الطالبات",score:88},{label:"إدارة الوقت الرقمي",score:95},{label:"التفاعل والمشاركة",score:91},{label:"ربط التقنية بالمنهج",score:96}],
    notes:"نموذج متميز في ربط الساعة الذكية بالقيم الإسلامية؛ تستخدم المؤقتات لتذكير الطالبات بأوقات الصلاة. تجربتها تستحق المشاركة على مستوى الإدارة." },
  { name:"ساره السبيعي",    role:"منسقة الصحة المدرسية",         grade:"الخامس الابتدائي", subject:"التربية البدنية",
    criteria:[{label:"توظيف الساعة في الدرس",score:97},{label:"تنشيط مهارات الطالبات",score:95},{label:"إدارة الوقت الرقمي",score:90},{label:"التفاعل والمشاركة",score:96},{label:"ربط التقنية بالمنهج",score:98}],
    notes:"الأعلى أداءً في تفعيل خصائص الساعة الصحية؛ تقيس معدل ضربات القلب قبل وبعد كل نشاط بدني. تجربة رائدة تستحق التوثيق والتعميم." },
  { name:"هدى السيالي",     role:"منسقة الأنشطة الصفية",         grade:"السادس الابتدائي", subject:"الاجتماعيات",
    criteria:[{label:"توظيف الساعة في الدرس",score:85},{label:"تنشيط مهارات الطالبات",score:87},{label:"إدارة الوقت الرقمي",score:89},{label:"التفاعل والمشاركة",score:86},{label:"ربط التقنية بالمنهج",score:83}],
    notes:"تستخدم الساعة لتنظيم جلسات العمل الجماعي وتحديد مهل تقديم المهام. يُنصح بتعميق التوظيف في وحدة المهارات الحياتية." },
  { name:"حنان الحارثي",    role:"مشرفة التعلم الذاتي",          grade:"الثالث الابتدائي", subject:"العلوم",
    criteria:[{label:"توظيف الساعة في الدرس",score:86},{label:"تنشيط مهارات الطالبات",score:91},{label:"إدارة الوقت الرقمي",score:84},{label:"التفاعل والمشاركة",score:88},{label:"ربط التقنية بالمنهج",score:85}],
    notes:"تبرع في تشجيع الطالبات على التحقق الذاتي من خطواتهن العلمية. يُقترح تطوير بطاقات مهام متوافقة مع إشعارات الجهاز." },
  { name:"سميحه الغامدي",  role:"منسقة التقييم الإلكتروني",     grade:"الرابع الابتدائي", subject:"الرياضيات",
    criteria:[{label:"توظيف الساعة في الدرس",score:90},{label:"تنشيط مهارات الطالبات",score:86},{label:"إدارة الوقت الرقمي",score:92},{label:"التفاعل والمشاركة",score:87},{label:"ربط التقنية بالمنهج",score:89}],
    notes:"تُوظف الساعة بذكاء لتحديد وقت حل الاختبارات القصيرة مما يعزز انضباط الطالبات. تجربتها في الاختبارات الزمنية رائدة." },
  { name:"هيا العلياني",    role:"مشرفة برامج الإبداع",          grade:"الثاني الابتدائي", subject:"الفنون",
    criteria:[{label:"توظيف الساعة في الدرس",score:88},{label:"تنشيط مهارات الطالبات",score:96},{label:"إدارة الوقت الرقمي",score:83},{label:"التفاعل والمشاركة",score:95},{label:"ربط التقنية بالمنهج",score:82}],
    notes:"أعلى مستوى في تنشيط الإبداع؛ تستخدم إشعارات مُبرمجة في جلسات العصف الذهني. يُنصح بتطوير بروتوكول خاص بحصص الفنون." },
  { name:"نوره القثامي",    role:"منسقة التكامل المعرفي",        grade:"الخامس الابتدائي", subject:"اللغة الإنجليزية",
    criteria:[{label:"توظيف الساعة في الدرس",score:84},{label:"تنشيط مهارات الطالبات",score:87},{label:"إدارة الوقت الرقمي",score:88},{label:"التفاعل والمشاركة",score:85},{label:"ربط التقنية بالمنهج",score:86}],
    notes:"تستخدم الساعة لتحديد وقت التحدث باللغة الإنجليزية وإدارة المحادثات. تجربة جديدة تستحق التوثيق والتعميم." },
  { name:"حمده الغامدي",   role:"قائدة التعلم النشط",           grade:"الأول الابتدائي",  subject:"التربية الإسلامية",
    criteria:[{label:"توظيف الساعة في الدرس",score:91},{label:"تنشيط مهارات الطالبات",score:89},{label:"إدارة الوقت الرقمي",score:93},{label:"التفاعل والمشاركة",score:90},{label:"ربط التقنية بالمنهج",score:88}],
    notes:"رائدة في استخدام الساعة مع الطالبات الصغيرات؛ يستخدمنها لتتبع حفظ الآيات. نموذج ملهم للمرحلة الأولى." },
  { name:"فاطمة هلال",      role:"منسقة الشراكة الأسرية",        grade:"السادس الابتدائي", subject:"اللغة العربية",
    criteria:[{label:"توظيف الساعة في الدرس",score:83},{label:"تنشيط مهارات الطالبات",score:85},{label:"إدارة الوقت الرقمي",score:87},{label:"التفاعل والمشاركة",score:84},{label:"ربط التقنية بالمنهج",score:81}],
    notes:"تُشارك بيانات الساعة مع أولياء الأمور أسبوعياً مما عزز متابعة المنزل للمهام القرائية. يُقترح تطوير قالب مشاركة موحد." },
  { name:"ميرفت الجعيدي",  role:"مشرفة برامج المجتهدات",       grade:"الرابع الابتدائي", subject:"العلوم",
    criteria:[{label:"توظيف الساعة في الدرس",score:87},{label:"تنشيط مهارات الطالبات",score:92},{label:"إدارة الوقت الرقمي",score:86},{label:"التفاعل والمشاركة",score:93},{label:"ربط التقنية بالمنهج",score:89}],
    notes:"تُدير مسابقة أسبوعية للطالبة المجتهدة معتمدةً على بيانات نشاط الساعة؛ النظام يُحفز الطالبات ويجعل المتابعة أكثر شفافية." },
  { name:"عزه الثقفي",      role:"منسقة الابتكار التقني",        grade:"الثاني الابتدائي", subject:"الرياضيات",
    criteria:[{label:"توظيف الساعة في الدرس",score:94},{label:"تنشيط مهارات الطالبات",score:90},{label:"إدارة الوقت الرقمي",score:95},{label:"التفاعل والمشاركة",score:89},{label:"ربط التقنية بالمنهج",score:92}],
    notes:"تُطوِّر أنماطاً جديدة لاستخدام الساعة في تدريس الجداول والقياس؛ مقترحاتها أُضيفت إلى بروتوكول البرنامج الرسمي." },
  { name:"لطفية اللهيبي",  role:"مشرفة التوثيق والجودة",        grade:"الخامس الابتدائي", subject:"الاجتماعيات",
    criteria:[{label:"توظيف الساعة في الدرس",score:86},{label:"تنشيط مهارات الطالبات",score:84},{label:"إدارة الوقت الرقمي",score:90},{label:"التفاعل والمشاركة",score:85},{label:"ربط التقنية بالمنهج",score:88}],
    notes:"تتولى توثيق إنجازات البرنامج بدقة وتُعد مرجعاً للمعلمات الجدد. يُنصح بتكليفها بإعداد الدليل الإرشادي الرسمي." },
  { name:"ريحانة الجميعي", role:"منسقة التعلم التعاوني",        grade:"الثالث الابتدائي", subject:"التربية البدنية",
    criteria:[{label:"توظيف الساعة في الدرس",score:89},{label:"تنشيط مهارات الطالبات",score:93},{label:"إدارة الوقت الرقمي",score:87},{label:"التفاعل والمشاركة",score:94},{label:"ربط التقنية بالمنهج",score:90}],
    notes:"تُنظم تحديات رياضية جماعية مُدارة بالساعة؛ كل مجموعة تتنافس في أهداف صحية يومية موثقة رقمياً. النتائج تعكس ارتفاعاً في دافعية الطالبات." },
  { name:"فوزيه المالكي",  role:"مشرفة دعم التعلم",             grade:"الأول الابتدائي",  subject:"اللغة العربية",
    criteria:[{label:"توظيف الساعة في الدرس",score:80},{label:"تنشيط مهارات الطالبات",score:84},{label:"إدارة الوقت الرقمي",score:82},{label:"التفاعل والمشاركة",score:86},{label:"ربط التقنية بالمنهج",score:79}],
    notes:"تُركز على استخدام الساعة مع الطالبات ذوات الاحتياجات الخاصة وقد حققت نتائج إيجابية في تعزيز الانتباه. يستحق هذا التطبيق بحثاً متخصصاً." },
  { name:"بدريه العتيبي",  role:"قائدة مبادرات الصحة",          grade:"السادس الابتدائي", subject:"التربية الإسلامية",
    criteria:[{label:"توظيف الساعة في الدرس",score:92},{label:"تنشيط مهارات الطالبات",score:88},{label:"إدارة الوقت الرقمي",score:94},{label:"التفاعل والمشاركة",score:90},{label:"ربط التقنية بالمنهج",score:93}],
    notes:"تُدير مبادرة 'يومي صحي' وترصد التزام الطالبات بأهداف يومية؛ النتائج تُعزز القيم الإسلامية وترتبط بالمنهج بشكل عضوي." },
  { name:"هاجر العصيمي",   role:"منسقة التحول الرقمي",          grade:"الخامس الابتدائي", subject:"العلوم",
    criteria:[{label:"توظيف الساعة في الدرس",score:88},{label:"تنشيط مهارات الطالبات",score:91},{label:"إدارة الوقت الرقمي",score:89},{label:"التفاعل والمشاركة",score:87},{label:"ربط التقنية بالمنهج",score:90}],
    notes:"تقود جلسات توعوية للمعلمات الجدد وتُعدّ دليلاً تفاعلياً لاستخدام الساعة في العلوم. حلقة الوصل بين البرنامج والمعلمات." },
];

// Hijri
function toHijri(d) {
  const JD = Math.floor((14+Math.floor((d.getMonth()+1+9)/12))/4)
    -Math.floor((3*(Math.floor((d.getFullYear()+Math.floor((d.getMonth()+1+9)/12)-1)/100)+1))/4)
    +Math.floor(275*(d.getMonth()+1)/9)+d.getDate()+d.getFullYear()*365
    +Math.floor(d.getFullYear()/4)+1721027.5;
  let l=Math.floor(JD)-1948440+10632;
  const n=Math.floor((l-1)/10631);
  l=l-10631*n+354;
  const J=(Math.floor((10985-l)/5316))*(Math.floor((50*l)/17719))+(Math.floor(l/5670))*(Math.floor((43*l)/15238));
  l=l-(Math.floor((30-J)/15))*(Math.floor((17719*J)/50))-(Math.floor(J/16))*(Math.floor((15238*J)/43))+29;
  const mo=Math.floor((24*l)/709), dy=l-Math.floor((709*mo)/24), yr=30*n+J-30;
  const ms=['محرم','صفر','ربيع الأول','ربيع الآخر','جمادى الأولى','جمادى الآخرة','رجب','شعبان','رمضان','شوال','ذو القعدة','ذو الحجة'];
  return `${dy} ${ms[mo-1]} ${yr} هـ`;
}
document.getElementById('hijriDate').textContent = toHijri(new Date());

// ================================================================
// تحميل بيانات المعلمات من قاعدة البيانات (مع تعبئة أولية تلقائية مرة واحدة)
// ================================================================
let teachers = [];

async function loadTeachers(){
  try{
    const res = await fetch(`${FIREBASE_DB}/${DB_NODE}.json`);
    const data = await res.json();
    if(data){
      teachers = Object.entries(data).map(([id, t]) => ({ id, ...t }));
    }else{
      const seedObj = {};
      seedTeachers.forEach((t, i) => { seedObj['t' + i] = t; });
      await fetch(`${FIREBASE_DB}/${DB_NODE}.json`, { method: 'PUT', body: JSON.stringify(seedObj) });
      teachers = Object.entries(seedObj).map(([id, t]) => ({ id, ...t }));
    }
  }catch(e){
    teachers = seedTeachers.map((t, i) => ({ id: 't' + i, ...t }));
  }
  buildGrid();
}

// Build grid
function buildGrid(){
  const grid = document.getElementById('teacherGrid');
  grid.innerHTML = '';
  teachers.forEach((t, i) => {
    const btn = document.createElement('button');
    btn.className = 'teacher-btn';
    btn.innerHTML = `<span class="btn-num">${i+1}</span>${esc(t.name)}`;
    btn.onclick = () => showReport(i, btn);
    grid.appendChild(btn);
  });
  if(isAdmin){
    const addBtn = document.createElement('button');
    addBtn.className = 'teacher-btn add-btn';
    addBtn.innerHTML = `<span class="btn-num">+</span>إضافة معلمة`;
    addBtn.onclick = () => openEditForm(null);
    grid.appendChild(addBtn);
  }
}

let activeBtn = null;

function showReport(i, btn) {
  if (activeBtn) activeBtn.classList.remove('active');
  if(btn){ btn.classList.add('active'); activeBtn = btn; }

  const t = teachers[i];
  const avg = Math.round(t.criteria.reduce((s,c)=>s+c.score,0)/t.criteria.length);
  const rating = avg>=95?'ممتاز':avg>=85?'جيد جداً':avg>=75?'جيد':'مقبول';
  const hijri = toHijri(new Date());

  const crHTML = t.criteria.map(c=>`
    <div class="criterion">
      <div class="crit-row">
        <span class="crit-name">${esc(c.label)}</span>
        <span class="crit-pct">${c.score}%</span>
      </div>
      <div class="bar-track"><div class="bar-fill" data-t="${c.score}"></div></div>
    </div>`).join('');

  const adminBtns = isAdmin ? `
    <div class="admin-actions">
      <button class="admin-edit-btn" onclick="openEditForm(${i})">✏️ تعديل بيانات المعلمة</button>
      <button class="admin-del-btn" onclick="deleteTeacher(${i})">🗑 حذف المعلمة</button>
    </div>` : '';

  document.getElementById('reportScroll').innerHTML = `
    <div class="report-card">
      <div class="card-header">
        <div class="card-header-top">
          <div>
            <h3>${esc(t.name)}</h3>
            <p>${esc(t.role)}<br>${esc(t.subject)} — ${esc(t.grade)}</p>
          </div>
          <div class="card-badge">⌚ ساعة ذكية</div>
        </div>
      </div>
      <div class="card-body">
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">المدرسة</div>
            <div class="info-value">الابتدائية الثانية بالقاعدة الجوية</div>
          </div>
          <div class="info-item">
            <div class="info-label">التاريخ الهجري</div>
            <div class="info-value hl">${hijri}</div>
          </div>
          <div class="info-item">
            <div class="info-label">المادة</div>
            <div class="info-value">${esc(t.subject)}</div>
          </div>
          <div class="info-item">
            <div class="info-label">التقييم الإجمالي</div>
            <div class="info-value hl">${avg}% — ${rating}</div>
          </div>
        </div>
        <div class="sec-title">معايير التقييم</div>
        <div class="criteria-list">${crHTML}</div>
        <div class="sec-title">ملاحظات المشرفة</div>
        <div class="notes-box">
          <div class="notes-hdr">📋 ملاحظة مخصصة</div>
          <div class="notes-text">${esc(t.notes)}</div>
        </div>
        <button class="print-btn" onclick="window.print()">🖨️ طباعة التقرير</button>
        ${adminBtns}
      </div>
    </div>`;

  // switch view
  document.getElementById('listView').style.display = 'none';
  document.getElementById('reportView').style.display = 'block';
  window.scrollTo(0,0);

  // animate bars
  requestAnimationFrame(() => {
    document.querySelectorAll('.bar-fill').forEach(b => {
      setTimeout(() => { b.style.width = b.dataset.t + '%'; }, 80);
    });
  });
}

function goBack() {
  document.getElementById('reportView').style.display = 'none';
  document.getElementById('listView').style.display = 'block';
  window.scrollTo(0,0);
}

// ================================================================
// إضافة / تعديل / حذف معلمة (وضع الإدارة)
// ================================================================
function openEditForm(index){
  const editing = index !== null;
  const t = editing ? teachers[index] : { name:'', role:'', grade:'', subject:'', criteria: CRITERIA_LABELS.map(l=>({label:l, score:80})), notes:'' };

  const scoreInputs = CRITERIA_LABELS.map((label, i) => `
    <div class="form-field">
      <label>${esc(label)}</label>
      <input type="number" min="0" max="100" id="ef-score-${i}" value="${t.criteria[i] ? t.criteria[i].score : 80}">
    </div>`).join('');

  const overlay = document.getElementById('editOverlay');
  overlay.innerHTML = `
    <div class="edit-panel">
      <h3>${editing ? 'تعديل بيانات المعلمة' : 'إضافة معلمة جديدة'}</h3>
      <div class="form-field"><label>الاسم</label><input type="text" id="ef-name" value="${esc(t.name)}"></div>
      <div class="form-field"><label>الدور / الوظيفة</label><input type="text" id="ef-role" value="${esc(t.role)}"></div>
      <div class="form-field"><label>الصف</label><input type="text" id="ef-grade" value="${esc(t.grade)}"></div>
      <div class="form-field"><label>المادة</label><input type="text" id="ef-subject" value="${esc(t.subject)}"></div>
      <div class="sec-title" style="margin-top:6px;">معايير التقييم (٠ – ١٠٠)</div>
      ${scoreInputs}
      <div class="form-field"><label>ملاحظات المشرفة</label><textarea id="ef-notes" rows="4">${esc(t.notes)}</textarea></div>
      <div class="edit-actions">
        <button class="print-btn" id="efSaveBtn">💾 حفظ</button>
        <button class="admin-del-btn" id="efCancelBtn">إلغاء</button>
      </div>
    </div>`;
  overlay.classList.add('open');

  document.getElementById('efCancelBtn').onclick = closeEditForm;
  document.getElementById('efSaveBtn').onclick = () => saveTeacher(editing ? teachers[index].id : null);
}

function closeEditForm(){
  document.getElementById('editOverlay').classList.remove('open');
}

async function saveTeacher(id){
  const name = document.getElementById('ef-name').value.trim();
  if(!name){ alert('اكتبي اسم المعلمة.'); return; }
  const data = {
    name,
    role: document.getElementById('ef-role').value.trim(),
    grade: document.getElementById('ef-grade').value.trim(),
    subject: document.getElementById('ef-subject').value.trim(),
    criteria: CRITERIA_LABELS.map((label, i) => ({
      label,
      score: Math.max(0, Math.min(100, parseInt(document.getElementById('ef-score-' + i).value, 10) || 0))
    })),
    notes: document.getElementById('ef-notes').value.trim()
  };
  const key = id || ('t' + Date.now());
  await fetch(`${FIREBASE_DB}/${DB_NODE}/${key}.json`, { method: 'PUT', body: JSON.stringify(data) });
  closeEditForm();
  await loadTeachers();
  goBack();
}

async function deleteTeacher(index){
  const t = teachers[index];
  if(!confirm(`حذف "${t.name}" نهائياً من النظام؟ لا يمكن التراجع.`)) return;
  await fetch(`${FIREBASE_DB}/${DB_NODE}/${t.id}.json`, { method: 'DELETE' });
  await loadTeachers();
  goBack();
}

checkAdminMode();
loadTeachers();
