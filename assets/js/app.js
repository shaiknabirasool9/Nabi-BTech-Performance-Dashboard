let DATA = [];

function parseCSV(text) {
 const rows = [];
 let row = [], field = '', quoted = false;
 for (let i = 0; i < text.length; i++) {
  const char = text[i];
  if (quoted) {
   if (char === '"' && text[i + 1] === '"') { field += '"'; i++; }
   else if (char === '"') quoted = false;
   else field += char;
  } else if (char === '"') quoted = true;
  else if (char === ',') { row.push(field); field = ''; }
  else if (char === '\n') { row.push(field.replace(/\r$/, '')); rows.push(row); row = []; field = ''; }
  else field += char;
 }
 if (field.length || row.length) { row.push(field.replace(/\r$/, '')); rows.push(row); }
 const [headers, ...records] = rows.filter(record => record.some(value => value !== ''));
 return records.map(record => Object.fromEntries(headers.map((header, index) => [header, record[index] ?? '']))).map(record => {
  for (const key of ['Internal_Marks', 'External_Marks', 'Total_Marks', 'Credits', 'Standard_Max_Marks', 'Mark_Percentage', 'Max_Marks']) record[key] = Number(record[key]) || 0;
  return record;
 });
}

let semChart, gradeChart, componentChart;

const ids = ['semester','level','session','subject','component','grade'];
function getFilters() { const o={}; ids.forEach(id=>o[id]=document.getElementById(id).value); return o; }
function filtered() {
 const f=getFilters();
 return DATA.filter(x =>
   (!f.semester || String(x.Semester)===f.semester) &&
   (!f.level || String(x.Academic_Level)===f.level) &&
   (!f.session || String(x.Exam_Session)===f.session) &&
   (!f.subject || String(x.Subject_Name)===f.subject) &&
   (!f.component || String(x.Component_Type)===f.component) &&
   (!f.grade || String(x.Grade)===f.grade)
 );
}
function n(v) { return Number(v)||0; }
function applyFilters() { render(filtered()); }
function resetFilters() { ids.forEach(id=>document.getElementById(id).value=''); render(DATA); }
function render(rows) {
 const marks=rows.reduce((a,x)=>a+n(x.Total_Marks),0);
 const max=rows.reduce((a,x)=>a+n(x.Max_Marks),0);
 const credits=rows.reduce((a,x)=>a+n(x.Credits),0);
 const pct=max?marks/max*100:0;
 const pass=rows.length?rows.filter(x=>String(x.Result_Status).toUpperCase()==='P').length/rows.length*100:0;
 document.getElementById('kMarks').textContent=marks.toLocaleString();
 document.getElementById('kPct').textContent=pct.toFixed(2)+'%';
 document.getElementById('kCredits').textContent=credits.toLocaleString();
 document.getElementById('kSubjects').textContent=new Set(rows.map(x=>x.Subject_Code)).size;
 document.getElementById('kPass').textContent=pass.toFixed(1)+'%';
 document.getElementById('filterCount').textContent=rows.length+' record'+(rows.length===1?'':'s')+' selected';

 const semMap={};
 rows.forEach(x=>{const k=String(x.Semester);semMap[k]??={m:0,max:0};semMap[k].m+=n(x.Total_Marks);semMap[k].max+=n(x.Max_Marks);});
 const semKeys=Object.keys(semMap).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
 const semVals=semKeys.map(k=>semMap[k].max?semMap[k].m/semMap[k].max*100:0);
 if(semChart)semChart.destroy();
 semChart=new Chart(document.getElementById('semChart'),{type:'line',data:{labels:semKeys,datasets:[{label:'Percentage',data:semVals,tension:.3,fill:false}]},options:{responsive:true,maintainAspectRatio:false,scales:{y:{min:0,max:100,ticks:{callback:v=>v+'%'}}}}});

 const gm={}; rows.forEach(x=>gm[x.Grade]=(gm[x.Grade]||0)+1);
 if(gradeChart)gradeChart.destroy();
 gradeChart=new Chart(document.getElementById('gradeChart'),{type:'doughnut',data:{labels:Object.keys(gm),datasets:[{data:Object.values(gm)}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'right'}}}});

 const cm={}; rows.forEach(x=>cm[x.Component_Type]=(cm[x.Component_Type]||0)+n(x.Total_Marks));
 if(componentChart)componentChart.destroy();
 componentChart=new Chart(document.getElementById('componentChart'),{type:'bar',data:{labels:Object.keys(cm),datasets:[{label:'Total Marks',data:Object.values(cm)}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}}}});

 const sm={};
 rows.forEach(x=>{const k=x.Subject_Code+'||'+x.Subject_Name;sm[k]??={code:x.Subject_Code,name:x.Subject_Name,m:0,max:0};sm[k].m+=n(x.Total_Marks);sm[k].max+=n(x.Max_Marks);});
 const sr=Object.values(sm).map(x=>({...x,p:x.max?x.m/x.max:0})).sort((a,b)=>b.p-a.p).slice(0,15);
 document.getElementById('subjectBody').innerHTML=sr.length?sr.map(x=>`<tr><td><b>${x.code}</b> — ${x.name}</td><td>${x.m.toFixed(0)}/${x.max.toFixed(0)}</td><td>${(x.p*100).toFixed(2)}%</td><td><div class="barbg"><div class="barfill" style="width:${Math.min(100,x.p*100)}%"></div></div></td></tr>`).join(''):'<tr><td colspan="4">No data for the selected filters.</td></tr>';

 const top=sr[0], low=sr[sr.length-1];
 document.getElementById('insights').innerHTML=rows.length?`
 <b>Selected records:</b> ${rows.length}<br>
 <b>Highest subject:</b> ${top?top.name:'—'} (${top?(top.p*100).toFixed(2):'—'}%)<br>
 <b>Lowest subject in selection:</b> ${low?low.name:'—'} (${low?(low.p*100).toFixed(2):'—'}%)<br>
 <b>Overall selected percentage:</b> ${pct.toFixed(2)}%<br>
 <b>Pass rate:</b> ${pass.toFixed(1)}%
 `:'No records selected.';
}

fetch('data/sample_results.csv')
 .then(response => { if (!response.ok) throw new Error('Could not load result data.'); return response.text(); })
 .then(text => { DATA = parseCSV(text); render(DATA); })
 .catch(error => {
  document.getElementById('insights').textContent = error.message + ' Please open this dashboard through a local web server.';
  document.getElementById('filterCount').textContent = 'Data unavailable';
 });
