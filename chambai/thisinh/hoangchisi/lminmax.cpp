#include <bits/stdc++.h>
#define oo 10000000000
using namespace std;
long long n,k,a[1000001],res=0;
int main()
{
    ios_base::sync_with_stdio(false);
    cin.tie(0); cout.tie(0);
    freopen("LMINMAX.inp", "r",stdin);
    freopen("LMINMAX.out", "w",stdout);
    cin>>n>>k;
    for(int i=1;i<=n;i++)
    {
        cin>> a[i];
    }
    for(int i=1;i<=n;i++)
    {
        long long maxx=a[i];
        long long minn=a[i];
        long long kq=1;
        for(int j=i+1;j<=n;j++)
        {
            maxx=max(a[j],maxx);
            minn=min(minn,a[j]);
            if(abs(minn-maxx)<=k)
                kq++;
            else break;
        }
        res=max(res,kq);
    }
    cout<<res;
}

