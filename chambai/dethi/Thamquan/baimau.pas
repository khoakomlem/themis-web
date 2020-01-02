{$N+}
const
   tfi='THAMQUAN.INP';
   tfo='THAMQUAN.OUT';
   maxN=30000;

type
   mang=array[1..maxN] of integer;

var
   fi, fo: text;
   N,M: integer;
   a : array[1..maxN] of integer;
   b : ^mang;
   name1,name2: ^mang;

   Tong: extended;
   x: array[1..maxN] of integer absolute a;

procedure CapPhat;
begin
   New(b);
   new(name1);
   new(name2);
end;

procedure Docdl;
var i: integer;
begin
   assign(fi,tfi); reset(fi);
   read(fi,N,M);
   for i:=1 to N do read(fi,a[i]);
   for i:=1 to M do read(fi,b^[i]);
   close(fi);
   for i:=1 to N do name1^[i]:=i;
   for i:=1 to M do name2^[i]:=i;
end;

procedure DoiCho(var u,v: integer);
var tg: integer;
begin
   tg:=u;
   u:=v;
   v:=tg;
end;

procedure SortA(k,l: integer);
var r: integer;
    i,j: integer;
begin
   r:=a[k];
   i:=k;
   j:=l;
   repeat
      while a[i]<r do inc(i);
      while a[j]>r do dec(j);
      if i<=j then
         begin
            DoiCho(a[i],a[j]);
            DoiCho(name1^[i],name1^[j]);
            inc(i); dec(j);
         end;
   until i>j;
   if k<j then SortA(k,j);
   if i<l then SortA(i,l);
end;

procedure SortB(k,l: integer);
var r: integer;
    i,j: integer;
begin
   r:=b^[k];
   i:=k;
   j:=l;
   repeat
      while b^[i]<r do inc(i);
      while b^[j]>r do dec(j);
      if i<=j then
         begin
            DoiCho(b^[i],b^[j]);
            DoiCho(name2^[i],name2^[j]);
            inc(i); dec(j);
         end;
   until i>j;
   if k<j then SortB(k,j);
   if i<l then SortB(i,l);
end;

procedure Tinh;
var i: integer;
    T: extended;
begin
   SortA(1,N);
   SortB(1,M);
   Tong:=0;
   for i:=1 to N do
      begin
         T:=a[i];
         Tong:=Tong+T*b^[N-i+1];
      end;
   for i:=1 to N do
      x[name1^[i]]:=name2^[n-i+1];
end;

procedure Inkq;
var i: integer;
begin
   assign(fo,tfo); rewrite(fo);
   writeln(fo,Tong:0:0);
   for i:=1 to N do writeln(fo,x[i]);
   close(fo);
end;

BEGIN
   CapPhat;
   Docdl;
   Tinh;
   Inkq;
END.