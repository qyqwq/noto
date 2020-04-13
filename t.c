#include <stdio.h>

int main()
{
    int a[101];
    int i,j,t,n;
    printf("请输入n，0<n<100：\n");
    scanf("%d",&n);
    printf("请输入%d个数以进行排序\n",n);
    for(i=0;i<n;i++){
        scanf("%d",&a[i]);
    }
    printf("正在排序...\n",n);
    for(i=0;i<n-1;i++)
    {
        for(j=0;j<n-i-1;j++)
        {
            if(a[j]>a[j+1])
            {
               t=a[j+1];
               a[j+1]=a[j];
               a[j]=t;
            }
        }
    }
 
    printf("排列好的数列是：\n");
    //输出排列好得吃数列
    for(i=0;i<n;i++)
    {
        printf("%d ",a[i]);
    }
    return 0;
}
