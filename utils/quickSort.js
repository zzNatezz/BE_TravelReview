function quickSort(arr, compare = defaultCompare) {
  return quick(arr, 0, arr.length - 1, compare);
}

function quick(arr, left, right, compare) {
  let i;
  if (arr.length > 1) {
    i = partition(arr, left, right, compare);
    if (left < i - 1) {
      quick(arr, left, i - 1, compare);
    }
    if (i < right) {
      quick(arr, i, right, compare);
    }
  }
  return arr;
}

function partition(arr, left, right, compare) {
  const pivot = arr[Math.floor((right, left) / 2)];
  let i = left;
  let j = right;

  while (i <= j) {
    while (compare(arr[i], pivot) === Compare.LESS_THAN) {
      i++;
    }
    while (compare(arr[j], pivot) === Compare.BIGGER_THAN) {
      j--;
    }
    if (i <= j) {
      swap(arr, i, j);
      i++;
      j--;
    }
  }
  return i;
}
