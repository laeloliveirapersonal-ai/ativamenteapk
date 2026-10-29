import os, sys
PASTA=os.path.dirname(os.path.abspath(__file__))
import sys, io, numpy as np
sys.path.insert(0,PASTA); from fbxread import *
from PIL import Image
TICK=46186158000
def euler(r):
    x,y,z=np.radians(r)
    Rx=np.array([[1,0,0],[0,np.cos(x),-np.sin(x)],[0,np.sin(x),np.cos(x)]])
    Ry=np.array([[np.cos(y),0,np.sin(y)],[0,1,0],[-np.sin(y),0,np.cos(y)]])
    Rz=np.array([[np.cos(z),-np.sin(z),0],[np.sin(z),np.cos(z),0],[0,0,1]])
    M=np.eye(4); M[:3,:3]=Rz@Ry@Rx; return M
def trans(t): M=np.eye(4); M[:3,3]=t; return M
def escala(s): return np.diag([s[0],s[1],s[2],1.0])
class Cena:
    def __init__(s,path):
        top=ler(path); obj=[n for n in top if n[0]=='Objects'][0]; con=[n for n in top if n[0]=='Connections'][0]
        s.byid={k[1][0]:k for k in obj[2]}
        s.parent={}; s.oprop=[]
        for c in con[2]:
            t,a,b=c[1][0],c[1][1],c[1][2]
            if t==b'OO': s.parent.setdefault(a,[]).append(b)
            else: s.oprop.append((a,b,c[1][3].decode()))
        s.models={i:k for i,k in s.byid.items() if k[0]=='Model'}
        s.mpar={i:next((p for p in s.parent.get(i,[]) if p in s.models),None) for i in s.models}
        s.P={i:props70(k) for i,k in s.models.items()}
        # curvas
        s.curvas={}   # (model, 'Lcl Translation') -> {X:(times,vals)}
        cn={i:k for i,k in s.byid.items() if k[0]=='AnimationCurveNode'}
        alvo={}
        for a,b,p in s.oprop:
            if a in cn and b in s.models: alvo[a]=(b,p)
        for a,b,p in s.oprop:
            if b in alvo and s.byid.get(a,[None])[0]=='AnimationCurve':
                k=s.byid[a]; t=um(k,'KeyTime')[1][0]/TICK; v=um(k,'KeyValueFloat')[1][0].astype(float)
                s.curvas.setdefault(alvo[b],{})[p.split('|')[-1]]=(t,v)
        st=[k for k in s.byid.values() if k[0]=='AnimationStack'][0]
        s.dur=props70(st).get('LocalStop',[0])[0]/TICK
        # malha
        g=[k for k in s.byid.values() if k[0]=='Geometry'][0]; s.gid=g[1][0]
        s.V=um(g,'Vertices')[1][0].reshape(-1,3).astype(float); PV=um(g,'PolygonVertexIndex')[1][0]
        uvl=um(g,'LayerElementUV'); UV=um(uvl,'UV')[1][0].reshape(-1,2); ui=um(uvl,'UVIndex'); ui=ui[1][0] if ui else np.arange(len(PV))
        tris=[];tuv=[]; poly=[];pu=[]
        for i,p in enumerate(PV):
            last=p<0; poly.append(~p if last else p); pu.append(ui[i])
            if last:
                for k in range(1,len(poly)-1): tris.append((poly[0],poly[k],poly[k+1])); tuv.append((pu[0],pu[k],pu[k+1]))
                poly=[];pu=[]
        s.F=np.array(tris); s.FU=UV[np.array(tuv)]   # (n,3,2)
        # textura embutida
        vid=[k for k in s.byid.values() if k[0]=='Video' and um(k,'Content')]
        s.tex=np.asarray(Image.open(io.BytesIO(um(vid[0],'Content')[1][0])).convert('RGB')) if vid else None
        # pele: clusters
        nv=len(s.V); s.clusters=[]
        for i,k in s.byid.items():
            if k[0]=='Deformer' and k[1][2]==b'Cluster' and um(k,'Indexes'):
                bone=next(c for c,ps in s.parent.items() if i in ps and c in s.models)
                T=um(k,'Transform')[1][0].reshape(4,4).T; TL=um(k,'TransformLink')[1][0].reshape(4,4).T
                B=T if np.allclose(T@TL,np.eye(4),atol=1e-3) else np.linalg.inv(TL)@T   # alguns exportadores já gravam a inversa
                s.clusters.append((bone,um(k,'Indexes')[1][0],um(k,'Weights')[1][0].astype(float),B))
    def valor(s,mid,prop,eixo,t,padrao):
        c=s.curvas.get((mid,prop),{}).get(eixo)
        if c is None: return padrao
        return float(np.interp(t,c[0],c[1]))
    def local(s,mid,t):
        p=s.P[mid]; lt=p.get('Lcl Translation',[0,0,0]); lr=p.get('Lcl Rotation',[0,0,0]); ls=p.get('Lcl Scaling',[1,1,1])
        T=[s.valor(mid,'Lcl Translation',a,t,lt[i]) for i,a in enumerate('XYZ')]
        R=[s.valor(mid,'Lcl Rotation',a,t,lr[i]) for i,a in enumerate('XYZ')]
        S=[s.valor(mid,'Lcl Scaling',a,t,ls[i]) for i,a in enumerate('XYZ')]
        return trans(T)@euler(p.get('PreRotation',[0,0,0]))@euler(R)@escala(S)
    def glob(s,mid,t,cache):
        if mid in cache: return cache[mid]
        L=s.local(mid,t); par=s.mpar[mid]
        G=(s.glob(par,t,cache) if par is not None else np.eye(4))@L; cache[mid]=G; return G
    def pose(s,t):
        cache={}; Vh=np.c_[s.V,np.ones(len(s.V))]; out=np.zeros((len(s.V),3)); wsum=np.zeros(len(s.V))
        for bone,idx,w,B in s.clusters:
            M=s.glob(bone,t,cache)@B
            out[idx]+=w[:,None]*(Vh[idx]@M.T)[:,:3]; wsum[idx]+=w
        sem=wsum<1e-6; out[sem]=s.V[sem]; out[~sem]/=wsum[~sem,None]
        return out
