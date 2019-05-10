
var svg=new DOMParser().parseFromString(`<SVG onmousedown="if(evt.target==this)this.sel=undefined" viewBox="-2 -${2*(hh/ww||1)
} 4 ${4*(hh/ww||1)}" style="width:${ww||512}px; height:${hh||512}px; background-color:#eee; -webkit-user-select:none; -moz-user-select:none; -ms-user-select:none; user-select:none">
            // Add a grid (option)
            ${options.grid?[...Array(21)].map((x,xi)=>`<line x1="-10" y1="${((xi-10)/2-(tot<4?2*options.camera.e02:0))*options.scale}" x2="10" y2="${((xi-10)/2-(tot<4?2*options.camera.e02:0))*options.scale}" stroke-width="0.005" stroke="#CCC"/><line y1="-10" x1="${((xi-10)/2-(tot<4?2*options.camera.e01:0))*options.scale}" y2="10" x2="${((xi-10)/2-(tot<4?2*options.camera.e01:0))*options.scale}"  stroke-width="0.005" stroke="#CCC"/>`):''}
            // Handle conformal 2D elements.
            ${options.conformal?f.map&&f.map((o,oidx)=>{
            // Optional animation handling.
              if((o==Element.graph && or!==false)||(oidx==0&&options.animate&&or!==false)) { anim=true; requestAnimationFrame(()=>{var r=build(origf,(!res)||(document.body.contains(res))).innerHTML; if (res) res.innerHTML=r; }); if (!options.animate) return; }
            // Resolve expressions passed in.
              while (o.call) o=o();
            // Arrays are rendered as segments or polygons. (2 or more elements)
              if (o instanceof Array)  { lx=ly=lr=0; o=o.map(o=>{ while(o.call)o=o(); return o; }); o.forEach((o)=>{lx+=o.e1;ly+=-o.e2});lx/=o.length;ly/=o.length; return o.length>2?`<POLYGON STYLE="pointer-events:none; fill:${color};opacity:0.7" points="${o.map(o=>(o.e1+','+(-o.e2)+' '))}"/>`:`<LINE style="pointer-events:none" x1=${o[0].e1} y1=${-o[0].e2} x2=${o[1].e1} y2=${-o[1].e2} stroke-width="${options.lineWidth*0.005||0.005}" stroke="${color||'#888'}"/>`; }
            // Strings are rendered at the current cursor position.
              if (typeof o =='string') { var res2=(o[0]=='_')?'':`<text x="${lx}" y="${ly}" font-family="Verdana" font-size="${options.fontSize*0.1||0.1}" style="pointer-events:none" fill="${color||'#333'}" transform="rotate(${lr},${lx},${ly})">&nbsp;${o}&nbsp;</text>`; ly+=0.14; return res2; }
            // Numbers change the current color.
              if (typeof o =='number') { color='#'+(o+(1<<25)).toString(16).slice(-6); return ''; };
            // All other elements are rendered ..
              var b1=o.Grade(1).VLength>0.001,b2=o.Grade(2).VLength>0.001,b3=o.Grade(3).VLength>0.001;
            // Points
              if (b1 && !b2 && !b3) { lx=o.e1; ly=-o.e2; lr=0; return res2=`<CIRCLE onmousedown="this.parentElement.sel=${oidx}" cx="${lx}" cy="${ly}" r="${options.pointRadius*0.03||0.03}" fill="${color||'green'}"/>`; }
              else if (!b1 && !b2 && b3) { var isLine=Element.Coeff(4,1,3,-1).LDot(o).Length==0;
              // Lines.
                if (isLine) { var loc=((Element.Coeff(4,-.5).Add(Element.Coeff(3,-.5))).LDot(o)).Div(o), att=(Element.Coeff(4,1,3,-1)).LDot(o); lx=-loc.e1; ly=loc.e2; lr=Math.atan2(att[8],att[7])/Math.PI*180; return `<LINE style="pointer-events:none" x1=${lx-10} y1=${ly} x2=${lx+10} y2=${ly} stroke-width="${options.lineWidth*0.005||0.005}" stroke="${color||'#888'}" transform="rotate(${lr},${lx},${ly})"/>`;};
              // Circles.
                var loc=o.Div((Element.Coeff(4,1,3,-1)).LDot(o)); lx=-loc.e1; ly=loc.e2; var r=-o.Mul(o.Conjugate).s/(Element.Pow((Element.Coeff(4,1,3,-1)).LDot(o),2).s); r=r**0.5; return `<CIRCLE onmousedown="this.parentElement.sel=${oidx}" cx="${lx}" cy="${ly}" r="${r}" stroke-width="${options.lineWidth*0.005||0.005}" fill="none" stroke="${color||'green'}"/>`;
              } else if (!b1 && b2 &&!b3) {
              // Point Pairs.
                lr=0; var ei=Element.Coeff(4,1,3,-1),eo=Element.Coeff(4,.5,3,.5), nix=o.Wedge(ei), sqr=o.LDot(o).s/nix.LDot(nix).s, r=Math.sqrt(Math.abs(sqr)), attitude=((ei.Wedge(eo)).LDot(nix)).Normalized.Mul(Element.Scalar(r)), pos=o.Div(nix); pos=pos.Div( pos.LDot(Element.Sub(ei)));
                lx=pos.e1; ly=-pos.e2; if (sqr<0) return `<CIRCLE onmousedown="this.parentElement.sel=${oidx}" cx="${lx}" cy="${ly}" r="${options.pointRadius*0.03||0.03}" stroke-width="0.005" fill="none" stroke="${color||'green'}"/>`;
                lx=pos.e1+attitude.e1; ly=-pos.e2-attitude.e2; var res2=`<CIRCLE onmousedown="this.parentElement.sel=${oidx}" cx="${lx}" cy="${ly}" r="${options.pointRadius*0.03||0.03}" fill="${color||'green'}"/>`;
                lx=pos.e1-attitude.e1; ly=-pos.e2+attitude.e2; return res2+`<CIRCLE onmousedown="this.parentElement.sel=${oidx}" cx="${lx}" cy="${ly}" r="${options.pointRadius*0.03||0.03}" fill="${color||'green'}"/>`;
              }
            // Handle projective 2D and 3D elements.
            }):f.map&&f.map((o,oidx)=>{  if((o==Element.graph && or!==false)||(oidx==0&&options.animate&&or!==false)) { anim=true; requestAnimationFrame(()=>{var r=build(origf,(!res)||(document.body.contains(res))).innerHTML; if (res) res.innerHTML=r; }); if (!options.animate) return; } while (o instanceof Function) o=o(); o=(o instanceof Array)?o.map(project):project(o); if (o===undefined) return;
            // line segments and polygons
              if (o instanceof Array && o.length)  { lx=ly=lr=0; o.forEach((o)=>{while (o.call) o=o(); lx+=options.scale*((drm[1]==6||drm[1]==14)?-1:1)*o[drm[2]]/o[drm[1]];ly+=options.scale*o[drm[3]]/o[drm[1]]});lx/=o.length;ly/=o.length; return o.length>2?`<POLYGON STYLE="pointer-events:none; fill:${color};opacity:0.7" points="${o.map(o=>((drm[1]==6||drm[1]==14)?-1:1)*options.scale*o[drm[2]]/o[drm[1]]+','+options.scale*o[drm[3]]/o[drm[1]]+' ')}"/>`:`<LINE style="pointer-events:none" x1=${options.scale*((drm[1]==6||drm[1]==14)?-1:1)*o[0][drm[2]]/o[0][drm[1]]} y1=${options.scale*o[0][drm[3]]/o[0][drm[1]]} x2=${options.scale*((drm[1]==6||drm[1]==14)?-1:1)*o[1][drm[2]]/o[1][drm[1]]} y2=${options.scale*o[1][drm[3]]/o[1][drm[1]]} stroke-width="${options.lineWidth*0.005||0.005}" stroke="${color||'#888'}"/>`; }
            // svg
              if (typeof o =='string' && o[0]=='<') { return o; }
            // Labels
              if (typeof o =='string') { var res2=(o[0]=='_')?'':`<text x="${lx}" y="${ly}" font-family="Verdana" font-size="${options.fontSize*0.1||0.1}" style="pointer-events:none" fill="${color||'#333'}" transform="rotate(${lr},0,0)">&nbsp;${o}&nbsp;</text>`; ly+=0.14; return res2; }
            // Colors
              if (typeof o =='number') { color='#'+(o+(1<<25)).toString(16).slice(-6); return ''; };
            // Points
              if (o[to2d[6]]**2        >0.0001) { lx=options.scale*o[drm[2]]/o[drm[1]]; if (drm[1]==6||drm[1]==14) lx*=-1; ly=options.scale*o[drm[3]]/o[drm[1]]; lr=0;  var res2=`<CIRCLE onmousedown="this.parentElement.sel=${oidx}" cx="${lx}" cy="${ly}" r="${options.pointRadius*0.03||0.03}" fill="${color||'green'}"/>`; ly-=0.05; lx-=0.1; return res2; }
            // Lines
              if (o[to2d[2]]**2+o[to2d[3]]**2>0.0001) { var l=Math.sqrt(o[to2d[2]]**2+o[to2d[3]]**2); o[to2d[2]]/=l; o[to2d[3]]/=l; o[to2d[1]]/=l; lx=0.5; ly=options.scale*((drm[1]==6)?-1:-1)*o[to2d[1]]; lr=-Math.atan2(o[to2d[2]],o[to2d[3]])/Math.PI*180; var res2=`<LINE style="pointer-events:none" x1=-10 y1=${ly} x2=10 y2=${ly} stroke-width="${options.lineWidth*0.005||0.005}" stroke="${color||'#888'}" transform="rotate(${lr},0,0)"/>`; ly-=0.05; return res2; }
            // Vectors
              if (o[to2d[4]]**2+o[to2d[5]]**2>0.0001) { lr=0; ly+=0.05; lx+=0.1; var res2=`<LINE style="pointer-events:none" x1=${lx} y1=${ly} x2=${lx-o.e02} y2=${ly+o.e01} stroke-width="0.005" stroke="${color||'#888'}"/>`; ly=ly+o.e01/4*3-0.05; lx=lx-o.e02/4*3; return res2; }
            }).join()}`,'text/html').body; 
          // return the inside of the created svg element.  
            return svg.removeChild(svg.firstChild); 
          };
        // Create the initial svg and install the mousehandlers.  
          res=build(f); res.value=f; res.options=options;
          res.onmousemove=(e)=>{ if (res.sel===undefined || !e.buttons) return;var resx=res.getBoundingClientRect().width,resy=res.getBoundingClientRect().height,x=((e.clientX-res.getBoundingClientRect().left)/(resx/4||128)-2)*(resx>resy?resx/resy:1),y=((e.clientY-res.getBoundingClientRect().top)/(resy/4||128)-2)*(resy>resx?resy/resx:1);x/=options.scale;y/=options.scale; if (options.conformal) {f[res.sel][1]=x; f[res.sel][2]=-y; var l=x*x+y*y; f[res.sel][3]=0.5-l*0.5; f[res.sel][4]=0.5+l*0.5; } else {f[res.sel][drm[2]]=((drm[1]==6)?-x:x)-((tot<4)?2*options.camera.e01:0); f[res.sel][drm[3]]=y+((tot<4)?2*options.camera.e02:0); f[res.sel][drm[1]]=1;} if (!anim) res.innerHTML=build(f).innerHTML; res.dispatchEvent(new CustomEvent('input')) }; 
          return res;
        }  
      // 1d and 2d functions are rendered on a canvas.   
        cvs=cvs||document.createElement('canvas'); if(ww)cvs.width=ww; if(hh)cvs.height=hh; var w=cvs.width,h=cvs.height,context=cvs.getContext('2d'), data=context.getImageData(0,0,w,h);
      // two parameter functions .. evaluate for both and set resulting color.  
        if (f.length==2) for (var px=0; px<w; px++) for (var py=0; py<h; py++) { var res=f(px/w*2-1, py/h*2-1); res=res.buffer?[].slice.call(res):res.slice?res:[res,res,res]; data.data.set(res.map(x=>x*255).concat([255]),py*w*4+px*4); }
      // one parameter function.. go over x range, use result as y.   
        else if (f.length==1) for (var px=0; px<w; px++) { var res=f(px/w*2-1); res=Math.round((res/2+0.5)*h); if (res > 0 && res < h-1) data.data.set([0,0,0,255],res*w*4+px*4); }
        return context.putImageData(data,0,0),cvs;       
      }
