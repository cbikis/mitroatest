import{a as x,k as y,r as m,B as w,l as g,d as h,e as N,f as e,p,t as c,h as I,g as _,i as k,x as V,y as S}from"./app-C4nfOcqx.js";import{a as U,u as E,b as B}from"./countriesStore-DlzkWG2V.js";import{C as M}from"./CustomDropdown-iE1I-pk4.js";import{_ as T}from"./Popup-BAEILLfG.js";const $={class:"flex justify-center mt-12 text-blue-950"},j={class:"flex flex-col justify-center items-center bg-[#c4dff6] rounded-xl p-3 mt-28 border-2 border-sky-400 max-w-2xl w-full"},D={class:"flex flex-wrap mt-2 self-start px-3"},F=e("i",{class:"fas fa-info-circle",style:{"margin-right":"0.5rem"}},null,-1),P=e("hr",{class:"border-t border-sky-400 w-full my-4 px-3"},null,-1),q={class:"mb-4"},z={for:"country_select",class:"block text-sm font-medium mb-1"},A={class:"mb-4"},G={for:"new_country_name",class:"block text-sm font-medium text-blue-950"},H={class:"px-4 py-2 bg-[#77b6ea] rounded-md hover:bg-sky-500 self-end",type:"submit"},J=e("i",{class:"fas fa-save",style:{"margin-right":"0.5rem"}},null,-1),X={__name:"EditCountry",setup(K){const{t:r}=x(),a=U(),i=y(()=>a.countries),f=E(),b=B(),n=m(!1),l=m(null),C=y(()=>{switch(l.value){case"emptyInput":return r("please_select_a_country");case"countryExists":return r("country_already_exists");case"emptyNewInput":return r("please_input_new_country_name");case"details_updated_successfully":return r("details_updated_successfully");case"success":return r("country_added_successfully");case"error":return r("error_submitting_form");default:return""}}),t=w({selectedCountryId:"",selectedCountryName:"",newCountryName:""}),v=async()=>{if(t.selectedCountryId){if(!t.newCountryName.trim()){l.value="emptyNewInput",n.value=!0;return}}else{l.value="emptyInput",n.value=!0;return}const o=t.newCountryName.toUpperCase();if(i.value.some(s=>s.country.toUpperCase()===o)){l.value="countryExists",n.value=!0;return}try{const s=a.getCountryNameById(t.selectedCountryId),L=await a.editCountry(t.selectedCountryId,{country:t.newCountryName.toUpperCase()}),d={id:t.selectedCountryId,country:t.newCountryName};f.updateCountryNameInInstitutes(s,o),b.updateCountryNameInTitles(s,o),a.updateCountry(d),a.broadcastUpdate(d),l.value="details_updated_successfully",n.value=!0}catch(s){console.error("Υπήρξε σφάλμα στην αποστολή της φόρμας",s),l.value="error",n.value=!0}};return g(async()=>{a.fetchCountries()}),(o,u)=>(h(),N("div",$,[e("div",j,[e("div",D,[e("div",null,[F,p(" "+c(o.$t("update_country_details")),1)])]),e("form",{onSubmit:I(v,["prevent"]),class:"flex flex-col justify-center gap-3 w-full px-3"},[P,e("div",q,[e("label",z,c(o.$t("existing_country")),1),_(M,{id:"country_select",options:i.value,"option-value":"id","option-text":"country",modelValue:t.selectedCountryId,"onUpdate:modelValue":u[0]||(u[0]=s=>t.selectedCountryId=s),placeholder:k(r)("choose_country")},null,8,["options","modelValue","placeholder"])]),e("div",A,[e("label",G,c(o.$t("new_country_name")),1),V(e("input",{id:"new_country_name","onUpdate:modelValue":u[1]||(u[1]=s=>t.newCountryName=s),type:"text",class:"mt-1 block w-full py-2 px-3 border border-sky-400 bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"},null,512),[[S,t.newCountryName]])]),e("button",H,[J,p(" "+c(o.$t("save")),1)])],32)]),_(T,{message:C.value,isVisible:n.value,"onUpdate:isVisible":u[2]||(u[2]=s=>n.value=s)},null,8,["message","isVisible"])]))}};export{X as default};