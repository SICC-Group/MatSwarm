export interface TreeNode<T> {
  children: Array<TreeNode<T>>;
  info: T;
}
