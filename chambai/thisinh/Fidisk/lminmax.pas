uses math;
type deque=record
        queue:array[0..1000007] of longint;
        front,rear:longint;
        end;
var i,n,k,res,vt:longint;
    a:array[0..1000007] of longint;
    f,v:text;
    minqueue,maxqueue:deque;
begin
        assign(f,'lminmax.inp');
        reset(f);
        read(f,n,k);
        for i:=1 to n do
                read(f,a[i]);
        close(f);
        minqueue.front:=1;
        maxqueue.front:=1;
        minqueue.rear:=0;
        maxqueue.rear:=0 ;
        res:=1;
        vt:=1;
        for i:=1 to n do
                begin
                while ((minqueue.front<=minqueue.rear) and (a[minqueue.queue[minqueue.rear]]>=a[i])) do
                        dec(minqueue.rear);
                inc(minqueue.rear);
                minqueue.queue[minqueue.rear]:=i;
                while ((maxqueue.front<=maxqueue.rear) and (a[maxqueue.queue[maxqueue.rear]]<=a[i])) do
                        dec(maxqueue.rear);
                inc(maxqueue.rear);
                maxqueue.queue[maxqueue.rear]:=i;
                while ((a[minqueue.queue[minqueue.front]]<(a[i]-k)) and (minqueue.front<=minqueue.rear)) do
                        begin
                        vt:=minqueue.queue[minqueue.front]+1;
                        inc(minqueue.front);
                        end;
                while ((a[maxqueue.queue[maxqueue.front]]>(a[i]+k)) and (maxqueue.front<=maxqueue.rear)) do
                        begin
                        vt:=maxqueue.queue[maxqueue.front]+1;
                        inc(maxqueue.front);
                        end;
                res:=max(res,i-vt+1);
                end;
        assign(v,'lminmax.out');
        rewrite(v);
        writeln(v,res);
        close(v);
end.