#include <bits/stdc++.h>
using namespace std;

long long n,d,a[10000000],f[10000000];
void nhap()
{
    cin>>n>>d;
    for(int i=1;i<=n;i++)
    {
        cin>>a[i];
        f[i]=1;
    }


}

void xuli()
{

    long kq=1;
    for (int i=1;i<n;i++)
    {
        long minn=a[i+1],maxx=a[i];
        for(int j=i+1;j<=n;j++)
            {
                if (a[j]>maxx) maxx =a[j];
                if (a[j]<minn) minn=a[j];
                if (maxx-minn<=d) f[i]++;
                else break;
            }

            if (f[i]>kq) kq=f[i];
    }
    cout<<kq;
}

int main()
{
    ios_base::sync_with_stdio(false);
    cin.tie(0); cout.tie(0);
    freopen("lminmax.inp","a+",stdin);
    freopen("lminmax.out","w+",stdout);
    nhap();
    xuli();
}
