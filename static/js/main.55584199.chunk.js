(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{14:function(e,t,a){e.exports=a.p+"static/media/LogoCAAB.735869f8.png"},15:function(e,t,a){e.exports=a(28)},21:function(e,t,a){},22:function(e,t,a){},23:function(e,t,a){},28:function(e,t,a){"use strict";a.r(t);var n=a(0),o=a.n(n),r=a(13),l=a.n(r),s=(a(21),a(10)),c=a(3),i=(a(22),a(23),a(14)),u=a.n(i),m=a(30);var g=()=>{const[e,t]=Object(n.useState)(""),[a,r]=Object(n.useState)(""),[l,s]=Object(n.useState)(""),i=Object(c.o)();return o.a.createElement("div",{className:"login-container"},o.a.createElement("form",{className:"login-form",onSubmit:async t=>{t.preventDefault(),s(""),console.log("Sending login request:",{username:e,password:a});try{const t=await m.a.post("http://localhost:5000/api/login",{username:e,password:a},{headers:{"Content-Type":"application/json"}});console.log("Response:",t),200===t.status&&(console.log("Login successful"),i("/consultas"))}catch(r){var n,o;console.error("Login error:",r),s((null===(n=r.response)||void 0===n?void 0:null===(o=n.data)||void 0===o?void 0:o.message)||"An error occurred")}}},o.a.createElement("div",{className:"logo-container"},o.a.createElement("img",{src:u.a,alt:"Logo",className:"logo-image"})),o.a.createElement("div",{className:"form-group"},o.a.createElement("input",{type:"text",id:"username",value:e,onChange:e=>t(e.target.value),placeholder:"Usuario",required:!0})),o.a.createElement("div",{className:"form-group"},o.a.createElement("input",{type:"password",id:"password",value:a,onChange:e=>r(e.target.value),placeholder:"Contrase\xf1a",required:!0})),o.a.createElement("button",{type:"submit",className:"login-button"},"Iniciar Sesi\xf3n"),l&&o.a.createElement("div",{className:"error-message"},l)))};var p=()=>o.a.createElement("div",null,o.a.createElement("h2",null,"testing"));var d=function(){return o.a.createElement(s.a,{basename:"/TFG"},o.a.createElement(c.c,null,o.a.createElement(c.a,{path:"/",element:o.a.createElement(g,null)}),o.a.createElement(c.a,{path:"/consultas",element:o.a.createElement(p,null)})))};var v=e=>{e&&e instanceof Function&&a.e(3).then(a.bind(null,31)).then(t=>{let{getCLS:a,getFID:n,getFCP:o,getLCP:r,getTTFB:l}=t;a(e),n(e),o(e),r(e),l(e)})};l.a.createRoot(document.getElementById("root")).render(o.a.createElement(o.a.StrictMode,null,o.a.createElement(d,null))),v()}},[[15,1,2]]]);
//# sourceMappingURL=main.55584199.chunk.js.map