const $=(s)=>document.querySelector(s);const $$=(s)=>[...document.querySelectorAll(s)];
$('#year').textContent=new Date().getFullYear();
const nav=$('#mainNav');$('#menuToggle').addEventListener('click',()=>{const open=nav.classList.toggle('active');$('#menuToggle').setAttribute('aria-expanded',String(open));});
$$('nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('active')));
const openModal=(id)=>{const m=$(id);m.classList.add('open');m.setAttribute('aria-hidden','false');};const closeModal=(m)=>{m.classList.remove('open');m.setAttribute('aria-hidden','true');};
$$('[data-open-collab]').forEach(b=>b.addEventListener('click',()=>openModal('#collabModal')));$$('[data-close-modal]').forEach(b=>b.addEventListener('click',()=>closeModal(b.closest('.modal'))));
$$('.modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)closeModal(m)}));document.addEventListener('keydown',e=>{if(e.key==='Escape')$$('.modal.open,.lightbox.open').forEach(closeModal)});
const lightbox=$('#lightbox'),lightboxImage=$('#lightboxImage');function showPhoto(src){lightboxImage.src=src;openModal('#lightbox')}$$('[data-lightbox]').forEach(b=>b.addEventListener('click',()=>showPhoto(b.dataset.lightbox)));$('#lightboxClose').addEventListener('click',()=>closeModal(lightbox));
$('#collabForm').addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.target);const subject=encodeURIComponent(`[Collaboration] ${d.get('type')} — ${d.get('name')}`);const body=encodeURIComponent(`Bonjour Mah Andry - KLS Ofisialy,\n\nNom : ${d.get('name')}\nType : ${d.get('type')}\n\nMessage :\n${d.get('message')}\n\nMerci.`);window.location.href=`mailto:herymahandry04@gmail.com?subject=${subject}&body=${body}`;});
const ACCESS='2104055042121';const uploadModal=$('#uploadModal');$('#openUpload').addEventListener('click',()=>{ $('#uploadNote').textContent='';openModal('#uploadModal');});
function getSaved(){try{return JSON.parse(localStorage.getItem('mahAndryPhotos')||'[]')}catch{return[]}}function saveSaved(items){localStorage.setItem('mahAndryPhotos',JSON.stringify(items))}
function renderUserPhotos(){
  const box=$('#userGallery');
  box.innerHTML='';
  getSaved().forEach((p,i)=>{
    const card=document.createElement('div');
    card.className='photo-card user-photo-card';
    const imageButton=document.createElement('button');
    imageButton.className='photo-open';
    imageButton.type='button';
    const img=document.createElement('img');
    img.src=p.src;
    img.alt=p.caption||'Photo ajoutée';
    img.loading='lazy';
    const caption=document.createElement('span');
    caption.textContent=(p.caption||'Photo personnelle')+' ↗';
    imageButton.append(img,caption);
    imageButton.addEventListener('click',()=>showPhoto(p.src));
    const del=document.createElement('button');
    del.type='button';
    del.className='delete-photo';
    del.textContent='Supprimer';
    del.setAttribute('aria-label','Supprimer cette photo');
    del.addEventListener('click',()=>{
      if(!confirm('Supprimer définitivement cette photo de ce navigateur ?')) return;
      const items=getSaved();
      items.splice(i,1);
      saveSaved(items);
      renderUserPhotos();
    });
    card.append(imageButton,del);
    box.appendChild(card);
  });
}
renderUserPhotos();
$('#uploadForm').addEventListener('submit',e=>{e.preventDefault();const code=$('#accessCode').value.trim(),file=$('#photoFile').files[0],note=$('#uploadNote');if(code!==ACCESS){note.textContent='Code incorrect. Veuillez réessayer.';return}if(!file||!file.type.startsWith('image/')){note.textContent='Veuillez choisir une image valide.';return}if(file.size>5*1024*1024){note.textContent='Image trop lourde : maximum 5 Mo.';return}const reader=new FileReader();reader.onload=()=>{const items=getSaved();items.unshift({src:reader.result,caption:$('#photoCaption').value.trim(),createdAt:Date.now()});try{saveSaved(items);renderUserPhotos();closeModal(uploadModal);e.target.reset()}catch{note.textContent='Stockage insuffisant dans ce navigateur.';}};reader.readAsDataURL(file);});
