import struct, zlib, numpy as np
def ler(path):
    d=open(path,'rb').read(); ver=struct.unpack('<I',d[23:27])[0]; W64=ver>=7500
    def prop(o):
        t=chr(d[o]); o+=1
        if t=='Y': return struct.unpack('<h',d[o:o+2])[0],o+2
        if t=='C': return d[o],o+1
        if t=='I': return struct.unpack('<i',d[o:o+4])[0],o+4
        if t=='F': return struct.unpack('<f',d[o:o+4])[0],o+4
        if t=='D': return struct.unpack('<d',d[o:o+8])[0],o+8
        if t=='L': return struct.unpack('<q',d[o:o+8])[0],o+8
        if t in 'SR':
            n=struct.unpack('<I',d[o:o+4])[0]; return d[o+4:o+4+n],o+4+n
        n,enc,cl=struct.unpack('<III',d[o:o+12]); raw=d[o+12:o+12+cl]
        if enc: raw=zlib.decompress(raw)
        return np.frombuffer(raw,{'f':'<f4','d':'<f8','l':'<i8','i':'<i4','b':'?'}[t]),o+12+cl
    def node(o):
        if W64: end,np_,pl=struct.unpack('<QQQ',d[o:o+24]); o+=24
        else: end,np_,pl=struct.unpack('<III',d[o:o+12]); o+=12
        nl=d[o]; name=d[o+1:o+1+nl].decode(); o+=1+nl
        if end==0: return None,o
        props=[]
        for _ in range(np_): v,o=prop(o); props.append(v)
        kids=[]
        while o<end:
            k,o=node(o)
            if k is None: break
            kids.append(k)
        return [name,props,kids],end
    o=27; top=[]
    while o<len(d)-200:
        n,o2=node(o)
        if n is None: break
        top.append(n); o=o2
    return top
def filhos(n,nome): return [k for k in n[2] if k[0]==nome]
def um(n,nome):
    r=filhos(n,nome); return r[0] if r else None
def props70(n):
    p={}; P=um(n,'Properties70')
    if P:
        for k in P[2]:
            if k[0]=='P':
                nm=k[1][0].decode('latin1'); p[nm]=k[1][4:]
    return p
