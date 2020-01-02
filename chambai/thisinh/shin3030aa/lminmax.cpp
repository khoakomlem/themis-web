#include <bits/stdc++.h>
using namespace std;

int n, a[1000007];
int vt[10000007];
long long t;
int Max = -1000000009;
int Min = 1000000009;
void read(){
    scanf("%d %lld", &n, &t);
    for (int i=1;i<=n;i++){
        scanf("%d", &a[i]);
        vt[a[i]] = i;
        Max = max(a[i], Max);
        Min = min(a[i], Min);
    }
}

void xl(){
    if (Max - Min <= t){
        cout<<n;
        exit(0);
    }

        int res = 0;
        int i = 1;
        int ma = a[i];
        int mi = a[i];
        while (i <= n){
            int j = i;
            while (j + 1 <= n ){
                j++;
                ma=max(ma, a[j]);
                mi=min(mi, a[j]);
                if (ma - mi > t){
                    j--;
                    break;
                }
            }

            res = max(res, j-i+1);
            i++;
            ma = a[i];
            mi = a[i];
        }
        cout<<res;

}

int main(){
    freopen("LMINMAX.inp", "r", stdin);
    freopen("LMINMAX.out", "w", stdout);
    read();

    xl();
}
