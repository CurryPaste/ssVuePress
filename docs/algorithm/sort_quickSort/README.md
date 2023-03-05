# 排序——快速排序法

### 快速排序

快速排序是一种高效的排序算法，其基本思想是通过一趟排序将待排记录分割成独立的两部分，其中一部分记录的关键字均比另一部分的关键字小，然后再分别对这两部分记录进行排序，从而达到整个序列有序的目的。

#### js 实现

```js
function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  const pivotIndex = Math.floor(arr.length / 2);
  const pivot = arr.splice(pivotIndex, 1)[0];
  const left = [];
  const right = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  return [...quickSort(left), pivot, ...quickSort(right)];
}
```

实现思路是：首先选择一个基准元素（pivot），然后遍历整个数组，将小于基准元素的数放在一个数组中，将大于等于基准元素的数放在另一个数组中。最后将左侧数组、基准元素和右侧数组依次连接起来。这里使用递归的方式，对左右两侧的数组分别进行快速排序，直到数组长度为 1 或 0，即可得到排好序的数组。

需要注意的是，如果选取的基准元素不合适，可能会导致快排的性能降低。因此，在实际应用中，为了避免出现最坏情况，通常会选择一些更为优化的基准元素选取方式，例如三数取中法等。

### 三数取中法

三数取中法是一种常用的优化快速排序的基准元素选取方式，其基本思想是：在待排序数组的左端、右端和中间位置分别选取一个数，然后取这三个数的中位数作为基准元素，以此避免选取到极端的基准元素，从而提高快排的性能。具体实现过程如下：

- 首先，计算数组的中间位置 `（middle），即 middle = Math.floor((left + right) / 2)` 。

- 接着，从待排序数组的左端、右端和中间位置分别选取一个数，即 `const pivot = getMedian(arr[left], arr[right], arr[middle])` 。

- getMedian 函数用于求出三个数的中位数，其具体实现方式为：

```js
function getMedian(num1, num2, num3) {
  const max = Math.max(num1, num2, num3);
  const min = Math.min(num1, num2, num3);
  return num1 + num2 + num3 - max - min;
}
```

- 最后，将选取出的基准元素 pivot 与待排序数组中间位置的元素交换位置，然后进行快排即可。

使用三数取中法可以有效地避免选取到极端的基准元素，从而提高快排的性能。

### 冒泡排序

冒泡排序是一种简单的排序算法，其基本思路是将相邻的元素进行比较和交换，以此来达到排序的目的

```js
function bubbleSort(arr) {
  const len = arr.length;
  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // 使用解构赋值来交换数组元素
      }
    }
  }
  return arr;
}
```

在这个实现中，我们使用了两层循环来遍历数组中的元素，并将相邻元素进行比较和交换。外层循环控制排序的轮数，内层循环控制每轮排序中的比较和交换操作。在内层循环中，我们使用了一个 if 语句来判断当前元素是否大于相邻的元素，如果是，则使用解构赋值的方式来交换这两个元素的位置。

该算法的时间复杂度为 O(n^2)，其中 n 为数组的长度。因为该算法需要进行两层循环，因此其时间复杂度为 n \* (n-1) / 2 = O(n^2)。该算法的空间复杂度为 O(1)，因为它只使用了常数级别的额外空间来存储一些临时变量。

### 冒泡排序优化

冒泡排序是一种简单的排序算法，但由于其时间复杂度为 O(n^2)，对于较大的数据集来说，其性能可能不够理想。以下是一种经过优化的冒泡排序算法，可以在某些情况下提高冒泡排序的性能。

```js
function optimizedBubbleSort(arr) {
  const len = arr.length;
  let swapped = false; // 设置标志位
  for (let i = 0; i < len - 1; i++) {
    swapped = false; // 每轮开始前重置标志位
    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true; // 标志位为true，表示本轮发生了交换
      }
    }
    if (!swapped) {
      break; // 如果本轮没有发生交换，则说明数组已经有序，跳出循环
    }
  }
  return arr;
}
```

这个算法与普通的冒泡排序的主要区别在于，在每一轮排序结束后，都会检查标志位，如果标志位为 false，则说明数组已经有序，可以直接跳出循环，避免不必要的比较操作。这种优化算法的时间复杂度同样为 O(n^2)，但是在某些情况下，由于提前结束循环，可以减少比较操作的次数，因此其实际性能可能会更好。
