#include<bits/stdc++.h>
using namespace std;
long long a[1000005];
long long n,delta;
int main()
{
    ios_base::sync_with_stdio(0);
    cin.tie(0); cout.tie(0);
    freopen("LMINMAX.inp","r",stdin);
    freopen("LMINMAX.out","w",stdout);
    deque<long long> qmax,qmin;
    int j=1,ans=1;
    cin >> n >> delta;
    for (int i=1; i<=n; i++) {
        cin >> a[i];
        while (!qmin.empty()&&a[qmin.back()]>=a[i]) qmin.pop_back();
        qmin.push_back(i);
        while (!qmax.empty()&&a[qmax.back()]<=a[i]) qmax.pop_back();
        qmax.push_back(i);
        while (a[qmax.front()] - a[qmin.front()]>delta)
        {
            if (qmax.front() == j) qmax.pop_front();
            if (qmin.front()==j) qmin.pop_front();
            ++j;
        }
        ans=max(ans,i-j+1);
    }
    cout << ans;
}
