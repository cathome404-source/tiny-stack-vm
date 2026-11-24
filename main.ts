import{readFileSync,readdirSync,mkdirSync,writeFileSync}from"node:fs";
const I=process.env.MAKEFUN_INPUT_DIR||"/input",O=process.env.MAKEFUN_OUTPUT_DIR||"/output";
for(const d of readdirSync(I).sort()){
const P=readFileSync(I+"/"+d+"/program.bin"),N=readFileSync(I+"/"+d+"/input.bin");
let s:number[]=[],c:number[]=[],m=new Int32Array(256),o:number[]=[],p=0,t=0,i=0,x=-1;
while(x<0){
if(t>999999){x=10;break}
if(p<0||p>=P.length){x=9;break}
const k=P[p],L=k==1?1:k==2?4:k>47&&k<52?2:0;
if(!(k<8||k>15&&k<35||k>47&&k<53||k>63&&k<66||k>79&&k<84)){x=5;break}
if(p+1+L>P.length){x=9;break}
const q=p+1+L;let n=q;t++;
switch(k){
case 0:x=0;break;
case 1:case 2:
if(s.length>255){x=3;break}
s.push(k==1?(P[p+1]<<24)>>24:P[p+1]|P[p+2]<<8|P[p+3]<<16|P[p+4]<<24);break;
case 3:if(!s.length){x=2;break}s.pop();break;
case 4:
if(!s.length){x=2;break}
if(s.length>255){x=3;break}
s.push(s[s.length-1]);break;
case 5:
if(s.length<2){x=2;break}
{const a=s[s.length-1];s[s.length-1]=s[s.length-2];s[s.length-2]=a}break;
case 6:
if(s.length<2){x=2;break}
if(s.length>255){x=3;break}
s.push(s[s.length-2]);break;
case 7:
if(s.length<3){x=2;break}
{const a=s[s.length-3],b=s[s.length-2],e=s[s.length-1];s[s.length-3]=b;s[s.length-2]=e;s[s.length-1]=a}break;
case 16:case 17:case 18:case 19:case 20:case 21:case 22:case 24:case 25:case 26:case 28:case 29:case 30:case 32:case 33:case 34:
if(s.length<2){x=2;break}
{const b=s.pop()!,a=s.pop()!;let r=0;
if(k==16)r=a+b|0;else if(k==17)r=a-b|0;else if(k==18)r=Math.imul(a,b);
else if(k==19){if(!b){x=4;break}r=a/b|0}
else if(k==20){if(!b){x=4;break}r=a%b|0}
else if(k==21){if(!b){x=4;break}r=(a>>>0)/(b>>>0)|0}
else if(k==22){if(!b){x=4;break}r=(a>>>0)%(b>>>0)|0}
else if(k==24)r=a&b;else if(k==25)r=a|b;else if(k==26)r=a^b;
else if(k==28)r=a<<b;else if(k==29)r=a>>b;else if(k==30)r=a>>>b|0;
else if(k==32)r=a==b?1:0;else if(k==33)r=a<b?1:0;else r=(a>>>0)<(b>>>0)?1:0;
s.push(r)}break;
case 23:if(!s.length){x=2;break}s[s.length-1]=-s[s.length-1]|0;break;
case 27:if(!s.length){x=2;break}s[s.length-1]=~s[s.length-1];break;
case 48:n=q+((P[p+1]|P[p+2]<<8)<<16>>16);break;
case 49:case 50:
if(!s.length){x=2;break}
{const v=s.pop()!;if(k==49?v==0:v!=0)n=q+((P[p+1]|P[p+2]<<8)<<16>>16)}break;
case 51:if(c.length>63){x=7;break}c.push(q);n=P[p+1]|P[p+2]<<8;break;
case 52:if(!c.length){x=8;break}n=c.pop()!;break;
case 64:
if(!s.length){x=2;break}
{const a=s.pop()!;if(a<0||a>255){x=6;break}s.push(m[a])}break;
case 65:
if(s.length<2){x=2;break}
{const a=s.pop()!,v=s.pop()!;if(a<0||a>255){x=6;break}m[a]=v}break;
case 80:
if(!s.length){x=2;break}
{const v=s.pop()!,y=String(v);if(o.length+y.length>65536){x=11;break}for(let j=0;j<y.length;j++)o.push(y.charCodeAt(j))}break;
case 81:
if(!s.length){x=2;break}
if(o.length>65535){x=11;break}
o.push(s.pop()!&255);break;
case 82:
if(s.length>255){x=3;break}
s.push(i<N.length?N[i++]:-1);break;
case 83:if(!s.length){x=2;break}x=s.pop()!&255;break;
}
p=n;
}
mkdirSync(O+"/"+d,{recursive:true});
writeFileSync(O+"/"+d+"/stdout.bin",Buffer.from(o));
writeFileSync(O+"/"+d+"/exit.txt",x+"\n");
}
