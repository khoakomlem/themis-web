
uses crt;

const
   tfi               =  'CHESS.INP';
   tfo               =  'CHESS.OUT';
   maxN              =  10000;

var
   fi, fo            :  text;
   N                 :  integer;
   dd,x,a,b,csA,csB  :  array[1..maxN] of integer;
   DiemMax           :  integer;

procedure Docdl;
var i: integer;
begin
   assign(fi,tfi); reset(fi);
   readln(fi,N);
   for i:=1 to N do read(fi,a[i],b[i]);
   close(fi);
end;

procedure Doi(var u,v: integer);
var w: integer;
begin
   w:=u;
   u:=v;
   v:=w;
end;

procedure SortA(k,l: integer);
var i,j,mid: integer;
begin
   mid:=a[(k+l) div 2];
   i:=k; j:=l;
   repeat
      while a[i]<mid do inc(i);
      while a[j]>mid do dec(j);
      if i<=j then
         begin
            Doi(a[i],a[j]);
            Doi(csA[i],csA[j]);
            inc(i);
            dec(j);
         end;
   until i>j;
   if j>k then SortA(k,j);
   if i<l then SortA(i,l);
end;

procedure SapxepA;
var i: integer;
begin
   for i:=1 to N do csA[i]:=i;
   SortA(1,N);
end;

procedure SortB(k,l: integer);
var i,j,mid: integer;
begin
   mid:=b[(k+l) div 2];
   i:=k;
   j:=l;
   repeat
      while b[i]>mid do inc(i);
      while b[j]<mid do dec(j);
      if i<=j then
         begin
            Doi(b[i],b[j]);
            Doi(csB[i],csB[j]);
            inc(i);
            dec(j);
         end;
   until i>j;
   if j>k then SortB(k,j);
   if i<l then SortB(i,l);
end;

procedure SapXepB;
var i: integer;
begin
   for i:=1 to N do csB[i]:=i;
   SortB(1,n);
end;

function TimA(r: integer): integer;
var i: integer;
begin
   for i:=n downto 1 do
      if (dd[csA[i]]=0) and (a[i]<r) then
         begin
            TimA:=i;
            exit;
         end;
   for i:=n downto 1 do
      if (dd[csA[i]]=0) and (a[i]=r) then
          begin
             TimA:=i;
             exit;
          end;
   TimA:=0;
end;

procedure Ghep;
var j,limit,i,k: integer;
begin
   fillchar(dd,sizeof(dd),0);
   fillchar(x,sizeof(x),0);
   i:=1;
   DiemMax:=0;
   limit:=n;
   repeat
      k:=TimA(b[i]);
      if k>0 then
         begin
            x[csA[k]]:=csB[i];
            dd[csA[k]]:=1;
            if b[i]>a[k] then inc(DiemMax,2) else inc(DiemMax,1);
            limit:=k-1;
            inc(i);
         end;
   until k=0;
   for j:=i to N do
      begin
         repeat inc(k) until dd[k]=0;
         x[k]:=csB[j];
      end;
end;

procedure inkq;
var i: integer;
begin
   assign(fo,tfo); rewrite(fo);
   writeln(fo,diemMax);
   for i:=1 to N do writeln(fo,x[i]);
   close(fo);
end;

BEGIN
   Docdl;
   SapXepA;
   SapXepB;
   Ghep;
   Inkq;
END.
