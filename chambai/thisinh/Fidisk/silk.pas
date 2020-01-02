uses math;
var f,v:text;
    n:longint;
begin
        randomize;
        assign(f,'silk.inp');
        reset(f);
        read(f,n);
        close(f);
        assign(v,'silk.out');
        rewrite(v);
        writeln(v,random(n-1)+1);
        close(v);
end.