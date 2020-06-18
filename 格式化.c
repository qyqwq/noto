int maxSubmatrixSum(std::vector<std::vector<int>> matrix,
                    int n, int m)
{
    int base_sum; //矩阵总和
    for (int i = 0; i < n; i++)
    {
        for (int j = 0; j < m; j++)
        {
            base_sum += matrix[i][j];
        }
    }
    int result = 0; //返回值
    for (int i = 0; i + n < matrix.size(); i++)
    {
        if (i > 0)
        {
            for (int y = 0; y < m; y++)
            {
                base_sum += matrix[i + n][y] - matrix[i - 1][y];
            }
        }
        int real_sum = base_sum;
        if (real_sum > result)
        {
            result = real_sum;
        }
        for (int j = 0; j + m < matrix.size(); j++)
        {
            for (int x = 0; x < n; x++)
            {
                real_sum += matrix[x][j + m] - matrix[x][j - 1];
            }
            if (real_sum > result)
            {
                result = real_sum;
            }
        }
    }
    return result;
}