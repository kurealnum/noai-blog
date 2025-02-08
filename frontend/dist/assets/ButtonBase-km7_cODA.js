var we=Object.defineProperty;var Se=(n,e,t)=>e in n?we(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var se=(n,e,t)=>Se(n,typeof e!="symbol"?e+"":e,t);import{r as l,av as De,aw as Le,ax as je,ay as H,az as re,R as E,j as N,w as ue,aA as Q,E as Z,G as ce,x as ve,z as ae,O as G,B as ke}from"./index-DvV6ITee.js";import{b as Ne,a as $e,i as le}from"./Grow-CZ3mOuu8.js";function Fe(n){if(n===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return n}function ee(n,e){var t=function(i){return e&&l.isValidElement(i)?e(i):i},a=Object.create(null);return n&&l.Children.map(n,function(o){return o}).forEach(function(o){a[o.key]=t(o)}),a}function Ie(n,e){n=n||{},e=e||{};function t(f){return f in e?e[f]:n[f]}var a=Object.create(null),o=[];for(var i in n)i in e?o.length&&(a[i]=o,o=[]):o.push(i);var s,p={};for(var u in e){if(a[u])for(s=0;s<a[u].length;s++){var d=a[u][s];p[a[u][s]]=t(d)}p[u]=t(u)}for(s=0;s<o.length;s++)p[o[s]]=t(o[s]);return p}function k(n,e,t){return t[e]!=null?t[e]:n.props[e]}function ze(n,e){return ee(n.children,function(t){return l.cloneElement(t,{onExited:e.bind(null,t),in:!0,appear:k(t,"appear",n),enter:k(t,"enter",n),exit:k(t,"exit",n)})})}function Ue(n,e,t){var a=ee(n.children),o=Ie(e,a);return Object.keys(o).forEach(function(i){var s=o[i];if(l.isValidElement(s)){var p=i in e,u=i in a,d=e[i],f=l.isValidElement(d)&&!d.props.in;u&&(!p||f)?o[i]=l.cloneElement(s,{onExited:t.bind(null,s),in:!0,exit:k(s,"exit",n),enter:k(s,"enter",n)}):!u&&p&&!f?o[i]=l.cloneElement(s,{in:!1}):u&&p&&l.isValidElement(d)&&(o[i]=l.cloneElement(s,{onExited:t.bind(null,s),in:d.props.in,exit:k(s,"exit",n),enter:k(s,"enter",n)}))}}),o}var Oe=Object.values||function(n){return Object.keys(n).map(function(e){return n[e]})},Ae={component:"div",childFactory:function(e){return e}},te=function(n){De(e,n);function e(a,o){var i;i=n.call(this,a,o)||this;var s=i.handleExited.bind(Fe(i));return i.state={contextValue:{isMounting:!0},handleExited:s,firstRender:!0},i}var t=e.prototype;return t.componentDidMount=function(){this.mounted=!0,this.setState({contextValue:{isMounting:!1}})},t.componentWillUnmount=function(){this.mounted=!1},e.getDerivedStateFromProps=function(o,i){var s=i.children,p=i.handleExited,u=i.firstRender;return{children:u?ze(o,p):Ue(o,s,p),firstRender:!1}},t.handleExited=function(o,i){var s=ee(this.props.children);o.key in s||(o.props.onExited&&o.props.onExited(i),this.mounted&&this.setState(function(p){var u=Le({},p.children);return delete u[o.key],{children:u}}))},t.render=function(){var o=this.props,i=o.component,s=o.childFactory,p=je(o,["component","childFactory"]),u=this.state.contextValue,d=Oe(this.state.children).map(s);return delete p.appear,delete p.enter,delete p.exit,i===null?H.createElement(re.Provider,{value:u},d):H.createElement(re.Provider,{value:u},H.createElement(i,p,d))},e}(H.Component);te.propTypes={};te.defaultProps=Ae;class _{constructor(){se(this,"mountEffect",()=>{this.shouldMount&&!this.didMount&&this.ref.current!==null&&(this.didMount=!0,this.mounted.resolve())});this.ref={current:null},this.mounted=null,this.didMount=!1,this.shouldMount=!1,this.setShouldMount=null}static create(){return new _}static use(){const e=Ne(_.create).current,[t,a]=l.useState(!1);return e.shouldMount=t,e.setShouldMount=a,l.useEffect(e.mountEffect,[t]),e}mount(){return this.mounted||(this.mounted=Ye(),this.shouldMount=!0,this.setShouldMount(this.shouldMount)),this.mounted}start(...e){this.mount().then(()=>{var t;return(t=this.ref.current)==null?void 0:t.start(...e)})}stop(...e){this.mount().then(()=>{var t;return(t=this.ref.current)==null?void 0:t.stop(...e)})}pulsate(...e){this.mount().then(()=>{var t;return(t=this.ref.current)==null?void 0:t.pulsate(...e)})}}function Xe(){return _.use()}function Ye(){let n,e;const t=new Promise((a,o)=>{n=a,e=o});return t.resolve=n,t.reject=e,t}function Ke(n){const{className:e,classes:t,pulsate:a=!1,rippleX:o,rippleY:i,rippleSize:s,in:p,onExited:u,timeout:d}=n,[f,M]=l.useState(!1),g=E(e,t.ripple,t.rippleVisible,a&&t.ripplePulsate),V={width:s,height:s,top:-(s/2)+i,left:-(s/2)+o},h=E(t.child,f&&t.childLeaving,a&&t.childPulsate);return!p&&!f&&M(!0),l.useEffect(()=>{if(!p&&u!=null){const D=setTimeout(u,d);return()=>{clearTimeout(D)}}},[u,p,d]),N.jsx("span",{className:g,style:V,children:N.jsx("span",{className:h})})}const m=ue("MuiTouchRipple",["root","ripple","rippleVisible","ripplePulsate","child","childLeaving","childPulsate"]),J=550,We=80,He=Q`
  0% {
    transform: scale(0);
    opacity: 0.1;
  }

  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`,Ge=Q`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`,_e=Q`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.92);
  }

  100% {
    transform: scale(1);
  }
`,qe=Z("span",{name:"MuiTouchRipple",slot:"Root"})({overflow:"hidden",pointerEvents:"none",position:"absolute",zIndex:0,top:0,right:0,bottom:0,left:0,borderRadius:"inherit"}),Je=Z(Ke,{name:"MuiTouchRipple",slot:"Ripple"})`
  opacity: 0;
  position: absolute;

  &.${m.rippleVisible} {
    opacity: 0.3;
    transform: scale(1);
    animation-name: ${He};
    animation-duration: ${J}ms;
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
    animation-duration: ${J}ms;
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
`,Qe=l.forwardRef(function(e,t){const a=ce({props:e,name:"MuiTouchRipple"}),{center:o=!1,classes:i={},className:s,...p}=a,[u,d]=l.useState([]),f=l.useRef(0),M=l.useRef(null);l.useEffect(()=>{M.current&&(M.current(),M.current=null)},[u]);const g=l.useRef(!1),V=$e(),h=l.useRef(null),D=l.useRef(null),y=l.useCallback(c=>{const{pulsate:R,rippleX:b,rippleY:I,rippleSize:L,cb:z}=c;d(x=>[...x,N.jsx(Je,{classes:{ripple:E(i.ripple,m.ripple),rippleVisible:E(i.rippleVisible,m.rippleVisible),ripplePulsate:E(i.ripplePulsate,m.ripplePulsate),child:E(i.child,m.child),childLeaving:E(i.childLeaving,m.childLeaving),childPulsate:E(i.childPulsate,m.childPulsate)},timeout:J,pulsate:R,rippleX:b,rippleY:I,rippleSize:L},f.current)]),f.current+=1,M.current=z},[i]),$=l.useCallback((c={},R={},b=()=>{})=>{const{pulsate:I=!1,center:L=o||R.pulsate,fakeElement:z=!1}=R;if((c==null?void 0:c.type)==="mousedown"&&g.current){g.current=!1;return}(c==null?void 0:c.type)==="touchstart"&&(g.current=!0);const x=z?null:D.current,B=x?x.getBoundingClientRect():{width:0,height:0,left:0,top:0};let w,C,S;if(L||c===void 0||c.clientX===0&&c.clientY===0||!c.clientX&&!c.touches)w=Math.round(B.width/2),C=Math.round(B.height/2);else{const{clientX:U,clientY:j}=c.touches&&c.touches.length>0?c.touches[0]:c;w=Math.round(U-B.left),C=Math.round(j-B.top)}if(L)S=Math.sqrt((2*B.width**2+B.height**2)/3),S%2===0&&(S+=1);else{const U=Math.max(Math.abs((x?x.clientWidth:0)-w),w)*2+2,j=Math.max(Math.abs((x?x.clientHeight:0)-C),C)*2+2;S=Math.sqrt(U**2+j**2)}c!=null&&c.touches?h.current===null&&(h.current=()=>{y({pulsate:I,rippleX:w,rippleY:C,rippleSize:S,cb:b})},V.start(We,()=>{h.current&&(h.current(),h.current=null)})):y({pulsate:I,rippleX:w,rippleY:C,rippleSize:S,cb:b})},[o,y,V]),Y=l.useCallback(()=>{$({},{pulsate:!0})},[$]),F=l.useCallback((c,R)=>{if(V.clear(),(c==null?void 0:c.type)==="touchend"&&h.current){h.current(),h.current=null,V.start(0,()=>{F(c,R)});return}h.current=null,d(b=>b.length>0?b.slice(1):b),M.current=R},[V]);return l.useImperativeHandle(t,()=>({pulsate:Y,start:$,stop:F}),[Y,$,F]),N.jsx(qe,{className:E(m.root,i.root,s),ref:D,...p,children:N.jsx(te,{component:null,exit:!0,children:u})})});function Ze(n){return ve("MuiButtonBase",n)}const et=ue("MuiButtonBase",["root","disabled","focusVisible"]),tt=n=>{const{disabled:e,focusVisible:t,focusVisibleClassName:a,classes:o}=n,s=ke({root:["root",e&&"disabled",t&&"focusVisible"]},Ze,o);return t&&a&&(s.root+=` ${a}`),s},nt=Z("button",{name:"MuiButtonBase",slot:"Root",overridesResolver:(n,e)=>e.root})({display:"inline-flex",alignItems:"center",justifyContent:"center",position:"relative",boxSizing:"border-box",WebkitTapHighlightColor:"transparent",backgroundColor:"transparent",outline:0,border:0,margin:0,borderRadius:0,padding:0,cursor:"pointer",userSelect:"none",verticalAlign:"middle",MozAppearance:"none",WebkitAppearance:"none",textDecoration:"none",color:"inherit","&::-moz-focus-inner":{borderStyle:"none"},[`&.${et.disabled}`]:{pointerEvents:"none",cursor:"default"},"@media print":{colorAdjust:"exact"}}),at=l.forwardRef(function(e,t){const a=ce({props:e,name:"MuiButtonBase"}),{action:o,centerRipple:i=!1,children:s,className:p,component:u="button",disabled:d=!1,disableRipple:f=!1,disableTouchRipple:M=!1,focusRipple:g=!1,focusVisibleClassName:V,LinkComponent:h="a",onBlur:D,onClick:y,onContextMenu:$,onDragLeave:Y,onFocus:F,onFocusVisible:c,onKeyDown:R,onKeyUp:b,onMouseDown:I,onMouseLeave:L,onMouseUp:z,onTouchEnd:x,onTouchMove:B,onTouchStart:w,tabIndex:C=0,TouchRippleProps:S,touchRippleRef:U,type:j,...O}=a,A=l.useRef(null),T=Xe(),pe=ae(T.ref,U),[v,K]=l.useState(!1);d&&v&&K(!1),l.useImperativeHandle(o,()=>({focusVisible:()=>{K(!0),A.current.focus()}}),[]);const de=T.shouldMount&&!f&&!d;l.useEffect(()=>{v&&g&&!f&&T.pulsate()},[f,g,v,T]);function P(r,oe,Be=M){return G(ie=>(oe&&oe(ie),Be||T[r](ie),!0))}const fe=P("start",I),he=P("stop",$),me=P("stop",Y),ge=P("stop",z),be=P("stop",r=>{v&&r.preventDefault(),L&&L(r)}),Me=P("start",w),Re=P("stop",x),xe=P("stop",B),Ee=P("stop",r=>{le(r.target)||K(!1),D&&D(r)},!1),ye=G(r=>{A.current||(A.current=r.currentTarget),le(r.target)&&(K(!0),c&&c(r)),F&&F(r)}),q=()=>{const r=A.current;return u&&u!=="button"&&!(r.tagName==="A"&&r.href)},Ce=G(r=>{g&&!r.repeat&&v&&r.key===" "&&T.stop(r,()=>{T.start(r)}),r.target===r.currentTarget&&q()&&r.key===" "&&r.preventDefault(),R&&R(r),r.target===r.currentTarget&&q()&&r.key==="Enter"&&!d&&(r.preventDefault(),y&&y(r))}),Te=G(r=>{g&&r.key===" "&&v&&!r.defaultPrevented&&T.stop(r,()=>{T.pulsate(r)}),b&&b(r),y&&r.target===r.currentTarget&&q()&&r.key===" "&&!r.defaultPrevented&&y(r)});let W=u;W==="button"&&(O.href||O.to)&&(W=h);const X={};W==="button"?(X.type=j===void 0?"button":j,X.disabled=d):(!O.href&&!O.to&&(X.role="button"),d&&(X["aria-disabled"]=d));const Pe=ae(t,A),ne={...a,centerRipple:i,component:u,disabled:d,disableRipple:f,disableTouchRipple:M,focusRipple:g,tabIndex:C,focusVisible:v},Ve=tt(ne);return N.jsxs(nt,{as:W,className:E(Ve.root,p),ownerState:ne,onBlur:Ee,onClick:y,onContextMenu:he,onFocus:ye,onKeyDown:Ce,onKeyUp:Te,onMouseDown:fe,onMouseLeave:be,onMouseUp:ge,onDragLeave:me,onTouchEnd:Re,onTouchMove:xe,onTouchStart:Me,ref:Pe,tabIndex:d?-1:C,type:j,...X,...O,children:[s,de?N.jsx(Qe,{ref:pe,center:i,...S}):null]})});export{at as B};
