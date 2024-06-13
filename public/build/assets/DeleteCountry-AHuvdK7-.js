import{a as b,k as i,B as v,r as d,l as h,d as x,e as g,f as e,p as m,t as c,h as C,g as p,i as w}from"./app-C4nfOcqx.js";import{a as V}from"./countriesStore-DlzkWG2V.js";import{_ as I}from"./Popup-BAEILLfG.js";import{C as k}from"./CustomDropdown-iE1I-pk4.js";const D={class:"flex justify-center mt-12 text-blue-950"},B={class:"flex flex-col justify-center items-center bg-[#c4dff6] rounded-xl p-3 mt-28 border-2 border-sky-400 max-w-2xl w-full"},M={class:"flex flex-wrap mt-2 self-start px-3"},S=e("i",{class:"fas fa-info-circle",style:{"margin-right":"0.5rem"}},null,-1),$=e("hr",{class:"border-t border-sky-400 w-full my-4 px-3"},null,-1),j={class:"mb-4"},N={for:"country_select",class:"block text-sm font-medium mb-1"},T={class:"px-4 py-2 bg-[#77b6ea] rounded-md hover:bg-sky-500 self-end",type:"submit"},U=e("i",{class:"fas fa-save",style:{"margin-right":"0.5rem"}},null,-1),A={__name:"DeleteCountry",setup(E){const{t:r}=b(),a=V(),f=i(()=>a.countries),t=v({selectedCountryId:null}),s=d(!1),l=d(null),y=i(()=>{switch(l.value){case"emptyInput":return r("please_select_a_country");case"countryDeleted":return r("country_deleted_successfully");case"error":return r("error_submitting_form");default:return""}}),_=async()=>{if(!t.selectedCountryId){l.value="emptyInput",s.value=!0;return}try{await a.deleteCountry(t.selectedCountryId),l.value="countryDeleted",s.value=!0,t.selectedCountryId=null}catch(o){console.error("There was an error deleting the country:",o),l.value="error",s.value=!0}};return h(async()=>{await a.fetchCountries()}),(o,n)=>(x(),g("div",D,[e("div",B,[e("div",M,[e("div",null,[S,m(" "+c(o.$t("delete_country_form_title")),1)])]),e("form",{onSubmit:C(_,["prevent"]),class:"flex flex-col justify-center gap-3 w-full px-3"},[$,e("div",j,[e("label",N,c(o.$t("add_title_form_country")),1),p(k,{id:"country_select",options:f.value,"option-value":"id","option-text":"country",modelValue:t.selectedCountryId,"onUpdate:modelValue":n[0]||(n[0]=u=>t.selectedCountryId=u),placeholder:w(r)("choose_country")},null,8,["options","modelValue","placeholder"])]),e("button",T,[U,m(" "+c(o.$t("delete")),1)])],32)]),p(I,{message:y.value,isVisible:s.value,"onUpdate:isVisible":n[1]||(n[1]=u=>s.value=u)},null,8,["message","isVisible"])]))}};export{A as default};
