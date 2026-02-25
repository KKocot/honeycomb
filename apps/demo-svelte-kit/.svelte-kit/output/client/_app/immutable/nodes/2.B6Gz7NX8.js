import{f as k,a as f,t as Je,c as Ke}from"../chunks/BkLHf1Va.js";import{i as Ze}from"../chunks/-NXScx_w.js";import{aO as Xe,b as we,aN as et,j as tt,q as rt,V as at,aP as ot,c as r,s as e,r as t,p as Be,t as D,x as o,aM as me,a as Re,B as Ve,f as Me,a1 as Y,ar as He,a0 as st,aL as nt}from"../chunks/t7QkZnUW.js";import{i as O}from"../chunks/AagSw_hr.js";import{d as ze,s as w,a as xe}from"../chunks/BTj3Adh1.js";import{A as dt,u as it,a as lt,b as ct,c as ut,d as mt,e as Q,r as vt,s as oe,f as z,i as X,U as ge,B as he,M as fe,P as $,g as de,H as bt,D as pt,h as gt,j as ht,k as ft}from"../chunks/BXCpB_jM.js";import{a as Le}from"../chunks/DI5vNXOS.js";function xt(s,c,u=c){var m=new WeakSet;Xe(s,"input",async v=>{var i=v?s.defaultValue:s.value;if(i=Te(s)?Ae(i):i,u(i),we!==null&&m.add(we),await et(),i!==(i=c())){var p=s.selectionStart,b=s.selectionEnd,l=s.value.length;if(s.value=i??"",b!==null){var g=s.value.length;p===b&&b===l&&g>l?(s.selectionStart=g,s.selectionEnd=g):(s.selectionStart=p,s.selectionEnd=Math.min(b,g))}}}),(tt&&s.defaultValue!==s.value||rt(c)==null&&s.value)&&(u(Te(s)?Ae(s.value):s.value),we!==null&&m.add(we)),at(()=>{var v=c();if(s===document.activeElement){var i=ot??we;if(m.has(i))return}Te(s)&&v===Ae(s.value)||s.type==="date"&&!v&&!s.value||v!==s.value&&(s.value=v??"")})}function Te(s){var c=s.type;return c==="number"||c==="range"}function Ae(s){return s===""?null:+s}var _t=k('<div class="space-y-6"><section class="border border-border rounded-lg p-6 bg-muted/20"><h2 class="text-2xl font-semibold mb-4">API Tracker</h2> <p class="text-sm text-muted-foreground mb-4">Click the tracker to see all API endpoints and their health status.</p> <!></section></div>');function kt(s){var c=_t(),u=r(c),m=e(r(u),4);dt(m,{}),t(u),t(c),f(s,c)}var wt=k('<span class="text-muted-foreground text-sm">(loading...)</span>'),yt=k('<div class="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400"><strong>Error:</strong> </div>'),St=k("<em>Not connected</em>"),Ht=k("<span> </span>"),Ct=k('<span class="text-red-400">Error</span>'),Pt=k('<div class="flex items-center justify-between p-3 bg-background border border-border rounded"><div class="flex items-center gap-3 flex-1"><div></div> <span class="font-mono text-sm" data-testid="hive-hook-endpoint-url"> </span></div> <div class="flex gap-4 text-xs text-muted-foreground"><!> <!></div></div>'),Et=k('<div class="p-4 text-sm text-muted-foreground">Loading account data...</div>'),Tt=k('<div class="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm"><strong>Error:</strong> </div>'),At=k('<div class="space-y-2"><dl class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm"><dt class="text-muted-foreground">Name</dt> <dd class="font-mono"> </dd> <dt class="text-muted-foreground">Reputation</dt> <dd class="font-mono"> </dd> <dt class="text-muted-foreground">Posts</dt> <dd class="font-mono"> </dd> <dt class="text-muted-foreground">Balance</dt> <dd class="font-mono"> </dd> <dt class="text-muted-foreground">HBD Balance</dt> <dd class="font-mono"> </dd> <dt class="text-muted-foreground">Created</dt> <dd class="font-mono"> </dd></dl> <button class="mt-3 px-4 py-2 text-sm font-medium rounded bg-muted hover:bg-muted/80 border border-border transition-colors">Refetch</button></div>'),Lt=k('<div class="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm"><strong>Error:</strong> </div>'),Bt=k('<dl class="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm"><dt class="text-muted-foreground">Head Block</dt> <dd class="font-mono"> </dd> <dt class="text-muted-foreground">Current Supply</dt> <dd class="font-mono"> </dd> <dt class="text-muted-foreground">Block ID</dt> <dd class="font-mono truncate"> </dd></dl>'),Rt=k('<button class="px-4 py-2 text-sm font-medium rounded bg-hive-red text-white hover:bg-hive-red/90 transition-colors disabled:opacity-50"> </button> <!> <!>',1),Dt=k('<p class="text-sm text-muted-foreground">Waiting for chain connection...</p>'),It=k('<div class="space-y-6"><section class="border border-border rounded-lg p-6 bg-muted/20"><h2 class="text-2xl font-semibold mb-4">Connection Status</h2> <p class="text-xs text-muted-foreground mb-3 font-mono">useHive()</p> <div class="flex items-center gap-3"><div data-testid="hive-hook-status-dot"></div> <span class="text-lg capitalize" data-testid="hive-hook-status"> </span> <!></div> <!></section> <section class="border border-border rounded-lg p-6 bg-muted/20"><h2 class="text-2xl font-semibold mb-4">Current Endpoint</h2> <p class="text-xs text-muted-foreground mb-3 font-mono">useApiEndpoint()</p> <p class="font-mono text-sm text-muted-foreground" data-testid="hive-hook-endpoint"><!></p></section> <section class="border border-border rounded-lg p-6 bg-muted/20"><h2 class="text-2xl font-semibold mb-4"> </h2> <p class="text-xs text-muted-foreground mb-3 font-mono">useHiveStatus() + refreshEndpoints()</p> <div class="space-y-3"></div> <button class="mt-4 px-4 py-2 text-sm font-medium rounded bg-muted hover:bg-muted/80 border border-border transition-colors disabled:opacity-50"> </button></section> <section class="border border-border rounded-lg p-6 bg-muted/20"><h2 class="text-2xl font-semibold mb-4">Account Lookup</h2> <p class="text-xs text-muted-foreground mb-3 font-mono">useHiveAccount()</p> <p class="text-sm text-muted-foreground mb-4">Fetch Hive account data using the useHiveAccount hook.</p> <div class="flex gap-2 mb-4"><input type="text" placeholder="Enter username" class="flex-1 px-3 py-2 text-sm rounded border border-border bg-background focus:outline-none focus:ring-2 focus:ring-hive-red/50"/> <button class="px-4 py-2 text-sm font-medium rounded bg-hive-red text-white hover:bg-hive-red/90 transition-colors">Lookup</button></div> <!> <!> <!></section> <section class="border border-border rounded-lg p-6 bg-muted/20"><h2 class="text-2xl font-semibold mb-4">Chain API</h2> <p class="text-xs text-muted-foreground mb-3 font-mono">useHiveChain()</p> <p class="text-sm text-muted-foreground mb-4">Direct chain access using the useHiveChain hook.</p> <!></section></div>');function Ut(s,c){Be(c,!0);function u(a,d){return d in a}function m(a){return typeof a!="object"||a===null||!u(a,"head_block_number")||!u(a,"head_block_id")||!u(a,"current_supply")?!1:typeof a.head_block_number=="number"&&typeof a.head_block_id=="string"&&(typeof a.current_supply=="object"&&a.current_supply!==null||typeof a.current_supply=="string")}function v(a){switch(a){case"connected":return"bg-green-500";case"connecting":case"reconnecting":return"bg-yellow-500";case"error":case"disconnected":return"bg-red-500";default:return"bg-gray-500"}}const i=it(),p=lt(),b=ct(),l=ut();let g=me(!1),C=me("barddev"),S=me("barddev"),h=me(null),P=me(!1),x=me(null);const _=mt(()=>o(S));async function H(){Y(g,!0);try{await i.refresh_endpoints()}finally{Y(g,!1)}}function E(){const a=o(C).trim();a&&Y(S,a.toLowerCase(),!0)}async function A(){const a=l.chain;if(a){Y(P,!0),Y(x,null);try{const d=await a.api.database_api.get_dynamic_global_properties({});if(!m(d))throw new Error("Unexpected response shape from global properties API");const{current_supply:T}=d;let M="";typeof T=="object"&&T!==null?M=`${(parseInt(String(T.amount??"0"),10)/1e3).toFixed(3)} HIVE`:M=String(T),Y(h,{head_block_number:d.head_block_number,current_supply:M,head_block_id:d.head_block_id},!0)}catch(d){Y(x,d instanceof Error?d.message:"Failed to fetch global props",!0)}finally{Y(P,!1)}}}function L(a){a.key==="Enter"&&E()}var y=It(),W=r(y),J=e(r(W),4),F=r(J),K=e(F,2),ee=r(K,!0);t(K);var te=e(K,2);{var re=a=>{var d=wt();f(a,d)};O(te,a=>{i.is_loading&&a(re)})}t(J);var se=e(J,2);{var ve=a=>{var d=yt(),T=e(r(d));t(d),D(()=>w(T,` ${i.error??""}`)),f(a,d)};O(se,a=>{i.error&&a(ve)})}t(W);var ie=e(W,2),n=e(r(ie),4),B=r(n);{var R=a=>{var d=Je();D(()=>w(d,p.url)),f(a,d)},V=a=>{var d=St();f(a,d)};O(B,a=>{p.url?a(R):a(V,!1)})}t(n),t(ie);var q=e(ie,2),ae=r(q),le=r(ae);t(ae);var ce=e(ae,4);Q(ce,21,()=>b.endpoints,a=>a.url,(a,d)=>{var T=Pt(),M=r(T),N=r(M),be=e(N,2),ue=r(be,!0);t(be),t(M);var pe=e(M,2),U=r(pe);{var j=I=>{var Z=Ht(),ne=r(Z);t(Z),D(ke=>w(ne,`Checked: ${ke??""}`),[()=>new Date(o(d).lastCheck??0).toLocaleTimeString()]),f(I,Z)};O(U,I=>{o(d).lastCheck!==null&&I(j)})}var G=e(U,2);{var _e=I=>{var Z=Ct();D(()=>oe(Z,"title",o(d).lastError)),f(I,Z)};O(G,I=>{o(d).lastError&&I(_e)})}t(pe),t(T),D(()=>{Le(N,1,`w-3 h-3 rounded-full ${o(d).healthy?"bg-green-500":"bg-red-500"}`),oe(N,"title",o(d).healthy?"Healthy":"Unhealthy"),w(ue,o(d).url)}),f(a,T)}),t(ce);var ye=e(ce,2),Oe=r(ye,!0);t(ye),t(q);var Ce=e(q,2),Pe=e(r(Ce),6),Se=r(Pe);vt(Se);var Fe=e(Se,2);t(Pe);var De=e(Pe,2);{var $e=a=>{var d=Et();f(a,d)};O(De,a=>{_.is_loading&&a($e)})}var Ie=e(De,2);{var We=a=>{var d=Tt(),T=e(r(d));t(d),D(()=>w(T,` ${_.error.message??""}`)),f(a,d)};O(Ie,a=>{_.error&&a(We)})}var qe=e(Ie,2);{var Ne=a=>{const d=Ve(()=>_.account);var T=At(),M=r(T),N=e(r(M),2),be=r(N,!0);t(N);var ue=e(N,4),pe=r(ue,!0);t(ue);var U=e(ue,4),j=r(U,!0);t(U);var G=e(U,4),_e=r(G,!0);t(G);var I=e(G,4),Z=r(I,!0);t(I);var ne=e(I,4),ke=r(ne,!0);t(ne),t(M);var Ee=e(M,2);t(T),D(()=>{w(be,o(d).name),w(pe,o(d).reputation),w(j,o(d).post_count),w(_e,o(d).balance),w(Z,o(d).hbd_balance),w(ke,o(d).created)}),xe("click",Ee,function(...Qe){_.refetch?.apply(this,Qe)}),f(a,T)};O(qe,a=>{!_.is_loading&&!_.error&&_.account&&a(Ne)})}t(Ce);var Ue=e(Ce,2),je=e(r(Ue),6);{var Ge=a=>{var d=Rt(),T=Me(d),M=r(T,!0);t(T);var N=e(T,2);{var be=U=>{var j=Lt(),G=e(r(j));t(j),D(()=>w(G,` ${o(x)??""}`)),f(U,j)};O(N,U=>{o(x)&&U(be)})}var ue=e(N,2);{var pe=U=>{var j=Bt(),G=e(r(j),2),_e=r(G,!0);t(G);var I=e(G,4),Z=r(I,!0);t(I);var ne=e(I,4),ke=r(ne,!0);t(ne),t(j),D(Ee=>{w(_e,Ee),w(Z,o(h).current_supply),oe(ne,"title",o(h).head_block_id),w(ke,o(h).head_block_id)},[()=>o(h).head_block_number.toLocaleString()]),f(U,j)};O(ue,U=>{o(h)&&U(pe)})}D(()=>{T.disabled=o(P),w(M,o(P)?"Fetching...":"Fetch Global Properties")}),xe("click",T,A),f(a,d)},Ye=a=>{var d=Dt();f(a,d)};O(je,a=>{l.chain?a(Ge):a(Ye,!1)})}t(Ue),t(y),D(a=>{Le(F,1,`w-4 h-4 rounded-full ${a??""}`),oe(F,"title",i.status),w(ee,i.status),w(le,`All Endpoints (${b.endpoints.length??""})`),ye.disabled=o(g),w(Oe,o(g)?"Refreshing...":"Refresh Endpoints")},[()=>v(i.status)]),xe("click",ye,H),xe("keydown",Se,L),xt(Se,()=>o(C),a=>Y(C,a)),xe("click",Fe,E),f(s,y),Re()}ze(["click","keydown"]);var Vt=k('<div class="flex flex-col items-center gap-2"><!> <span class="text-xs text-muted-foreground"> </span></div>'),Mt=k('<div class="flex flex-col items-center gap-2"><!> <span class="text-xs text-muted-foreground"> </span></div>'),zt=k(`<div class="space-y-6"><section class="border border-border rounded-lg p-6 bg-muted/20"><h2 class="text-2xl font-semibold mb-4">Sizes</h2> <p class="text-sm text-muted-foreground mb-4">All available avatar sizes from xs to xl.</p> <div class="flex items-end gap-6"></div></section> <section class="border border-border rounded-lg p-6 bg-muted/20"><h2 class="text-2xl font-semibold mb-4">With Border</h2> <p class="text-sm text-muted-foreground mb-4">Ring border for emphasis or selection state.</p> <div class="flex items-center gap-6"><!> <!></div></section> <section class="border border-border rounded-lg p-6 bg-muted/20"><h2 class="text-2xl font-semibold mb-4">Overlapping Stack</h2> <p class="text-sm text-muted-foreground mb-4">Avatars stacked with overlap, commonly used for team members or PR
      reviewers.</p> <div class="flex -space-x-3"></div></section> <section class="border border-border rounded-lg p-6 bg-muted/20"><h2 class="text-2xl font-semibold mb-4">With Status Indicator</h2> <p class="text-sm text-muted-foreground mb-4">Wrap avatar in a relative container to add online/offline indicators.</p> <div class="flex items-center gap-6"><div class="relative"><!> <span class="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-background"></span></div> <div class="relative"><!> <span class="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-muted-foreground ring-2 ring-background"></span></div> <div class="relative"><!> <span class="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-yellow-500 ring-2 ring-background"></span></div></div></section> <section class="border border-border rounded-lg p-6 bg-muted/20"><h2 class="text-2xl font-semibold mb-4">Avatar Group</h2> <p class="text-sm text-muted-foreground mb-4">Stacked avatars with a "+N more" counter badge.</p> <div class="flex -space-x-2 items-center"><!> <div class="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground ring-2 ring-background"> </div></div></section> <section class="border border-border rounded-lg p-6 bg-muted/20"><h2 class="text-2xl font-semibold mb-4">Custom Fallback Colors</h2> <p class="text-sm text-muted-foreground mb-4">Override auto-generated fallback color with the fallbackColor prop.</p> <div class="flex items-center gap-4"><!> <!> <!> <!></div></section> <section class="border border-border rounded-lg p-6 bg-muted/20"><h2 class="text-2xl font-semibold mb-4">Fallback Initials</h2> <p class="text-sm text-muted-foreground mb-4">When profile image is unavailable, avatar shows user initials with
      auto-generated color.</p> <div class="flex items-end gap-6"></div></section></div>`);function Ot(s){const c=["barddev","blocktrades","arcange","good-karma","therealwolf"],u=["xs","sm","md","lg","xl"];var m=zt(),v=r(m),i=e(r(v),4);Q(i,5,()=>u,X,(R,V)=>{var q=Vt(),ae=r(q);z(ae,{username:"blocktrades",get size(){return o(V)}});var le=e(ae,2),ce=r(le,!0);t(le),t(q),D(()=>w(ce,o(V))),f(R,q)}),t(i),t(v);var p=e(v,2),b=e(r(p),4),l=r(b);z(l,{username:"blocktrades",size:"lg"});var g=e(l,2);z(g,{username:"blocktrades",size:"lg",showBorder:!0}),t(b),t(p);var C=e(p,2),S=e(r(C),4);Q(S,5,()=>c,X,(R,V)=>{z(R,{get username(){return o(V)},size:"lg",showBorder:!0,class:"ring-background"})}),t(S),t(C);var h=e(C,2),P=e(r(h),4),x=r(P),_=r(x);z(_,{username:"blocktrades",size:"lg"}),He(2),t(x);var H=e(x,2),E=r(H);z(E,{username:"barddev",size:"lg"}),He(2),t(H);var A=e(H,2),L=r(A);z(L,{username:"arcange",size:"lg"}),He(2),t(A),t(P),t(h);var y=e(h,2),W=e(r(y),4),J=r(W);Q(J,1,()=>c.slice(0,3),X,(R,V)=>{z(R,{get username(){return o(V)},size:"md",showBorder:!0,class:"ring-background"})});var F=e(J,2),K=r(F);t(F),t(W),t(y);var ee=e(y,2),te=e(r(ee),4),re=r(te);z(re,{username:"no-avatar-user-a",size:"lg",fallbackColor:"#E31337"});var se=e(re,2);z(se,{username:"no-avatar-user-b",size:"lg",fallbackColor:"#3B82F6"});var ve=e(se,2);z(ve,{username:"no-avatar-user-c",size:"lg",fallbackColor:"#10B981"});var ie=e(ve,2);z(ie,{username:"no-avatar-user-d",size:"lg",fallbackColor:"#8B5CF6"}),t(te),t(ee);var n=e(ee,2),B=e(r(n),4);Q(B,5,()=>u,X,(R,V)=>{var q=Mt(),ae=r(q);z(ae,{username:"this-user-does-not-exist-xyz",get size(){return o(V)}});var le=e(ae,2),ce=r(le,!0);t(le),t(q),D(()=>w(ce,o(V))),f(R,q)}),t(B),t(n),t(m),D(()=>w(K,`+${c.length-3}`)),f(s,m)}var Ft=k('<div class="space-y-6"><section class="border border-border rounded-lg p-6 bg-muted/20"><h2 class="text-2xl font-semibold mb-4">Default Variant</h2> <p class="text-sm text-muted-foreground mb-4">Standard card with avatar, name, reputation, and optional stats.</p> <div class="max-w-sm"><!></div></section> <section class="border border-border rounded-lg p-6 bg-muted/20"><h2 class="text-2xl font-semibold mb-4">Compact Variant</h2> <p class="text-sm text-muted-foreground mb-4">Inline display with small avatar, username and reputation.</p> <div class="space-y-2"></div></section> <section class="border border-border rounded-lg p-6 bg-muted/20"><h2 class="text-2xl font-semibold mb-4">Expanded Variant</h2> <p class="text-sm text-muted-foreground mb-4">Full profile card with cover image, bio, and detailed stats.</p> <div class="max-w-md"><!></div></section> <section class="border border-border rounded-lg p-6 bg-muted/20"><h2 class="text-2xl font-semibold mb-4">Without Stats</h2> <p class="text-sm text-muted-foreground mb-4">Hide post count and balances by setting showStats to false.</p> <div class="max-w-sm"><!></div></section> <section class="border border-border rounded-lg p-6 bg-muted/20"><h2 class="text-2xl font-semibold mb-4">User List</h2> <p class="text-sm text-muted-foreground mb-4">Multiple default cards in a grid layout.</p> <div class="grid grid-cols-1 sm:grid-cols-2 gap-4"></div></section> <section class="border border-border rounded-lg p-6 bg-muted/20"><h2 class="text-2xl font-semibold mb-4">Custom Styling</h2> <p class="text-sm text-muted-foreground mb-4">Override appearance with class prop.</p> <div class="max-w-sm"><!></div></section></div>');function $t(s){const c=["barddev","blocktrades","good-karma","arcange"];var u=Ft(),m=r(u),v=e(r(m),4),i=r(v);ge(i,{username:"blocktrades"}),t(v),t(m);var p=e(m,2),b=e(r(p),4);Q(b,5,()=>c,X,(L,y)=>{ge(L,{get username(){return o(y)},variant:"compact"})}),t(b),t(p);var l=e(p,2),g=e(r(l),4),C=r(g);ge(C,{username:"blocktrades",variant:"expanded"}),t(g),t(l);var S=e(l,2),h=e(r(S),4),P=r(h);ge(P,{username:"barddev",showStats:!1}),t(h),t(S);var x=e(S,2),_=e(r(x),4);Q(_,5,()=>c,X,(L,y)=>{ge(L,{get username(){return o(y)}})}),t(_),t(x);var H=e(x,2),E=e(r(H),4),A=r(E);ge(A,{username:"arcange",class:"bg-hive-red/10 border-hive-red"}),t(E),t(H),t(u),f(s,u)}var Wt=k('<div class="space-y-6"><section class="border border-border rounded-lg p-6 bg-muted/20"><h2 class="text-2xl font-semibold mb-4">Default Variant</h2> <p class="text-sm text-muted-foreground mb-4">Card showing HIVE, HBD, and Hive Power balances.</p> <div class="max-w-sm"><!></div></section> <section class="border border-border rounded-lg p-6 bg-muted/20"><h2 class="text-2xl font-semibold mb-4">Compact Variant</h2> <p class="text-sm text-muted-foreground mb-4">Inline display of all balances.</p> <!></section> <section class="border border-border rounded-lg p-6 bg-muted/20"><h2 class="text-2xl font-semibold mb-4">Expanded Variant</h2> <p class="text-sm text-muted-foreground mb-4">Full breakdown with HP delegations and savings.</p> <div class="max-w-md"><!></div></section> <section class="border border-border rounded-lg p-6 bg-muted/20"><h2 class="text-2xl font-semibold mb-4">Multiple Users</h2> <p class="text-sm text-muted-foreground mb-4">Balance cards for different users.</p> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"></div></section> <section class="border border-border rounded-lg p-6 bg-muted/20"><h2 class="text-2xl font-semibold mb-4">Compact List</h2> <p class="text-sm text-muted-foreground mb-4">Compact balances in a vertical list.</p> <div class="space-y-2"></div></section> <section class="border border-border rounded-lg p-6 bg-muted/20"><h2 class="text-2xl font-semibold mb-4">Custom Styling</h2> <p class="text-sm text-muted-foreground mb-4">Override styles with class prop.</p> <div class="max-w-sm"><!></div></section></div>');function qt(s){const c=["barddev","blocktrades","arcange"],u=["barddev","blocktrades","arcange","good-karma"];var m=Wt(),v=r(m),i=e(r(v),4),p=r(i);he(p,{username:"blocktrades"}),t(i),t(v);var b=e(v,2),l=e(r(b),4);he(l,{username:"blocktrades",variant:"compact"}),t(b);var g=e(b,2),C=e(r(g),4),S=r(C);he(S,{username:"blocktrades",variant:"expanded"}),t(C),t(g);var h=e(g,2),P=e(r(h),4);Q(P,5,()=>c,X,(L,y)=>{he(L,{get username(){return o(y)}})}),t(P),t(h);var x=e(h,2),_=e(r(x),4);Q(_,5,()=>u,X,(L,y)=>{he(L,{get username(){return o(y)},variant:"compact"})}),t(_),t(x);var H=e(x,2),E=e(r(H),4),A=r(E);he(A,{username:"arcange",class:"border-hive-red/50 max-w-sm"}),t(E),t(H),t(m),f(s,m)}var Nt=k('<div class="flex items-center gap-3"><span class="text-sm font-medium w-28"> </span> <!></div>'),jt=k(`<div class="space-y-6"><section class="border border-border rounded-lg p-6 bg-muted/20"><h2 class="text-2xl font-semibold mb-4">Full Variant</h2> <p class="text-sm text-muted-foreground mb-4">Three rings showing Voting Power, Downvote, and Resource Credits with
      labels and cooldown.</p> <!></section> <section class="border border-border rounded-lg p-6 bg-muted/20"><h2 class="text-2xl font-semibold mb-4">Compact Variant</h2> <p class="text-sm text-muted-foreground mb-4">Smaller inline rings without labels.</p> <!></section> <section class="border border-border rounded-lg p-6 bg-muted/20"><h2 class="text-2xl font-semibold mb-4">Ring Variant</h2> <p class="text-sm text-muted-foreground mb-4">Single RC ring for minimal display.</p> <!></section> <section class="border border-border rounded-lg p-6 bg-muted/20"><h2 class="text-2xl font-semibold mb-4">With Values</h2> <p class="text-sm text-muted-foreground mb-4">Full variant with raw mana values displayed.</p> <!></section> <section class="border border-border rounded-lg p-6 bg-muted/20"><h2 class="text-2xl font-semibold mb-4">Multiple Users</h2> <p class="text-sm text-muted-foreground mb-4">Compact manabars for several users.</p> <div class="space-y-3"></div></section> <section class="border border-border rounded-lg p-6 bg-muted/20"><h2 class="text-2xl font-semibold mb-4">Custom Styling</h2> <p class="text-sm text-muted-foreground mb-4">Override styles with class prop.</p> <!></section></div>`);function Gt(s){const c=["barddev","blocktrades","arcange"];var u=jt(),m=r(u),v=e(r(m),4);fe(v,{username:"blocktrades"}),t(m);var i=e(m,2),p=e(r(i),4);fe(p,{username:"blocktrades",variant:"compact"}),t(i);var b=e(i,2),l=e(r(b),4);fe(l,{username:"blocktrades",variant:"ring"}),t(b);var g=e(b,2),C=e(r(g),4);fe(C,{username:"blocktrades",showValues:!0}),t(g);var S=e(g,2),h=e(r(S),4);Q(h,5,()=>c,X,(_,H)=>{var E=Nt(),A=r(E),L=r(A);t(A);var y=e(A,2);fe(y,{get username(){return o(H)},variant:"compact"}),t(E),D(()=>w(L,`@${o(H)??""}`)),f(_,E)}),t(h),t(S);var P=e(S,2),x=e(r(P),4);fe(x,{username:"arcange",class:"border border-hive-red/50 rounded-lg p-4"}),t(P),t(u),f(s,u)}var Yt=k(`<div class="space-y-6"><section class="border border-border rounded-lg p-6 bg-muted/20"><h2 class="text-2xl font-semibold mb-4">Card Variant</h2> <p class="text-sm text-muted-foreground mb-4">Default full card with thumbnail, author, title, body preview, and stats.</p> <div class="max-w-lg space-y-4"><!> <!></div></section> <section class="border border-border rounded-lg p-6 bg-muted/20"><h2 class="text-2xl font-semibold mb-4">Compact Variant</h2> <p class="text-sm text-muted-foreground mb-4">Inline layout with small thumbnail, title, and stats. Good for lists and
      sidebars.</p> <div class="max-w-lg space-y-3"><!> <!> <!> <!></div></section> <section class="border border-border rounded-lg p-6 bg-muted/20"><h2 class="text-2xl font-semibold mb-4">Grid Variant</h2> <p class="text-sm text-muted-foreground mb-4">Image-first layout designed for grid displays and content feeds.</p> <div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><!> <!> <!> <!></div></section> <section class="border border-border rounded-lg p-6 bg-muted/20"><h2 class="text-2xl font-semibold mb-4">Hidden Elements</h2> <p class="text-sm text-muted-foreground mb-4">Use the <code class="text-xs bg-muted px-1 py-0.5 rounded">hide</code> prop to selectively remove payout, votes, comments, author, thumbnail, or time.</p> <div class="max-w-lg"><!></div></section> <section class="border border-border rounded-lg p-6 bg-muted/20"><h2 class="text-2xl font-semibold mb-4">Custom Link Target</h2> <p class="text-sm text-muted-foreground mb-4">Override the default link base URL with <code class="text-xs bg-muted px-1 py-0.5 rounded">linkTarget</code>.
      Links below point to peakd.com.</p> <div class="max-w-lg"><!></div></section></div>`);function Qt(s){const c={author:"barddev",permlink:"my-honey-pot"},u={author:"blocktrades",permlink:"updates-for-hive-roadmap-from-the-blocktrades-team"},m={author:"gtg",permlink:"hive-hardfork-28-jump-starter-kit"},v={author:"gtg",permlink:"brace-yourself-hardfork-is-coming"},i=["payout","votes"];var p=Yt(),b=r(p),l=e(r(b),4),g=r(l);$(g,{get author(){return c.author},get permlink(){return c.permlink}});var C=e(g,2);$(C,{get author(){return m.author},get permlink(){return m.permlink}}),t(l),t(b);var S=e(b,2),h=e(r(S),4),P=r(h);$(P,{get author(){return c.author},get permlink(){return c.permlink},variant:"compact"});var x=e(P,2);$(x,{get author(){return u.author},get permlink(){return u.permlink},variant:"compact"});var _=e(x,2);$(_,{get author(){return m.author},get permlink(){return m.permlink},variant:"compact"});var H=e(_,2);$(H,{get author(){return v.author},get permlink(){return v.permlink},variant:"compact"}),t(h),t(S);var E=e(S,2),A=e(r(E),4),L=r(A);$(L,{get author(){return c.author},get permlink(){return c.permlink},variant:"grid"});var y=e(L,2);$(y,{get author(){return u.author},get permlink(){return u.permlink},variant:"grid"});var W=e(y,2);$(W,{get author(){return m.author},get permlink(){return m.permlink},variant:"grid"});var J=e(W,2);$(J,{get author(){return v.author},get permlink(){return v.permlink},variant:"grid"}),t(A),t(E);var F=e(E,2),K=e(r(F),4),ee=r(K);$(ee,{get author(){return c.author},get permlink(){return c.permlink},get hide(){return i}}),t(K),t(F);var te=e(F,2),re=e(r(te),4),se=r(re);$(se,{get author(){return u.author},get permlink(){return u.permlink},linkTarget:"https://peakd.com"}),t(re),t(te),t(p),f(s,p)}var Jt=k(`<div class="space-y-6"><section class="border border-border rounded-lg p-4 sm:p-6 bg-muted/20"><h2 class="text-xl sm:text-2xl font-semibold mb-2">Sort Controls</h2> <p class="text-sm text-muted-foreground mb-4">Interactive sort controls to browse different post rankings.</p> <!></section> <div class="grid grid-cols-1 lg:grid-cols-2 gap-6"><section class="border border-border rounded-lg p-4 sm:p-6 bg-muted/20"><h2 class="text-xl sm:text-2xl font-semibold mb-2">Compact Variant</h2> <p class="text-sm text-muted-foreground mb-4">Default compact list ideal for post feeds.</p> <!></section> <section class="border border-border rounded-lg p-4 sm:p-6 bg-muted/20"><h2 class="text-xl sm:text-2xl font-semibold mb-2">Community Posts</h2> <p class="text-sm text-muted-foreground mb-4">Posts from a specific community (LeoFinance). Pass a community name as
        the <code class="bg-muted px-1 rounded">tag</code> prop.</p> <!></section> <section class="border border-border rounded-lg p-4 sm:p-6 bg-muted/20"><h2 class="text-xl sm:text-2xl font-semibold mb-2">Tag Filter</h2> <p class="text-sm text-muted-foreground mb-4">Posts filtered by tag (photography). Works with any Hive tag.</p> <!></section> <section class="border border-border rounded-lg p-4 sm:p-6 bg-muted/20"><h2 class="text-xl sm:text-2xl font-semibold mb-2">Pinned Posts</h2> <p class="text-sm text-muted-foreground mb-4">Pinned posts appear at the top with a badge.</p> <!></section> <section class="border border-border rounded-lg p-4 sm:p-6 bg-muted/20"><h2 class="text-xl sm:text-2xl font-semibold mb-2">Hidden Elements</h2> <p class="text-sm text-muted-foreground mb-4">Hide specific elements from post cards.</p> <!></section></div> <section class="border border-border rounded-lg p-4 sm:p-6 bg-muted/20"><h2 class="text-xl sm:text-2xl font-semibold mb-2">Card Variant</h2> <p class="text-sm text-muted-foreground mb-4">Full card layout with thumbnails and body preview.</p> <!></section> <section class="border border-border rounded-lg p-4 sm:p-6 bg-muted/20"><h2 class="text-xl sm:text-2xl font-semibold mb-2">Grid Variant</h2> <p class="text-sm text-muted-foreground mb-4">Grid layout with thumbnail-first design.</p> <!></section></div>`);function Kt(s){const c=[{author:"gtg",permlink:"hive-hardfork-28-jump-starter-kit"}];var u=Jt(),m=r(u),v=e(r(m),4);de(v,{show_sort_controls:!0,limit:5}),t(m);var i=e(m,2),p=r(i),b=e(r(p),4);de(b,{variant:"compact",limit:5}),t(p);var l=e(p,2),g=e(r(l),4);de(g,{tag:"hive-167922",limit:5,variant:"compact"}),t(l);var C=e(l,2),S=e(r(C),4);de(S,{tag:"photography",sort:"created",limit:5}),t(C);var h=e(C,2),P=e(r(h),4);de(P,{get pinned_posts(){return c},limit:5,variant:"compact"}),t(h);var x=e(h,2),_=e(r(x),4);de(_,{hide:["thumbnail","payout"],limit:5}),t(x),t(i);var H=e(i,2),E=e(r(H),4);de(E,{variant:"card",limit:3}),t(H);var A=e(H,2),L=e(r(A),4);de(L,{variant:"grid",limit:6}),t(A),t(u),f(s,u)}var Zt=k('<div class="grid grid-cols-1 lg:grid-cols-2 gap-6"><section class="border border-border rounded-lg p-4 sm:p-6 bg-muted/20"><h2 class="text-xl sm:text-2xl font-semibold mb-2">Raw Markdown</h2> <p class="text-sm text-muted-foreground mb-4">Source markdown used for the preview on the right.</p> <pre class="text-xs bg-background rounded-lg p-4 overflow-x-auto border border-border whitespace-pre-wrap break-words"></pre></section> <section class="border border-border rounded-lg p-4 sm:p-6 bg-muted/20"><h2 class="text-xl sm:text-2xl font-semibold mb-2">Live Preview</h2> <p class="text-sm text-muted-foreground mb-4">Renders Hive markdown with mentions, hashtags, embeds, and sanitization.</p> <div class="prose dark:prose-invert hive-renderer max-w-none"><!></div></section></div>');function Xt(s,c){Be(c,!1);const u=[...pt,new gt(ht)],m=`# Heading 1
## Heading 2
### Heading 3
#### Heading 4

*italic* **bold** Love**is**bold ***bold-italic*** ~~strikethrough~~

[link](http://example.com) and a #hive hashtag

Lists:
- Milk
- Bread
    - Wholegrain
- Butter

1. Tidy the kitchen
2. Prepare ingredients
3. Cook delicious things

![hive logo](https://cryptologos.cc/logos/hive-blockchain-hive-logo.png?v=035)

---

Blockquote:
> To be or not to be, that is the question.

Nested blockquote:
> Dorothy followed her through many of the beautiful rooms in her castle.
>
>> The Witch bade her clean the pots and kettles and sweep the floor and keep the fire fed with wood.

Complex blockquote:
> #### The quarterly results look great!
>
> - Revenue was off the chart.
> - Profits were higher than ever.
>
>  *Everything* is going according to **plan**.

Table:

One   | Two   | Three
------|-------|------
four  | five  | six
seven | eight | nine

Sample code: At the command prompt, type \`nano\`.

\`\`\`typescript
interface HivePost {
  author: string;
  permlink: string;
  title: string;
  body: string;
  created: string;
}

function get_post_url(post: HivePost): string {
  return \`/@\${post.author}/\${post.permlink}\`;
}
\`\`\`

\`\`\`css
.hive-renderer h1 {
  font-size: 1.6em;
  font-weight: 600;
}
\`\`\`

Links:
<https://www.markdownguide.org>

YouTube embed:
https://www.youtube.com/watch?v=a3ICNMQW7Ok

<details>
<summary>Click to expand</summary>

These details <em>remain</em> <strong>hidden</strong> until expanded.

<pre><code>PASTE LOGS HERE</code></pre>

</details>

<center>This text is centered using the center tag.</center>

Blockquote with link:
> Check out this post about precious metals on Hive. [source](https://peakd.com/silvergoldstackers/@silverd510/on-the-first-day-of)

Hive User links:
Hello Mr. @sketch.and.jam, how are you?`;Ze();var v=Zt(),i=r(v),p=e(r(i),4);p.textContent=`# Heading 1
## Heading 2
### Heading 3
#### Heading 4

*italic* **bold** Love**is**bold ***bold-italic*** ~~strikethrough~~

[link](http://example.com) and a #hive hashtag

Lists:
- Milk
- Bread
    - Wholegrain
- Butter

1. Tidy the kitchen
2. Prepare ingredients
3. Cook delicious things

![hive logo](https://cryptologos.cc/logos/hive-blockchain-hive-logo.png?v=035)

---

Blockquote:
> To be or not to be, that is the question.

Nested blockquote:
> Dorothy followed her through many of the beautiful rooms in her castle.
>
>> The Witch bade her clean the pots and kettles and sweep the floor and keep the fire fed with wood.

Complex blockquote:
> #### The quarterly results look great!
>
> - Revenue was off the chart.
> - Profits were higher than ever.
>
>  *Everything* is going according to **plan**.

Table:

One   | Two   | Three
------|-------|------
four  | five  | six
seven | eight | nine

Sample code: At the command prompt, type \`nano\`.

\`\`\`typescript
interface HivePost {
  author: string;
  permlink: string;
  title: string;
  body: string;
  created: string;
}

function get_post_url(post: HivePost): string {
  return \`/@\${post.author}/\${post.permlink}\`;
}
\`\`\`

\`\`\`css
.hive-renderer h1 {
  font-size: 1.6em;
  font-weight: 600;
}
\`\`\`

Links:
<https://www.markdownguide.org>

YouTube embed:
https://www.youtube.com/watch?v=a3ICNMQW7Ok

<details>
<summary>Click to expand</summary>

These details <em>remain</em> <strong>hidden</strong> until expanded.

<pre><code>PASTE LOGS HERE</code></pre>

</details>

<center>This text is centered using the center tag.</center>

Blockquote with link:
> Check out this post about precious metals on Hive. [source](https://peakd.com/silvergoldstackers/@silverd510/on-the-first-day-of)

Hive User links:
Hello Mr. @sketch.and.jam, how are you?`,t(i);var b=e(i,2),l=e(r(b),4),g=r(l);bt(g,{body:m,author:"guest4test2",permlink:"test-template",get plugins(){return u}}),t(l),t(b),t(v),f(s,v),Re()}var er=k('<button role="tab"> </button>'),tr=k('<div class="min-h-screen"><div class="container mx-auto px-4 py-8"><nav class="flex flex-wrap gap-2 mb-8" role="tablist"></nav> <div class="mb-8"><h2 class="text-2xl font-bold mb-2"> </h2> <p class="text-muted-foreground"> </p></div> <div role="tabpanel"><!></div></div> <footer class="border-t border-border mt-16 py-8"><div class="container mx-auto px-4 text-center text-sm text-muted-foreground"><p>Honeycomb SvelteKit Demo - @barddev/honeycomb-svelte</p></div></footer></div>');function rr(s,c){Be(c,!0);const u=[{id:"api-tracker",label:"API Tracker",title:"API Tracker",description:"Real-time monitoring of Hive API endpoints and connection status."},{id:"hooks",label:"Hooks",title:"Hooks",description:"Reactive hooks for accessing Hive blockchain data in Svelte components."},{id:"avatar",label:"Avatar",title:"Avatar",description:"User avatars fetched from Hive blockchain with multiple sizes."},{id:"user-card",label:"User Card",title:"User Card",description:"Displays Hive user profile information in a card layout."},{id:"balance-card",label:"Balance Card",title:"Balance Card",description:"Shows HIVE, HBD and HP balances for a given account."},{id:"manabar",label:"Manabar",title:"Manabar",description:"Resource Credits and voting mana visualization in multiple variants."},{id:"post-card",label:"Post Card",title:"Post Card",description:"Renders a Hive blog post in card, compact or grid layout."},{id:"post-list",label:"Post List",title:"Post List",description:"Paginated list of ranked Hive posts with sort controls and multiple layouts."},{id:"renderer",label:"Renderer",title:"Content Renderer",description:"Renders Hive markdown content with mentions, hashtags, embeds, and sanitization."}],m="api-tracker",v=new Set(u.map(n=>n.id));function i(n){return v.has(n)}function p(){if(typeof window>"u")return m;const B=new URLSearchParams(window.location.search).get("tab");return B&&i(B)?B:m}function b(n){const B=new URLSearchParams(window.location.search);B.set("tab",n),window.history.pushState(null,"",`?${B.toString()}`)}let l=me(st(p()));function g(n){Y(l,n,!0),b(n)}function C(){Y(l,p(),!0)}nt(()=>(window.addEventListener("popstate",C),()=>{window.removeEventListener("popstate",C)}));const S=Ve(()=>u.find(n=>n.id===o(l)));var h=tr(),P=r(h),x=r(P);Q(x,21,()=>u,X,(n,B)=>{var R=er(),V=r(R,!0);t(R),D(()=>{oe(R,"id",`tab-${o(B).id??""}`),oe(R,"aria-selected",o(l)===o(B).id),oe(R,"aria-controls",`tabpanel-${o(B).id??""}`),Le(R,1,`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${o(l)===o(B).id?"bg-foreground text-background":"bg-muted text-muted-foreground hover:text-foreground"}`),w(V,o(B).label)}),xe("click",R,()=>g(o(B).id)),f(n,R)}),t(x);var _=e(x,2),H=r(_),E=r(H,!0);t(H);var A=e(H,2),L=r(A,!0);t(A),t(_);var y=e(_,2),W=r(y);{var J=n=>{kt(n)},F=n=>{Ut(n,{})},K=n=>{Ot(n)},ee=n=>{$t(n)},te=n=>{qt(n)},re=n=>{Gt(n)},se=n=>{Qt(n)},ve=n=>{Kt(n)},ie=n=>{Xt(n,{})};O(W,n=>{o(l)==="api-tracker"?n(J):o(l)==="hooks"?n(F,1):o(l)==="avatar"?n(K,2):o(l)==="user-card"?n(ee,3):o(l)==="balance-card"?n(te,4):o(l)==="manabar"?n(re,5):o(l)==="post-card"?n(se,6):o(l)==="post-list"?n(ve,7):o(l)==="renderer"&&n(ie,8)})}t(y),t(P),He(2),t(h),D(()=>{w(E,o(S)?.title),w(L,o(S)?.description),oe(y,"id",`tabpanel-${o(l)??""}`),oe(y,"aria-labelledby",`tab-${o(l)??""}`)}),f(s,h),Re()}ze(["click"]);function cr(s){var c=Ke(),u=Me(c);{var m=v=>{ft(v,{children:(i,p)=>{rr(i,{})},$$slots:{default:!0}})};O(u,v=>{v(m)})}f(s,c)}export{cr as component};
