#include<bits/stdc++.h>
using namespace std;
long long n,x,fi[1000000],b[1000000],a[1000000],g[1000000];
int f[1000000];
void cmp()
{
    int res=0;
    for (int i=1; i<=n; i++)
    {
        int l=1, r=res, j=0;
        while (l<=r)
        {
            int mid=(l+r)/2;
            if (b[fi[mid]]>=b[i])
            {
                j=mid;
                l=mid+1;
            }
            else r=mid-1;
        }
        if (j==res) fi[++res]=i;
        else fi[j+1]=i;
        g[n-i+1]=j+1;
    }
}
int BS(int c, int b, long long k)
{
    long long l=c, r=b,ans=0;
    while (l<=r)
    {

        int  mid=(l+r)/2;
        if (a[f[mid]]<=k)
        {
            ans=mid;
            l=mid+1;
        }
        else r=mid-1;
    }
    return ans;
}
void solve()
{
    long long ans=0,res=0;
    for (int i=1; i<=n; i++)
    {
        int k=BS(1,res,a[i]+x);
        ans=max(ans,k+g[i]);
        int j=BS(1,res,a[i]);
        if (j==res) f[++res]=i;
        else f[j+1]=i;
    }
    cout<<ans;
}
int main()
{
    freopen("SILK.INP","r",stdin);
    freopen("SILK.OUT","w",stdout);
    cin>>n>>x;
    for (int i=1; i<=n; i++)
    {
        scanf("%lld",&a[i]);
        b[n-i+1]=a[i];
    }
    cmp();
    solve();
}
