#include <bits/stdc++.h>
using namespace std;
struct two
{
    int x;
    char s;
};
vector <two> ans;
int a[10000],b[10000];
int f[100000],ff[100000];
int n,k,top,m;
void sang()
{
    for (int i=2;i<=10000;i++)
    {
        if (ff[i]==1) continue;
        for (int j=2;j<=10000/i;j++) ff[i*j]=1;
    }
    top=0;
    for (int i=2;i<=10000;i++) if (ff[i]==0) f[++top]=i;
}
void phantich1(int k)
{
    int i=1;
    while (i<=top&&k>1)
    {
        while (k%f[i]==0)
        {
            k/=f[i];
            a[f[i]]++;
        }
        i++;
    }
    if (k>1)
    {
        ans.push_back({k,'D'});
        ans.push_back({k,'D'});
        ans.push_back({k,'W'});
        ans.push_back({k,'L'});
    }
}

void phantich2(int k)
{
    int i=1;
    while (i<=top&&k>1)
    {
        while (k%f[i]==0)
        {
            k/=f[i];
            b[f[i]]++;
        }
        i++;
    }
    if (k>1)
    {
        ans.push_back({k,'D'});
        ans.push_back({k,'W'});
        ans.push_back({k,'D'});
        ans.push_back({k,'D'});
        ans.push_back({k,'W'});
        ans.push_back({k,'L'});
    }
}
int main()
{
    ios_base::sync_with_stdio(false);
    cin.tie(0);cout.tie(0);
    freopen("VECTOR.inp","r",stdin);
    freopen("VECTOR.out","w",stdout);
    sang();
    cin>>n;
    for (int i=1;i<=n;i++)
    {
        cin>>k;
        phantich1(k);
    }
    cin>>m;
    for (int i=1;i<=m;i++)
    {
        cin>>k;
        phantich2(k);
    }
    for (int i=1;i<=top;i++)
    {
        if (a[f[i]]==0&&b[f[i]]==0) continue;
        if (b[f[i]]%2==1)
        {
            b[f[i]]++;
            ans.push_back({f[i],'D'});
        }
        while (b[f[i]]>0)
        {
            int res=f[i];
            int sol=1;
            while (res*res<=1e7&&sol*2<=b[f[i]])
            {
                res*=res;
                sol*=2;
            }
            b[f[i]]-=sol;
            a[f[i]]+=sol/2;
            res=sqrt(res);
            ans.push_back({res,'W'});
        }
        while (a[f[i]]>1)
        {
            int res=f[i];
            int sol=1;
            while (res*res<=1e7&&sol*2<=a[f[i]])
            {
                res=res*res;
                sol*=2;
            }
            a[f[i]]-=sol;
            res=sqrt(res);
            ans.push_back({res,'L'});
        }
        if (a[f[i]]==1)
        {
            ans.push_back({f[i],'D'});
            ans.push_back({f[i],'D'});
            ans.push_back({f[i],'W'});
            ans.push_back({f[i],'L'});
            a[f[i]]--;
        }
    }
    cout<<ans.size()<<'\n';
    for (int i=0;i<ans.size();i++)
    {
        cout<<ans[i].x<<" "<<ans[i].s<<'\n';
    }
}
