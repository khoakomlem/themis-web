#include <bits/stdc++.h>
#define MAX 300
#define FOR(i,a,b) for(int i=a; i<=b; i++)
using namespace std;
typedef unsigned long long llu;
long a[MAX],b[MAX],c[MAX];
int cs=0,n,m;
void NHAP ()
{
    cin>>n;
    FOR(i,1,n)
        cin>>a[i];
    cin>>m;
    FOR(k,1,m)
        cin>>b[k];
}
llu TICH (long n, long a[])
{
    llu kq=1;
    for(int i=1; i<=n; i++)
        kq*=a[i];
    return kq;
}
void GIAI ()
{
    llu toan=TICH(n,a);
    llu binh=TICH(m,b);
    binh*=toan;
    cout<<"D"<<" "<<toan<<endl;
    for(int i=1; i<=n; i++)
    {
        cs++;
        c[cs]=a[i];
    }
    for(int k=1; k<=m; k++)
    {
        cs++;
        c[cs]=b[k];
    }
    for(int i=2; i<=cs; i++)
    {
        if(i<=n+1)
        {
            binh/=c[i]*c[i];
            toan*=c[i];
            cout<<c[i]<<" "<<"W"<<endl;
        }
        else
        {
            toan/=(c[cs]*c[cs-2])*(c[cs]*c[cs-2]);
            cout<<c[cs]*c[cs-2]<<" "<<"L"<<endl;
            break;
        }
    }
    cout<<c[cs-1]<<" "<<"L";
}
int main ()
{
    ios_base::sync_with_stdio(false);
    cin.tie(0); cout.tie(0);
    NHAP();
    GIAI();
}
