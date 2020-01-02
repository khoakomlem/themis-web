uses math;
var n,i,m:longint;
    a,b:array[0..100007] of longint;
    f,v:text;
begin
        assign(f,'vector.inp');
        reset(f);
        read(f,n);
        for i:=1 to n do
                read(f,a[i]);
        read(f,m);
        for i:=1 to m do
                read(f,b[i]);
        close(f);
        assign(v,'vector.out');
        rewrite(v);
        writeln(v,6*m+4*n);
        for i:=1 to m do
                writeln(v,b[i],' D');
        for i:=1 to m do
                writeln(v,b[i],' W');
        for i:=1 to n do begin
                writeln(v,a[i],' D');
                writeln(v,a[i],' D');
                end;
        for i:=1 to m do begin
                writeln(v,b[i],' D');
                writeln(v,b[i],' D');
                end;
        for i:=1 to n do
                writeln(v,a[i],' W');
        for i:=1 to m do
                writeln(v,b[i],' W');
        for i:=1 to n do
                writeln(v,a[i],' L');
        for i:=1 to m do
                writeln(v,b[i],' L');
        close(v);
end.