import os, sys
PASTA=os.path.dirname(os.path.abspath(__file__))
import sys, numpy as np
sys.path.insert(0,PASTA); from anim import *
def rot(eixo,graus):
    a=np.radians(graus); x,y,z=np.array(eixo,float)/np.linalg.norm(eixo); c,s=np.cos(a),np.sin(a); C=1-c
    M=np.eye(4); M[:3,:3]=[[c+x*x*C,x*y*C-z*s,x*z*C+y*s],[y*x*C+z*s,c+y*y*C,y*z*C-x*s],[z*x*C-y*s,z*y*C+x*s,c+z*z*C]]; return M
X,Y,Z=(1,0,0),(0,1,0),(0,0,1)
class Boneco:
    """Usa o personagem do Mixamo, em pé (1º quadro do Air Squat), e dobra as articulações por programação."""
    def __init__(s,arq=os.path.join(PASTA,'modelos','Air_Squat.fbx')):
        s.c=Cena(arq); s.nome={m:s.c.models[m][1][1].decode('latin1').split('\x00')[0].replace('mixamorig:','') for m in s.c.models}
        s.id={v:k for k,v in s.nome.items()}
        s.base={m:s.c.local(m,0.0) for m in s.c.models}
    def pose(s,giros,quadril=(0,0,0),giro_corpo=None):
        """giros: {'LeftArm':[(eixo,graus),...]} — rotações em eixos do mundo, aplicadas na articulação."""
        G={}
        def glob(m):
            if m in G: return G[m]
            par=s.c.mpar[m]; Gp=glob(par) if par is not None else np.eye(4)
            L=s.base[m].copy()
            if s.nome[m]=='Hips': L[:3,3]+=quadril
            g=Gp@L
            if s.nome[m]=='Hips' and giro_corpo is not None:
                p=g[:3,3].copy(); g=trans(p)@giro_corpo@trans(-p)@g
            for eixo,graus in giros.get(s.nome[m],[]):
                p=g[:3,3].copy(); g=trans(p)@rot(eixo,graus)@trans(-p)@g
            G[m]=g; return g
        Vh=np.c_[s.c.V,np.ones(len(s.c.V))]; out=np.zeros((len(s.c.V),3)); ws=np.zeros(len(s.c.V))
        for bone,idx,w,B in s.c.clusters:
            M=glob(bone)@B; out[idx]+=w[:,None]*(Vh[idx]@M.T)[:,:3]; ws[idx]+=w
        sem=ws<1e-6; out[sem]=s.c.V[sem]; out[~sem]/=ws[~sem,None]
        return out
