const {app,BrowserWindow,ipcMain}=require('electron'),path=require('path'),fs=require('fs');
// الحفظ لا يفشل: لو الملف مفتوح في Excel يُحفظ بنسخة بجانبه، ولو المجلد غير متاح يُجرَّب مجلد بديل
ipcMain.handle('save',(e,name,buf,sub)=>{
 const clean=s=>String(s||'').replace(/[\\/:*?"<>|]/g,'-').replace(/^\.+/,'');
 const data=Buffer.from(buf),fn=clean(name),ext=path.extname(fn),base=fn.slice(0,fn.length-ext.length);
 const roots=[path.join(app.getPath('desktop'),'Aswaq Badr'),path.join(app.getPath('documents'),'Aswaq Badr'),path.join(app.getPath('userData'),'Saved')];
 let err;
 for(const root of roots){
  const d=sub?path.join(root,clean(sub)):root;
  try{
   fs.mkdirSync(d,{recursive:true});
   try{fs.writeFileSync(path.join(d,fn),data)}
   catch(x){fs.writeFileSync(path.join(d,base+' (حفظ تلقائي)'+ext),data)}
   return d;
  }catch(x){err=x}
 }
 throw err;
});
app.whenReady().then(()=>{
 const w=new BrowserWindow({width:1280,height:800,icon:path.join(__dirname,'icon.png'),autoHideMenuBar:true,webPreferences:{preload:path.join(__dirname,'preload.js')}});
 w.maximize();w.loadFile('app/index.html');
 w.on('focus',()=>{try{w.webContents.focus()}catch(e){}});
});
app.on('window-all-closed',()=>app.quit());
