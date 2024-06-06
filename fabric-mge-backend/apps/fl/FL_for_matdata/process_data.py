import pandas as pd
from sklearn.model_selection import train_test_split

files = [
    'orignal_data/wolverton_oxides_new1.csv',
    'orignal_data/wolverton_oxides_new2.csv',
    'orignal_data/wolverton_oxides_new3.csv'
]
dfs = [pd.read_csv(file) for file in files]

df = pd.concat(dfs, ignore_index=True)
df = df.dropna(axis=0, how='any')
train_df, test_df = train_test_split(df, test_size=0.08, random_state=42)

test_df.to_csv('data/test_dataset.csv', index=False)
df_sorted = train_df.sort_values(by='e_form')

# 计算每个部分的大小（整除，可能会有舍去）
part_size = len(df_sorted) // 3

# 划分DataFrame为三部分
df_part1 = df_sorted.iloc[:part_size]
df_part2 = df_sorted.iloc[part_size:2*part_size]
df_part3 = df_sorted.iloc[2*part_size:]

# 分别将这三部分保存为CSV文件
df_part1.to_csv('data/train_part1.csv', index=False)
df_part2.to_csv('data/train_part2.csv', index=False)
df_part3.to_csv('data/train_part3.csv', index=False)