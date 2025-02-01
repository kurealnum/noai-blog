var Be=Object.defineProperty;var we=(n,e,t)=>e in n?Be(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var se=(n,e,t)=>we(n,typeof e!="symbol"?e+"":e,t);import{r as l,av as De,aw as Le,ax as je,ay as W,az as re,S as y,j as N,x as ue,aA as J,G as Z,H as ce,y as ve,A as ae,Q as G,E as ke}from"./index-CmO8fXEh.js";import{b as Ne,a as $e,i as le}from"./Grow-CIvcUGQI.js";function Fe(n){if(n===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return n}function ee(n,e){var t=function(i){return e&&l.isValidElement(i)?e(i):i},a=Object.create(null);return n&&l.Children.map(n,function(o){return o}).forEach(function(o){a[o.key]=t(o)}),a}function Ie(n,e){n=n||{},e=e||{};function t(f){return f in e?e[f]:n[f]}var a=Object.create(null),o=[];for(var i in n)i in e?o.length&&(a[i]=o,o=[]):o.push(i);var s,p={};for(var u in e){if(a[u])for(s=0;s<a[u].length;s++){var d=a[u][s];p[a[u][s]]=t(d)}p[u]=t(u)}for(s=0;s<o.length;s++)p[o[s]]=t(o[s]);return p}function k(n,e,t){return t[e]!=null?t[e]:n.props[e]}function Ue(n,e){return ee(n.children,function(t){return l.cloneElement(t,{onExited:e.bind(null,t),in:!0,appear:k(t,"appear",n),enter:k(t,"enter",n),exit:k(t,"exit",n)})})}function ze(n,e,t){var a=ee(n.children),o=Ie(e,a);return Object.keys(o).forEach(function(i){var s=o[i];if(l.isValidElement(s)){var p=i in e,u=i in a,d=e[i],f=l.isValidElement(d)&&!d.props.in;u&&(!p||f)?o[i]=l.cloneElement(s,{onExited:t.bind(null,s),in:!0,exit:k(s,"exit",n),enter:k(s,"enter",n)}):!u&&p&&!f?o[i]=l.cloneElement(s,{in:!1}):u&&p&&l.isValidElement(d)&&(o[i]=l.cloneElement(s,{onExited:t.bind(null,s),in:d.props.in,exit:k(s,"exit",n),enter:k(s,"enter",n)}))}}),o}var Ae=Object.values||function(n){return Object.keys(n).map(function(e){return n[e]})},Oe={component:"div",childFactory:function(e){return e}},te=function(n){De(e,n);function e(a,o){var i;i=n.call(this,a,o)||this;var s=i.handleExited.bind(Fe(i));return i.state={contextValue:{isMounting:!0},handleExited:s,firstRender:!0},i}var t=e.prototype;return t.componentDidMount=function(){this.mounted=!0,this.setState({contextValue:{isMounting:!1}})},t.componentWillUnmount=function(){this.mounted=!1},e.getDerivedStateFromProps=function(o,i){var s=i.children,p=i.handleExited,u=i.firstRender;return{children:u?Ue(o,p):ze(o,s,p),firstRender:!1}},t.handleExited=function(o,i){var s=ee(this.props.children);o.key in s||(o.props.onExited&&o.props.onExited(i),this.mounted&&this.setState(function(p){var u=Le({},p.children);return delete u[o.key],{children:u}}))},t.render=function(){var o=this.props,i=o.component,s=o.childFactory,p=je(o,["component","childFactory"]),u=this.state.contextValue,d=Ae(this.state.children).map(s);return delete p.appear,delete p.enter,delete p.exit,i===null?W.createElement(re.Provider,{value:u},d):W.createElement(re.Provider,{value:u},W.createElement(i,p,d))},e}(W.Component);te.propTypes={};te.defaultProps=Oe;class _{constructor(){se(this,"mountEffect",()=>{this.shouldMount&&!this.didMount&&this.ref.current!==null&&(this.didMount=!0,this.mounted.resolve())});this.ref={current:null},this.mounted=null,this.didMount=!1,this.shouldMount=!1,this.setShouldMount=null}static create(){return new _}static use(){const e=Ne(_.create).current,[t,a]=l.useState(!1);return e.shouldMount=t,e.setShouldMount=a,l.useEffect(e.mountEffect,[t]),e}mount(){return this.mounted||(this.mounted=Ye(),this.shouldMount=!0,this.setShouldMount(this.shouldMount)),this.mounted}start(...e){this.mount().then(()=>{var t;return(t=this.ref.current)==null?void 0:t.start(...e)})}stop(...e){this.mount().then(()=>{var t;return(t=this.ref.current)==null?void 0:t.stop(...e)})}pulsate(...e){this.mount().then(()=>{var t;return(t=this.ref.current)==null?void 0:t.pulsate(...e)})}}function Xe(){return _.use()}function Ye(){let n,e;const t=new Promise((a,o)=>{n=a,e=o});return t.resolve=n,t.reject=e,t}function He(n){const{className:e,classes:t,pulsate:a=!1,rippleX:o,rippleY:i,rippleSize:s,in:p,onExited:u,timeout:d}=n,[f,M]=l.useState(!1),g=y(e,t.ripple,t.rippleVisible,a&&t.ripplePulsate),V={width:s,height:s,top:-(s/2)+i,left:-(s/2)+o},h=y(t.child,f&&t.childLeaving,a&&t.childPulsate);return!p&&!f&&M(!0),l.useEffect(()=>{if(!p&&u!=null){const D=setTimeout(u,d);return()=>{clearTimeout(D)}}},[u,p,d]),N.jsx("span",{className:g,style:V,children:N.jsx("span",{className:h})})}const m=ue("MuiTouchRipple",["root","ripple","rippleVisible","ripplePulsate","child","childLeaving","childPulsate"]),Q=550,Ke=80,We=J`
  0% {
    transform: scale(0);
    opacity: 0.1;
  }

  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`,Ge=J`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`,_e=J`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.92);
  }

  100% {
    transform: scale(1);
  }
`,qe=Z("span",{name:"MuiTouchRipple",slot:"Root"})({overflow:"hidden",pointerEvents:"none",position:"absolute",zIndex:0,top:0,right:0,bottom:0,left:0,borderRadius:"inherit"}),Qe=Z(He,{name:"MuiTouchRipple",slot:"Ripple"})`
  opacity: 0;
  position: absolute;

  &.${m.rippleVisible} {
    opacity: 0.3;
    transform: scale(1);
    animation-name: ${We};
    animation-duration: ${Q}ms;
    animation-timing-function: ${({theme:n})=>n.transitions.easing.easeInOut};
  }

  &.${m.ripplePulsate} {
    animation-duration: ${({theme:n})=>n.transitions.duration.shorter}ms;
  }

  & .${m.child} {
    opacity: 1;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: currentColor;
  }

  & .${m.childLeaving} {
    opacity: 0;
    animation-name: ${Ge};
    animation-duration: ${Q}ms;
    animation-timing-function: ${({theme:n})=>n.transitions.easing.easeInOut};
  }

  & .${m.childPulsate} {
    position: absolute;
    /* @noflip */
    left: 0px;
    top: 0;
    animation-name: ${_e};
    animation-duration: 2500ms;
    animation-timing-function: ${({theme:n})=>n.transitions.easing.easeInOut};
    animation-iteration-count: infinite;
    animation-delay: 200ms;
  }
`,Je=l.forwardRef(function(e,t){const a=ce({props:e,name:"MuiTouchRipple"}),{center:o=!1,classes:i={},className:s,...p}=a,[u,d]=l.useState([]),f=l.useRef(0),M=l.useRef(null);l.useEffect(()=>{M.current&&(M.current(),M.current=null)},[u]);const g=l.useRef(!1),V=$e(),h=l.useRef(null),D=l.useRef(null),E=l.useCallback(c=>{const{pulsate:R,rippleX:b,rippleY:I,rippleSize:L,cb:U}=c;d(x=>[...x,N.jsx(Qe,{classes:{ripple:y(i.ripple,m.ripple),rippleVisible:y(i.rippleVisible,m.rippleVisible),ripplePulsate:y(i.ripplePulsate,m.ripplePulsate),child:y(i.child,m.child),childLeaving:y(i.childLeaving,m.childLeaving),childPulsate:y(i.childPulsate,m.childPulsate)},timeout:Q,pulsate:R,rippleX:b,rippleY:I,rippleSize:L},f.current)]),f.current+=1,M.current=U},[i]),$=l.useCallback((c={},R={},b=()=>{})=>{const{pulsate:I=!1,center:L=o||R.pulsate,fakeElement:U=!1}=R;if((c==null?void 0:c.type)==="mousedown"&&g.current){g.current=!1;return}(c==null?void 0:c.type)==="touchstart"&&(g.current=!0);const x=U?null:D.current,S=x?x.getBoundingClientRect():{width:0,height:0,left:0,top:0};let B,C,w;if(L||c===void 0||c.clientX===0&&c.clientY===0||!c.clientX&&!c.touches)B=Math.round(S.width/2),C=Math.round(S.height/2);else{const{clientX:z,clientY:j}=c.touches&&c.touches.length>0?c.touches[0]:c;B=Math.round(z-S.left),C=Math.round(j-S.top)}if(L)w=Math.sqrt((2*S.width**2+S.height**2)/3),w%2===0&&(w+=1);else{const z=Math.max(Math.abs((x?x.clientWidth:0)-B),B)*2+2,j=Math.max(Math.abs((x?x.clientHeight:0)-C),C)*2+2;w=Math.sqrt(z**2+j**2)}c!=null&&c.touches?h.current===null&&(h.current=()=>{E({pulsate:I,rippleX:B,rippleY:C,rippleSize:w,cb:b})},V.start(Ke,()=>{h.current&&(h.current(),h.current=null)})):E({pulsate:I,rippleX:B,rippleY:C,rippleSize:w,cb:b})},[o,E,V]),Y=l.useCallback(()=>{$({},{pulsate:!0})},[$]),F=l.useCallback((c,R)=>{if(V.clear(),(c==null?void 0:c.type)==="touchend"&&h.current){h.current(),h.current=null,V.start(0,()=>{F(c,R)});return}h.current=null,d(b=>b.length>0?b.slice(1):b),M.current=R},[V]);return l.useImperativeHandle(t,()=>({pulsate:Y,start:$,stop:F}),[Y,$,F]),N.jsx(qe,{className:y(m.root,i.root,s),ref:D,...p,children:N.jsx(te,{component:null,exit:!0,children:u})})});function Ze(n){return ve("MuiButtonBase",n)}const et=ue("MuiButtonBase",["root","disabled","focusVisible"]),tt=n=>{const{disabled:e,focusVisible:t,focusVisibleClassName:a,classes:o}=n,s=ke({root:["root",e&&"disabled",t&&"focusVisible"]},Ze,o);return t&&a&&(s.root+=` ${a}`),s},nt=Z("button",{name:"MuiButtonBase",slot:"Root",overridesResolver:(n,e)=>e.root})({display:"inline-flex",alignItems:"center",justifyContent:"center",position:"relative",boxSizing:"border-box",WebkitTapHighlightColor:"transparent",backgroundColor:"transparent",outline:0,border:0,margin:0,borderRadius:0,padding:0,cursor:"pointer",userSelect:"none",verticalAlign:"middle",MozAppearance:"none",WebkitAppearance:"none",textDecoration:"none",color:"inherit","&::-moz-focus-inner":{borderStyle:"none"},[`&.${et.disabled}`]:{pointerEvents:"none",cursor:"default"},"@media print":{colorAdjust:"exact"}}),at=l.forwardRef(function(e,t){const a=ce({props:e,name:"MuiButtonBase"}),{action:o,centerRipple:i=!1,children:s,className:p,component:u="button",disabled:d=!1,disableRipple:f=!1,disableTouchRipple:M=!1,focusRipple:g=!1,focusVisibleClassName:V,LinkComponent:h="a",onBlur:D,onClick:E,onContextMenu:$,onDragLeave:Y,onFocus:F,onFocusVisible:c,onKeyDown:R,onKeyUp:b,onMouseDown:I,onMouseLeave:L,onMouseUp:U,onTouchEnd:x,onTouchMove:S,onTouchStart:B,tabIndex:C=0,TouchRippleProps:w,touchRippleRef:z,type:j,...A}=a,O=l.useRef(null),T=Xe(),pe=ae(T.ref,z),[v,H]=l.useState(!1);d&&v&&H(!1),l.useImperativeHandle(o,()=>({focusVisible:()=>{H(!0),O.current.focus()}}),[]);const de=T.shouldMount&&!f&&!d;l.useEffect(()=>{v&&g&&!f&&T.pulsate()},[f,g,v,T]);function P(r,oe,Se=M){return G(ie=>(oe&&oe(ie),Se||T[r](ie),!0))}const fe=P("start",I),he=P("stop",$),me=P("stop",Y),ge=P("stop",U),be=P("stop",r=>{v&&r.preventDefault(),L&&L(r)}),Me=P("start",B),Re=P("stop",x),xe=P("stop",S),ye=P("stop",r=>{le(r.target)||H(!1),D&&D(r)},!1),Ee=G(r=>{O.current||(O.current=r.currentTarget),le(r.target)&&(H(!0),c&&c(r)),F&&F(r)}),q=()=>{const r=O.current;return u&&u!=="button"&&!(r.tagName==="A"&&r.href)},Ce=G(r=>{g&&!r.repeat&&v&&r.key===" "&&T.stop(r,()=>{T.start(r)}),r.target===r.currentTarget&&q()&&r.key===" "&&r.preventDefault(),R&&R(r),r.target===r.currentTarget&&q()&&r.key==="Enter"&&!d&&(r.preventDefault(),E&&E(r))}),Te=G(r=>{g&&r.key===" "&&v&&!r.defaultPrevented&&T.stop(r,()=>{T.pulsate(r)}),b&&b(r),E&&r.target===r.currentTarget&&q()&&r.key===" "&&!r.defaultPrevented&&E(r)});let K=u;K==="button"&&(A.href||A.to)&&(K=h);const X={};K==="button"?(X.type=j===void 0?"button":j,X.disabled=d):(!A.href&&!A.to&&(X.role="button"),d&&(X["aria-disabled"]=d));const Pe=ae(t,O),ne={...a,centerRipple:i,component:u,disabled:d,disableRipple:f,disableTouchRipple:M,focusRipple:g,tabIndex:C,focusVisible:v},Ve=tt(ne);return N.jsxs(nt,{as:K,className:y(Ve.root,p),ownerState:ne,onBlur:ye,onClick:E,onContextMenu:he,onFocus:Ee,onKeyDown:Ce,onKeyUp:Te,onMouseDown:fe,onMouseLeave:be,onMouseUp:ge,onDragLeave:me,onTouchEnd:Re,onTouchMove:xe,onTouchStart:Me,ref:Pe,tabIndex:d?-1:C,type:j,...X,...A,children:[s,de?N.jsx(Je,{ref:pe,center:i,...w}):null]})});export{at as B};
