#include <bits/stdc++.h>
#define MAX 1000001
using namespace std;
long n,k,a[MAX],d,b[MAX],minn,maxx;
int main ()
{
    ios_base::sync_with_stdio(false);
    cin.tie(0); cout.tie(0);
    cin>>n>>k;
    d=0; maxx=-10000; minn=10000;
    for(int i=1; i<=n; i++)
        cin>>a[i];
    for(int i=1; i<=n; i++)
    {
        if(a[i]==a[i+1]-1 || a[i]==a[i+1]+1)
        {

            maxx=max(a[i],maxx);
            minn=min(a[i],minn);
            d++;
            if(maxx-minn>k)
                break;
        }
    }
    cout<<d;
}
