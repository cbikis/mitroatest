import{u as we,k as v,r as g,a as ce,l as fe,m as ye,c as Ce,d as o,e as n,f as s,p,t as u,i as k,j as y,g as w,w as R,F as te,q as ie,s as Te,n as A,b as $e,v as Ie,x as ae,y as re}from"./app-C4nfOcqx.js";import{u as he,a as De,b as Se}from"./countriesStore-DlzkWG2V.js";import{C as Y}from"./CustomDropdown-iE1I-pk4.js";const Pe={class:"flex justify-between mb-1 relative"},_e={class:"flex flex-wraptext-gray-700 self-end"},Ve={class:"text-black"},Ee=s("i",{class:"fas fa-info-circle",style:{"margin-right":"0.5rem"}},null,-1),Ne=s("i",{class:"fas fa-ellipsis-v",style:{"margin-right":"0.5rem"}},null,-1),Be=s("i",{class:"fa-solid fa-pen-to-square w-5 text-center"},null,-1),Ue=s("i",{class:"fa-solid fa-trash w-5 text-center"},null,-1),Me=s("i",{class:"fas fa-plus",style:{"margin-right":"0.3rem"}},null,-1),Fe=s("i",{class:"fa-solid fa-earth-europe w-5 text-center"},null,-1),je=s("i",{class:"fa-solid fa-building-columns w-5 text-center"},null,-1),qe=s("i",{class:"fa-solid fa-certificate w-5 text-center"},null,-1),Ae={key:0,class:"overflow-x-auto bg-blue-100 p-4 rounded-lg"},Le={class:"min-w-full bg-white border border-gray-300"},ze={class:"bg-blue-800 text-white"},Oe={class:"flex items-center justify-center"},Re={key:0,class:"fa-solid fa-chevron-up ml-2"},Ye={key:1,class:"fa-solid fa-chevron-down ml-2"},Xe={class:"flex items-center"},He={key:0,class:"fa-solid fa-chevron-up ml-2"},Ge={key:1,class:"fa-solid fa-chevron-down ml-2"},Je={class:"flex items-center"},Ke={key:0,class:"fa-solid fa-chevron-up ml-2"},Qe={key:1,class:"fa-solid fa-chevron-down ml-2"},We={class:"flex items-center"},Ze={key:0,class:"fa-solid fa-chevron-up ml-2"},et={key:1,class:"fa-solid fa-chevron-down ml-2"},tt={class:"flex items-center justify-center"},st={key:0,class:"fa-solid fa-chevron-up ml-2"},ot={key:1,class:"fa-solid fa-chevron-down ml-2"},nt={class:"flex items-center justify-center"},lt={key:0,class:"fa-solid fa-chevron-up ml-2"},it={key:1,class:"fa-solid fa-chevron-down ml-2"},at={class:"flex items-center justify-center"},rt={key:0,class:"fa-solid fa-chevron-up ml-2"},ut={key:1,class:"fa-solid fa-chevron-down ml-2"},dt={class:"flex items-center justify-center"},ct={key:0,class:"fa-solid fa-chevron-up ml-2"},ft={key:1,class:"fa-solid fa-chevron-down ml-2"},yt={key:6,scope:"col",class:"py-2 px-4 text-center font-bold"},ht={class:"text-gray-700"},vt={class:"border-t border-gray-300 py-2 px-4 text-center flex-0 w-1/12"},bt={class:"border-t border-gray-300 py-2 px-4 flex-0 w-2/12"},mt={class:"border-t border-gray-300 py-2 px-4 flex-0 w-1/5"},gt={class:"border-t border-gray-300 py-2 px-4 text-center"},xt={key:0},pt={key:0},kt={key:1,class:"text-center text-3xl"},wt={key:1},Ct={class:"border-t border-gray-300 py-2 px-4 text-center text-center"},Tt={key:0},$t={key:1},It={key:0},Dt={key:1,class:"text-center text-3xl"},St={key:0,class:"border-t border-gray-300 py-2 px-4 text-center"},Pt=["onClick"],_t=s("i",{class:"fa-solid fa-certificate w-5 text-center text-xl"},null,-1),Vt=[_t],Et=["onClick"],Nt=s("i",{class:"fa-solid fa-circle-info w-5 text-center text-xl"},null,-1),Bt=[Nt],Ut=["onClick"],Mt=s("i",{class:"fa-solid fa-pen-to-square w-5 text-center text-xl"},null,-1),Ft=[Mt],jt=["onClick"],qt=s("i",{class:"fa-solid fa-trash-can w-5 text-center text-xl"},null,-1),At=[qt],Lt={key:2,class:"fixed inset-0 bg-[#c4dff6] bg-opacity-75 flex items-center justify-center z-50"},zt={class:"bg-sky-300 p-6 rounded-lg shadow-lg max-w-sm w-full"},Ot={class:"text-lg font-medium leading-6 text-gray-900"},Rt={class:"mt-2 text-sm text-black"},Yt={class:"mt-4 flex justify-end"},Xt={key:3,class:"flex justify-center mt-4 mb-5"},Ht=["disabled"],Gt=s("i",{class:"fa-solid fa-angles-left"},null,-1),Jt=[Gt],Kt=["disabled"],Qt=s("i",{class:"fa-solid fa-angle-left"},null,-1),Wt=[Qt],Zt=["onClick"],es=["disabled"],ts=s("i",{class:"fa-solid fa-angle-right"},null,-1),ss=[ts],os=["disabled"],ns=s("i",{class:"fa-solid fa-angles-right"},null,-1),ls=[ns],ue={__name:"DynamicTable",props:{data:Array,sortColumn:String,sortDirection:String,sortTable:Function,redirectToView:Function,redirectToEdit:Function,confirmDelete:Function,currentPage:Number,totalPages:Number,pages:Array,showInstitutes:Boolean,isDeleteConfirmationVisible:Boolean},emits:["update:currentPage","confirmDelete","deleteSelectedInstitute","deleteSelectedTitle","update:isDeleteConfirmationVisible","certificateClick"],setup(e,{emit:f}){const m=e,{isAuthenticated:I,checkAuthentication:X}=we(),a=f,d=l=>{a("update:currentPage",l)},L=l=>{a("confirmDelete",l)},b=()=>{a("deleteSelectedInstitute")},H=()=>{a("deleteSelectedTitle")},V=he(),x=v(()=>V.selectedCountryName),E=v(()=>V.selectedShowInstitutes),G=l=>{a("certificateClick",l.country)},N=g(!1),T=g(!1),P=g(null),M=g(null),F=g(null),j=g(null),Q=()=>{N.value=!N.value},W=()=>{T.value=!T.value},J=l=>{N.value&&P.value&&F.value&&!P.value.contains(l.target)&&!F.value.contains(l.target)&&(N.value=!1)},z=l=>{T.value&&M.value&&j.value&&!M.value.contains(l.target)&&!j.value.contains(l.target)&&(T.value=!1)},B=g({visible:!1,content:"",top:0,left:0}),{t:_,locale:Z}=ce(),ee=v(()=>{let l;return $()?(typeof E<"u"&&E.value?x.value&&x.value!=="-1"?l=_("institutes_of")+x.value:l=_("institutes_per_country"):x.value&&x.value!=="-1"?l=_("titles_of")+x.value:l=_("titles_per_country"),l):_("institutes_and_country_prompt")}),$=()=>typeof E<"u"&&E.value!==null&&typeof x<"u"&&x.value!==null,K=(l,r)=>{const i=r.currentTarget.getBoundingClientRect(),U=20,S=10;B.value={visible:!0,content:l,top:window.scrollY+i.top-U-S,left:i.left+i.width/2,transform:"translateX(-50%)"}},D=()=>{B.value.visible=!1};return fe(()=>{X(),window.addEventListener("click",J),window.addEventListener("click",z)}),ye(()=>{window.removeEventListener("click",J),window.removeEventListener("click",z)}),(l,r)=>{const C=Ce("router-link");return o(),n(te,null,[s("div",Pe,[s("div",_e,[s("div",Ve,[Ee,p(" "+u(ee.value),1)])]),s("div",null,[k(I)&&$()?(o(),n("button",{key:0,class:"px-4 py-2 bg-[#c4dff6] rounded-lg hover:bg-[#77b6ea] self-end mr-[0.79rem] text-lg text-black",ref_key:"countryButton",ref:M,onClick:W},[Ne,p(" "+u(l.$t("country_menu_options_title")),1)],512)):y("",!0),T.value&&k(I)&&$()?(o(),n("div",{key:1,ref_key:"dropdownCountryMenu",ref:j,class:"absolute right-24 mt-1 p-2 bg-[#77b6ea] rounded-lg shadow-lg z-30"},[w(C,{to:"/edit-country",class:"flex items-center gap-2 py-2.5 px-4 text-black hover:bg-[#77b6ea] rounded transition duration-200"},{default:R(()=>[Be,s("span",null,u(l.$t("edit_country")),1)]),_:1}),w(C,{to:"/delete-country",class:"flex items-center gap-2 py-2.5 px-4 text-black hover:bg-[#77b6ea] rounded transition duration-200"},{default:R(()=>[Ue,s("span",null,u(l.$t("delete_country")),1)]),_:1})],512)):y("",!0),k(I)&&$()?(o(),n("button",{key:2,class:"px-4 py-2 bg-[#c4dff6] rounded-lg text-black hover:bg-[#77b6ea] self-end mr-[0.79rem] text-lg",ref_key:"button",ref:P,onClick:Q},[Me,p(" "+u(l.$t("add")),1)],512)):y("",!0),N.value&&k(I)&&$()?(o(),n("div",{key:3,ref_key:"dropdownMenu",ref:F,class:"absolute right-0 mt-1 p-2 bg-[#77b6ea] rounded-lg shadow-lg z-30"},[w(C,{to:"/add-country",class:"flex items-center gap-2 py-2.5 px-4 text-black hover:bg-[#c4dff6] rounded transition duration-200"},{default:R(()=>[Fe,s("span",null,u(l.$t("add_country")),1)]),_:1}),w(C,{to:"/add-institute",class:"flex items-center gap-2 py-2.5 px-4 text-black hover:bg-[#c4dff6] rounded transition duration-200"},{default:R(()=>[je,s("span",null,u(l.$t("add_insitute")),1)]),_:1}),w(C,{to:"/add-title",class:"flex items-center gap-2 py-2.5 px-4 text-black hover:bg-[#c4dff6] rounded transition duration-200"},{default:R(()=>[qe,s("span",null,u(l.$t("add_title")),1)]),_:1})],512)):y("",!0)])]),$()?(o(),n("div",Ae,[s("table",Le,[s("thead",ze,[s("tr",null,[s("th",{scope:"col",class:"sortable-header cursor-pointer py-2 px-4 font-bold flex-0 w-1/12",onClick:r[0]||(r[0]=i=>e.sortTable("id"))},[s("span",Oe,[p(" ID "),e.sortColumn==="id"&&e.sortDirection==="asc"?(o(),n("i",Re)):e.sortColumn==="id"&&e.sortDirection==="desc"?(o(),n("i",Ye)):y("",!0)])]),s("th",{scope:"col",class:"sortable-header cursor-pointer py-2 px-4 font-bold flex-0 w-2/12",onClick:r[1]||(r[1]=i=>e.sortTable("country"))},[s("span",Xe,[p(u(l.$t("country"))+" ",1),e.sortColumn==="country"&&e.sortDirection==="asc"?(o(),n("i",He)):e.sortColumn==="country"&&e.sortDirection==="desc"?(o(),n("i",Ge)):y("",!0)])]),e.showInstitutes?(o(),n("th",{key:0,scope:"col",class:"sortable-header cursor-pointer py-2 px-4 font-bold flex-0 w-1/5",onClick:r[2]||(r[2]=i=>e.sortTable("institute"))},[s("span",Je,[p(u(l.$t("institute"))+" ",1),e.sortColumn==="institute"&&e.sortDirection==="asc"?(o(),n("i",Ke)):e.sortColumn==="institute"&&e.sortDirection==="desc"?(o(),n("i",Qe)):y("",!0)])])):(o(),n("th",{key:1,scope:"col",class:"sortable-header cursor-pointer py-2 px-4 font-bold",onClick:r[3]||(r[3]=i=>e.sortTable("title"))},[s("span",We,[p(u(l.$t("title"))+" ",1),e.sortColumn==="title"&&e.sortDirection==="asc"?(o(),n("i",Ze)):e.sortColumn==="title"&&e.sortDirection==="desc"?(o(),n("i",et)):y("",!0)])])),e.showInstitutes?(o(),n("th",{key:2,scope:"col",class:"sortable-header cursor-pointer py-2 px-4 font-bold",onClick:r[4]||(r[4]=i=>e.sortTable("info"))},[s("span",tt,[p(u(l.$t("info"))+" ",1),e.sortColumn==="info"&&e.sortDirection==="asc"?(o(),n("i",st)):e.sortColumn==="info"&&e.sortDirection==="desc"?(o(),n("i",ot)):y("",!0)])])):(o(),n("th",{key:3,scope:"col",class:"sortable-header cursor-pointer py-2 px-4 font-bold",onClick:r[5]||(r[5]=i=>e.sortTable("title_type"))},[s("span",nt,[p(u(l.$t("title_type"))+" ",1),e.sortColumn==="title_type"&&e.sortDirection==="asc"?(o(),n("i",lt)):e.sortColumn==="title_type"&&e.sortDirection==="desc"?(o(),n("i",it)):y("",!0)])])),e.showInstitutes?(o(),n("th",{key:4,scope:"col",class:"sortable-header cursor-pointer py-2 px-4 font-bold",onClick:r[6]||(r[6]=i=>e.sortTable("franchise"))},[s("span",at,[p(u(l.$t("franchise"))+" ",1),e.sortColumn==="franchise"&&e.sortDirection==="asc"?(o(),n("i",rt)):e.sortColumn==="franchise"&&e.sortDirection==="desc"?(o(),n("i",ut)):y("",!0)])])):(o(),n("th",{key:5,scope:"col",class:"sortable-header cursor-pointer py-2 px-4 font-bold text-center",onClick:r[7]||(r[7]=i=>e.sortTable("info"))},[s("span",dt,[p(u(l.$t("info"))+" ",1),e.sortColumn==="info"&&e.sortDirection==="asc"?(o(),n("i",ct)):e.sortColumn==="info"&&e.sortDirection==="desc"?(o(),n("i",ft)):y("",!0)])])),e.showInstitutes||!e.showInstitutes&&k(I)?(o(),n("th",yt,u(l.$t("options")),1)):y("",!0)])]),s("tbody",ht,[(o(!0),n(te,null,ie(e.data,(i,U)=>(o(),n("tr",{key:i.id,class:A(U%2===0?"bg-[#c4dff6]":"bg-[#77b6ea]")},[s("td",vt,u(i.id),1),s("td",bt,u(i.country),1),s("td",mt,u(e.showInstitutes?i.institute:l.$t(i.title)),1),s("td",gt,[e.showInstitutes?(o(),n("div",xt,[i.info?(o(),n("div",pt,u(i.info),1)):(o(),n("div",kt,"-"))])):(o(),n("div",wt,u(l.$t(i.title_type)),1))]),s("td",Ct,[e.showInstitutes?(o(),n("div",Tt,u(i.franchise?l.$t("yes"):l.$t("no")),1)):(o(),n("div",$t,[i.info?(o(),n("div",It,u(i.info),1)):(o(),n("div",Dt,"-"))]))]),e.showInstitutes||!e.showInstitutes&&k(I)?(o(),n("td",St,[e.showInstitutes?(o(),n("button",{key:0,onClick:S=>G(i),onMouseover:r[8]||(r[8]=S=>K(l.$t("recognized_titles"),S)),onMouseleave:D,class:"mx-1 px-4 py-2 text-amber-400 rounded relative"},Vt,40,Pt)):y("",!0),e.showInstitutes?(o(),n("button",{key:1,class:"mx-1 px-4 py-2 text-blue-900 rounded",onClick:S=>e.redirectToView(i)},Bt,8,Et)):y("",!0),k(I)?(o(),n("button",{key:2,class:"mx-1 px-4 py-2 text-blue-900 rounded",onClick:S=>e.redirectToEdit(i)},Ft,8,Ut)):y("",!0),k(I)?(o(),n("button",{key:3,class:"mx-1 px-4 py-2 text-red-600 rounded",onClick:S=>L(i.id)},At,8,jt)):y("",!0)])):y("",!0)],2))),128))])])])):y("",!0),B.value.visible?(o(),n("div",{key:1,style:Te({position:"fixed",top:B.value.top+"px",left:B.value.left+"px",transform:"translateX(-50%)"}),class:"shadow-lg z-50 bg-sky-500 text-black rounded py-1 px-2"},u(l.$t("recognized_titles")),5)):y("",!0),m.isDeleteConfirmationVisible?(o(),n("div",Lt,[s("div",zt,[s("h3",Ot,u(e.showInstitutes?l.$t("delete_institute"):l.$t("delete_title")),1),s("p",Rt,u(e.showInstitutes?l.$t("delete_institute_question"):l.$t("delete_title_question")),1),s("div",Yt,[s("button",{onClick:r[9]||(r[9]=i=>l.$emit("update:isDeleteConfirmationVisible",!1)),class:"bg-[#c4dff6] text-gray-800 rounded px-4 py-2 mr-2 hover:bg-[#77b6ea] focus:outline-none focus:border-gray-400 focus:shadow-outline-gray"},u(l.$t("cancel")),1),s("button",{onClick:r[10]||(r[10]=i=>e.showInstitutes?b():H()),class:"bg-red-600 text-black rounded px-4 py-2 hover:bg-red-700 focus:outline-none focus:border-red-700 focus:shadow-outline-red"},u(l.$t("delete")),1)])])])):y("",!0),$()?(o(),n("div",Xt,[s("button",{class:A(["mx-1 px-4 py-2 bg-inherit rounded",{"text-sky-900 cursor-not-allowed":e.currentPage===1,"text-sky-600":e.currentPage!==1}]),onClick:r[11]||(r[11]=i=>d(1)),disabled:e.currentPage===1},Jt,10,Ht),s("button",{class:A(["mx-1 px-4 py-2 bg-inherit rounded",{"text-sky-900 cursor-not-allowed":e.currentPage===1,"text-sky-600":e.currentPage!==1}]),onClick:r[12]||(r[12]=i=>d(e.currentPage-1)),disabled:e.currentPage===1},Wt,10,Kt),(o(!0),n(te,null,ie(e.pages,i=>(o(),n("button",{key:i,class:A(["mx-1 px-4 py-2 bg-inherit text-sky-900 rounded",{"bg-[#c4dff6] text-black":e.currentPage===i,"hover:bg-[#77b6ea]":e.currentPage!==i}]),onClick:U=>d(i)},u(i),11,Zt))),128)),s("button",{class:A(["mx-1 px-4 py-2 bg-inherit rounded",{"text-sky-900 cursor-not-allowed":e.currentPage===e.totalPages,"text-sky-600":e.currentPage!==e.totalPages}]),onClick:r[13]||(r[13]=i=>d(e.currentPage+1)),disabled:e.currentPage===e.totalPages},ss,10,es),s("button",{class:A(["mx-1 px-4 py-2 bg-inherit rounded",{"text-sky-900 cursor-not-allowed":e.currentPage===e.totalPages,"text-sky-600":e.currentPage!==e.totalPages}]),onClick:r[14]||(r[14]=i=>d(e.totalPages)),disabled:e.currentPage===e.totalPages},ls,10,os)])):y("",!0)],64)}}},is={class:"flex flex-col items-center justify-center"},as={class:"container mx-auto p-4 bg-white rounded-lg shadow-md"},rs={class:"bg-[#77b6ea] p-4 rounded-lg mb-6 mt-32"},us={class:"grid grid-cols-1 md:grid-cols-2 gap-4"},ds={class:"block font-bold mb-2 text-blue-800",for:"search_country_name"},cs={class:"relative"},fs={class:"block font-bold mb-2 text-blue-800",for:"nationalRegistry"},ys={key:0},hs={class:"block font-bold mb-2 text-blue-800",for:"university"},vs={key:1},bs={class:"block font-bold mb-2 text-blue-800",for:"name"},ms={key:2},gs={class:"block font-bold mb-2 text-blue-800",for:"franchise"},xs={class:"relative"},ps={key:3},ks={class:"block font-bold mb-2 text-blue-800",for:"name"},ws={class:"relative"},Cs={class:"col-span-1 md:col-span-2 flex justify-between items-center"},Ts={class:"flex items-center space-x-2"},$s={class:"font-bold text-blue-800",for:"resultsPerPage"},Is=s("i",{class:"fas fa-broom mr-2"},null,-1),Ds={key:0},Ss={key:1},de=2,Ns={__name:"Index",setup(e){const f=g(null),{t:m,locale:I}=ce(),X=De(),a=he(),d=Se(),L=$e();let b;const H=v(()=>f.value?a.paginatedInstitutes:d.paginatedTitles),V=v(()=>f.value?a.currentPage:d.currentPage),x=v(()=>f.value?a.totalPages:d.totalPages),E=v(()=>f.value?a.sortColumn:d.sortColumn),G=v(()=>f.value?a.sortDirection:d.sortDirection),N=v(()=>{const t=a.institutes.map(q=>q.country),c=d.titles.map(q=>q.country),h=[...t,...c],O=new Set(h),pe={id:"-1",country:m("select_all_countries_label")},ke=Array.from(O).map(q=>({id:q,country:q}));return[pe,...ke]}),T=v({get:()=>f.value?a.selectedCountryName:d.selectedCountryName,set:t=>{a.setSelectedCountryName(t),d.setSelectedCountryName(t)}}),P=v({get:()=>(f.value=a.selectedShowInstitutes==null||a.selectedShowInstitutes===void 0?null:a.selectedShowInstitutes===1,f.value?a.selectedShowInstitutes:d.selectedShowInstitutes),set:t=>{a.setSelectedShowInstitutes(t),d.setSelectedShowInstitutes(t)}}),M=v({get:()=>a.searchInstituteText,set:t=>{a.setSearchInstituteText(t)}}),F=v({get:()=>d.searchTitleText,set:t=>{d.setSearchTitleText(t)}}),j=v({get:()=>d.searchTitleTypeText,set:t=>{d.setSearchTitleTypeText(t)}}),Q=v(()=>[{id:"all",name:m("yes/no")},{id:"yes",name:m("yes")},{id:"no",name:m("no")}]),W=v(()=>[{id:1,name:m("institutes")},{id:0,name:m("titles")}]),J=v(()=>[{id:"B (6)",name:m("B (6)")},{id:"B (7)",name:m("B (7)")},{id:"I (7)",name:m("I (7)")},{id:"D (8)",name:m("D (8)")}]),z=v({get:()=>a.franchiseFilter,set:t=>{a.setFranchiseFilter(t)}}),B=[{id:"10",name:"10"},{id:"25",name:"25"},{id:"50",name:"50"},{id:"100",name:"100"},{id:"250",name:"250"}],_=v({get:()=>f.value?a.perPage.toString():d.perPage.toString(),set:t=>{const c=parseInt(t,10);a.setPerPage(c),d.setPerPage(c)}}),Z=v(()=>{let t=Math.max(V.value-de,1),c=Math.min(V.value+de,x.value),h=[];for(let O=t;O<=c;O++)h.push(O);return h}),ee=t=>{L.push({name:"view-institute",params:{id:t.id.toString()},query:{country:t.country_id,institute:t.institute,info:t.info,franchise:t.franchise?"1":"0"}})},$=t=>{L.push({name:"edit-institute",params:{id:t.id.toString()},query:{country:t.country_id,institute:t.institute,info:t.info,franchise:t.franchise?"1":"0"}})},K=t=>{L.push({name:"edit-title",params:{id:t.id.toString()},query:{country:t.country_id,title:t.title,title_type:t.title_type,info:t.info}})},D=g(!1),l=g(null),r=g(null),C=t=>{f.value?l.value=t:r.value=t,S()},i=async()=>{l.value!==null&&(await a.deleteInstitute(l.value),se(),l.value=null)},U=async()=>{r.value!==null&&(await d.deleteTitle(r.value),se(),r.value=null)},S=()=>{D.value=!0},se=()=>{D.value=!1},oe=t=>{f.value?a.setCurrentPage(t):d.setCurrentPage(t)};g(!1);const ve=g(null);v(()=>{switch(ve.value){case"select_country":return m("select_country");default:return""}});const be=v(()=>T.value===""||T.value==null),me=t=>{};fe(async()=>{await a.fetchInstitutes(),await d.fetchTitles(),b=new BroadcastChannel("institute_updates"),b.onmessage=t=>{if(t.data.type==="UPDATE_INSTITUTE"){const c=t.data.payload;console.log(c),a.addInstitute(c)}},b=new BroadcastChannel("title_updates"),b.onmessage=t=>{if(t.data.type==="UPDATE_TITLE"){const c=t.data.payload;console.log(c),d.addTitle(c)}},b=new BroadcastChannel("country_updates"),b.onmessage=async t=>{if(t.data.type==="EDIT_COUNTRY"){const c=t.data.payload;X.updateCountry(c)}},b=new BroadcastChannel("institute_edit"),b.onmessage=async t=>{t.data.type==="EDIT_INSTITUTE"&&a.updateInstitute(t.data.payload)},b=new BroadcastChannel("title_edit"),b.onmessage=async t=>{t.data.type==="EDIT_TITLE"&&d.updateTitle(t.data.payload)},b=new BroadcastChannel("country_deletions"),b.onmessage=async t=>{t.data.type==="DELETE_COUNTRY"&&(console.log("This is the: ",t.data.payload),X.deleteCountry(t.data.payload),a.deleteInstitutesByCountryId(t.data.payload),d.deleteTitlesByCountryId(t.data.payload))}}),ye(()=>{b.close()}),Ie(f,(t,c)=>{t!==c&&(D.value=!1,l.value=null,r.value=null,P.value=t==!0?1:t==!1?0:null)});const ge=t=>{d.setSelectedCountryName(t),a.setSelectedCountryName(t),f.value=!f.value},ne=()=>f.value===!0,le=()=>f.value===!1,xe=()=>{a.setSelectedCountryName(null),a.setSearchInstituteText(""),a.setFranchiseFilter("all"),a.setCurrentPage(1),d.setSelectedCountryName(null),d.setSearchTitleText(""),d.setSearchTitleTypeText(""),d.setCurrentPage(1),f.value=null,P.value=null,a.setSelectedShowInstitutes(null),d.setSelectedShowInstitutes(null)};return(t,c)=>(o(),n("div",is,[s("div",as,[s("div",rs,[s("form",us,[s("div",null,[s("label",ds,u(t.$t("country")),1),s("div",cs,[w(Y,{id:"search_country_name",options:N.value,"option-value":"id","option-text":"country",modelValue:T.value,"onUpdate:modelValue":c[0]||(c[0]=h=>T.value=h),placeholder:t.$t("choose_country"),required:""},null,8,["options","modelValue","placeholder"])])]),s("div",null,[s("label",fs,u(t.$t("national_registries")),1),s("div",{class:"relative",onClick:me},[w(Y,{id:"instituteTitleOptionsId","read-οnly":be.value,options:W.value,"option-value":"id","option-text":"name",modelValue:P.value,"onUpdate:modelValue":c[1]||(c[1]=h=>P.value=h),placeholder:t.$t("please_select_national_registry")},null,8,["read-οnly","options","modelValue","placeholder"])])]),ne()?(o(),n("div",ys,[s("label",hs,u(t.$t("institute")),1),ae(s("input",{id:"name",autocomplete:"off",class:"w-full bg-white border border-gray-300 py-2 px-3 rounded leading-tight focus:outline-none",name:"name",type:"text","onUpdate:modelValue":c[2]||(c[2]=h=>M.value=h)},null,512),[[re,M.value]])])):le()?(o(),n("div",vs,[s("label",bs,u(t.$t("title")),1),ae(s("input",{id:"name",autocomplete:"off",class:"w-full bg-white border border-gray-300 py-2 px-3 rounded leading-tight focus:outline-none",name:"name",type:"text","onUpdate:modelValue":c[3]||(c[3]=h=>F.value=h)},null,512),[[re,F.value]])])):y("",!0),ne()?(o(),n("div",ms,[s("label",gs,u(t.$t("franchise")),1),s("div",xs,[w(Y,{id:"franchise",options:Q.value,"option-value":"id","option-text":"name",modelValue:z.value,"onUpdate:modelValue":c[4]||(c[4]=h=>z.value=h),placeholder:"Επιλέξτε"},null,8,["options","modelValue"])])])):le()?(o(),n("div",ps,[s("label",ks,u(t.$t("title_type")),1),s("div",ws,[w(Y,{id:"TitleOptionsId",options:J.value,"option-value":"id","option-text":"name",modelValue:j.value,"onUpdate:modelValue":c[5]||(c[5]=h=>j.value=h),placeholder:t.$t("please_select_type_title")},null,8,["options","modelValue","placeholder"])])])):y("",!0),s("div",Cs,[s("div",Ts,[s("label",$s,u(t.$t("results_per_page")),1),w(Y,{options:B,"width-class":"w-16","option-value":"id","option-text":"name",modelValue:_.value,"onUpdate:modelValue":c[6]||(c[6]=h=>_.value=h)},null,8,["modelValue"])]),s("button",{type:"reset",class:"bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 border-sky-400 border-2 py-2 px-4 rounded",onClick:xe},[Is,p(u(t.$t("clear")),1)])])])]),f.value?(o(),n("div",Ds,[w(ue,{data:H.value,sortColumn:E.value,sortDirection:G.value,sortTable:f.value?k(a).sortTable:k(d).sortTable,redirectToView:f.value?ee:"",redirectToEdit:f.value?$:K,confirmDelete:C,currentPage:V.value,totalPages:x.value,pages:Z.value,showInstitutes:f.value,isDeleteConfirmationVisible:D.value,"onUpdate:currentPage":oe,onConfirmDelete:C,onDeleteSelectedInstitute:i,onDeleteSelectedTitle:U,"onUpdate:isDeleteConfirmationVisible":c[7]||(c[7]=h=>D.value=h),onCertificateClick:ge},null,8,["data","sortColumn","sortDirection","sortTable","redirectToView","redirectToEdit","currentPage","totalPages","pages","showInstitutes","isDeleteConfirmationVisible"])])):(o(),n("div",Ss,[w(ue,{data:H.value,sortColumn:E.value,sortDirection:G.value,sortTable:f.value?k(a).sortTable:k(d).sortTable,redirectToEdit:f.value?$:K,confirmDelete:C,currentPage:V.value,totalPages:x.value,pages:Z.value,showInstitutes:f.value,isDeleteConfirmationVisible:D.value,"onUpdate:currentPage":oe,onConfirmDelete:C,onDeleteSelectedInstitute:i,onDeleteSelectedTitle:U,"onUpdate:isDeleteConfirmationVisible":c[8]||(c[8]=h=>D.value=h)},null,8,["data","sortColumn","sortDirection","sortTable","redirectToEdit","currentPage","totalPages","pages","showInstitutes","isDeleteConfirmationVisible"])]))])]))}};export{Ns as default};
