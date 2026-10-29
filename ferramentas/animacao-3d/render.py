import numpy as np
from PIL import Image
from scipy import ndimage
def normais_vert(P,F):
    n=np.cross(P[F[:,1]]-P[F[:,0]],P[F[:,2]]-P[F[:,0]])
    vn=np.zeros_like(P)
    for k in range(3): np.add.at(vn,F[:,k],n)
    return vn/(np.linalg.norm(vn,axis=1,keepdims=True)+1e-12), n
def render(P,F,FU,tex,caixa,H=1000,ang=0.0):
    """Rasterização de verdade: cada triângulo vira pixels, com teste de profundidade por pixel."""
    c,s=np.cos(ang),np.sin(ang); R=np.array([[c,0,s],[0,1,0],[-s,0,c]]); P=P@R.T
    vn,fn=normais_vert(P,F)
    x0,x1,y0,y1=caixa; esc=H/(y1-y0); W=int(round((x1-x0)*esc)); th,tw,_=tex.shape
    S=np.c_[(P[:,0]-x0)*esc, H-(P[:,1]-y0)*esc, P[:,2]]          # coordenadas de tela
    vis=fn[:,2]>0; Fv=F[vis]; UVv=FU[vis]
    A,B,C=S[Fv[:,0]],S[Fv[:,1]],S[Fv[:,2]]
    det=(B[:,1]-C[:,1])*(A[:,0]-C[:,0])+(C[:,0]-B[:,0])*(A[:,1]-C[:,1])
    ok=np.abs(det)>1e-9; Fv,UVv,A,B,C,det=Fv[ok],UVv[ok],A[ok],B[ok],C[ok],det[ok]
    xmin=np.floor(np.minimum(np.minimum(A[:,0],B[:,0]),C[:,0])).astype(int); xmax=np.ceil(np.maximum(np.maximum(A[:,0],B[:,0]),C[:,0])).astype(int)
    ymin=np.floor(np.minimum(np.minimum(A[:,1],B[:,1]),C[:,1])).astype(int); ymax=np.ceil(np.maximum(np.maximum(A[:,1],B[:,1]),C[:,1])).astype(int)
    tam=np.maximum(xmax-xmin,ymax-ymin)+1
    PX=[];PY=[];PZ=[];TI=[];L1=[];L2=[]
    for lo,hi in [(0,3),(3,6),(6,12),(12,30),(30,10**6)]:
        g=np.where((tam>lo)&(tam<=hi))[0]
        if not len(g): continue
        n=min(hi,int(tam[g].max()))
        ox,oy=np.meshgrid(np.arange(n),np.arange(n)); ox=ox.ravel(); oy=oy.ravel()
        for parte in np.array_split(g,max(1,len(g)*n*n//4_000_000+1)):
            px=xmin[parte,None]+ox[None]; py=ymin[parte,None]+oy[None]
            cx=px+0.5; cy=py+0.5
            a,b,cc,d=A[parte],B[parte],C[parte],det[parte]
            l1=((b[:,1,None]-cc[:,1,None])*(cx-cc[:,0,None])+(cc[:,0,None]-b[:,0,None])*(cy-cc[:,1,None]))/d[:,None]
            l2=((cc[:,1,None]-a[:,1,None])*(cx-cc[:,0,None])+(a[:,0,None]-cc[:,0,None])*(cy-cc[:,1,None]))/d[:,None]
            l3=1-l1-l2; e=-1e-4
            dentro=(l1>=e)&(l2>=e)&(l3>=e)&(px>=0)&(px<W)&(py>=0)&(py<H)&(px<=xmax[parte,None])&(py<=ymax[parte,None])
            ti=np.broadcast_to(parte[:,None],px.shape)
            z=l1*a[:,2,None]+l2*b[:,2,None]+l3*cc[:,2,None]
            PX.append(px[dentro]);PY.append(py[dentro]);PZ.append(z[dentro]);TI.append(ti[dentro]);L1.append(l1[dentro]);L2.append(l2[dentro])
    px=np.concatenate(PX);py=np.concatenate(PY);pz=np.concatenate(PZ);ti=np.concatenate(TI);l1=np.concatenate(L1);l2=np.concatenate(L2)
    pix=py*W+px
    o=np.lexsort((-pz,pix)); pix,ti,l1,l2=pix[o],ti[o],l1[o],l2[o]
    pri=np.r_[True,pix[1:]!=pix[:-1]]                                # o mais próximo de cada pixel
    pix,ti,l1,l2=pix[pri],ti[pri],l1[pri],l2[pri]; l3=1-l1-l2
    uv=UVv[ti,0]*l1[:,None]+UVv[ti,1]*l2[:,None]+UVv[ti,2]*l3[:,None]
    f=Fv[ti]; n=vn[f[:,0]]*l1[:,None]+vn[f[:,1]]*l2[:,None]+vn[f[:,2]]*l3[:,None]; n/=np.linalg.norm(n,axis=1,keepdims=True)+1e-12
    tx=np.clip((uv[:,0]%1)*tw,0,tw-1).astype(int); ty=np.clip((1-uv[:,1]%1)*th,0,th-1).astype(int)
    luz=np.clip(0.72+0.28*(n@np.array([-0.35,0.45,0.82])),0.55,1.08)
    img=np.zeros((H*W,3)); a=np.zeros(H*W,bool)
    img[pix]=np.clip(tex[ty,tx]*luz[:,None],0,255); a[pix]=True
    img=img.reshape(H,W,3); a=a.reshape(H,W)
    rgba=np.dstack([img,a*255]).astype(np.uint8)
    return Image.fromarray(rgba,'RGBA')
