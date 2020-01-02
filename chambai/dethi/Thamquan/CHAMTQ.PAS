{$A+,B-,D+,E+,F-,G-,I-,L+,N+,O-,P-,Q+,R+,S+,T-,V+,X+}
{$M 16384,0,655360}

uses crt,dos;

const
    dtfi='THAMQUAN.IN';
    dtfo='THAMQUAN.OU';
    dtfm='THAMQUAN.AN';
    maxN=30000;

type
   mang=array[1..30000] of integer;

var
   Error: array[0..9] of integer;
   Diem: array[0..9] of real;
   p: integer;
   tfi,tfo,tfm: string[12];
   d: SearchRec;
   fi,fo,fm: text;

   N,M: integer;
   a,b: ^mang;

   kqm,kqo: extended;
   x: array[1..maxn] of integer;


procedure Docdl;
var i: integer;
begin
   assign(fi,tfi); reset(fi);
   read(fi,N,M);
   for i:=1 to N do read(fi,a^[i]);
   for i:=1 to M do read(fi,b^[i]);
   close(fi);
end;

procedure Cham;
var i: integer;
    Tong,T: extended;
begin
   readln(fm,kqm);
   {$I-}
   readln(fo,kqo);
   if ioresult<>0 then
      begin
         error[p]:=2;
         exit;
      end;
   for i:=1 to N do
      begin
         readln(fo,x[i]);
         if ioresult<>0 then
            begin
               error[p]:=2;
               exit;
            end;
      end;
   Tong:=0;
   for i:=1 to N do
      begin
         T:=a^[i];
         Tong:=Tong+T*b^[x[i]];
      end;
   if tong<>kqo then
      begin
         error[p]:=3; {Tinh tong sai}
         exit;
      end;
   if kqo>kqm then
      begin
         error[p]:=4; {Khong tot nhat}
         diem[p]:=0.5;
         exit;
      end;
   diem[p]:=1.0;
end;

procedure InError(p: LongInt);
begin
   textcolor(red);
   case Error[p] of
      0: writeln;
      1: writeln('Khong co file OUTPUT');
      2: writeln('Loi doc file OUTPUT');
   end;
   textcolor(white);
end;

procedure Inkq;
var T: real;
begin
   clrscr;
   writeln;
   writeln;
   writeln;
   textcolor(white);
   writeln('         ********************************************************');
   writeln('         *          Ket qua cham bai                            *');
   writeln('         ********************************************************');
   T:=0.0;
   for p:=0 to 9 do
      begin
         write('              TEST ',p,': ',Diem[p]:4:1);
         InError(p);
         T:=T+diem[p];
      end;
   writeln('          --------------------------------------------------------');
   textcolor(green);
   writeln('          Tong cong = ',T:4:1,' Diem');
   textcolor(white);
end;

procedure XoaFile;
begin
   for p:=0 to 9 do
      begin
         tfo:=dtfo+chr(p+48);
         FindFirst(tfo,archive,d);
         if DosError<>0 then continue;
         assign(fo,tfo);
         erase(fo);
      end;
end;

BEGIN
   new(a); new(b);
   fillchar(Error,sizeof(Error),0);
   fillchar(Diem,sizeof(Diem),0);
   for p:=0 to 9 do
      begin
         tfi:=dtfi+chr(p+48);
         tfm:=dtfm+chr(p+48);
         tfo:=dtfo+chr(p+48);
         FindFirst(tfo,Archive,d);
         if DosError<>0 then
            begin
               Error[p]:=1;
               continue;
            end;
         Docdl;
         assign(fo,tfo); reset(fo);
         assign(fm,tfm); reset(fm);
         Cham;
         close(fo); close(fm);
      end;
   Inkq;
   XoaFile;
END.