// --- Quiz Logic ---
const problemTitleEl = document.getElementById('problem-title');
const problemStatementEl = document.getElementById('problem-statement');
const codeSkeletonEl = document.getElementById('code-skeleton'); // The <code> element
const choicesAreaEl = document.getElementById('choices-area');
const checkButton = document.getElementById('check-button');
const feedbackAreaEl = document.getElementById('feedback-area');
const nextButton = document.getElementById('next-button');
// --- Add Progress Bar Element References ---
const progressBarFillEl = document.getElementById('progress-bar-fill');
const progressTextEl = document.getElementById('progress-text');

// --- Embedded Quiz Data ---
const quizData = [
    {
      "problemTitle": "1. Two Sum",
      "problemStatement": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\nYou can return the answer in any order.\n\nExample 1:\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\n\nExample 2:\nInput: nums = [3,2,4], target = 6\nOutput: [1,2]\n\nConstraints:\n2 <= nums.length <= 104\n-109 <= nums[i] <= 109\n-109 <= target <= 109\nOnly one valid answer exists.",
      "codeSkeleton": "class Solution(object):\n    def twoSum(self, nums, target):\n        \"\"\"\n        :type nums: List[int]\n        :type target: int\n        :rtype: List[int]\n        \"\"\"\n        # <MISSING CODE BLOCK>",
      "choices": [
        {
          "text": "# HashMap/Dictionary Approach O(n)\nseen = {}\nfor i, num in enumerate(nums):\n    complement = target - num\n    if complement in seen:\n        return [seen[complement], i]\n    seen[num] = i\nreturn []",
          "correct": true
        },
        {
          "text": "# Brute Force O(n^2)\nn = len(nums)\nfor i in range(n):\n    for j in range(i + 1, n):\n        if nums[i] + nums[j] == target:\n            return [i, j]\nreturn []",
          "correct": false
        },
        {
          "text": "# Incorrect HashMap Logic (stores wrong key)\nseen = {}\nfor i, num in enumerate(nums):\n    complement = target - num\n    if complement in seen:\n        return [seen[complement], i]\n    # Error: Should store num as key, not complement\n    seen[complement] = i \nreturn []",
          "correct": false
        },
        {
          "text": "# Incorrect: Returns values instead of indices\nseen = {}\nfor i, num in enumerate(nums):\n    complement = target - num\n    if complement in seen:\n        # Error: returning numbers, not indices\n        return [complement, num]\n    seen[num] = i\nreturn []",
          "correct": false
        }
      ]
    },
    {
      "problemTitle": "121. Best Time to Buy and Sell Stock",
      "problemStatement": "You are given an array prices where prices[i] is the price of a given stock on the ith day.\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.\n\nExample 1:\nInput: prices = [7,1,5,3,6,4]\nOutput: 5\nExplanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.\n\nExample 2:\nInput: prices = [7,6,4,3,1]\nOutput: 0\n\nConstraints:\n1 <= prices.length <= 105\n0 <= prices[i] <= 104",
      "codeSkeleton": "class Solution(object):\n    def maxProfit(self, prices):\n        \"\"\"\n        :type prices: List[int]\n        :rtype: int\n        \"\"\"\n        # <MISSING CODE BLOCK>",
      "choices": [
          {
              "text": "# One Pass O(n) Solution\nmin_price = float('inf')\nmax_profit = 0\nfor price in prices:\n    if price < min_price:\n        min_price = price\n    elif price - min_price > max_profit:\n        max_profit = price - min_price\nreturn max_profit",
              "correct": true
          },
          {
              "text": "# Brute Force O(n^2)\nmax_profit = 0\nn = len(prices)\nfor i in range(n):\n    for j in range(i + 1, n):\n        profit = prices[j] - prices[i]\n        if profit > max_profit:\n            max_profit = profit\nreturn max_profit",
              "correct": false
          },
          {
              "text": "# Incorrect: Only finds min and max, ignores order\nif not prices or len(prices) < 2:\n    return 0\nmin_p = min(prices)\nmax_p = max(prices)\n# Error: Doesn't guarantee max occurs after min\nreturn max(0, max_p - min_p)",
              "correct": false
          },
          {
              "text": "# Incorrect: Updates min_price incorrectly\nmin_price = prices[0] if prices else 0\nmax_profit = 0\nfor price in prices:\n    # Error: Should check profit *before* updating min_price\n    if price < min_price:\n        min_price = price \n    profit = price - min_price \n    if profit > max_profit:\n        max_profit = profit\nreturn max_profit",
               "correct": false
          }
      ]
    },
    {
      "problemTitle": "217. Contains Duplicate",
      "problemStatement": "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.\n\nExample 1:\nInput: nums = [1,2,3,1]\nOutput: true\n\nExample 2:\nInput: nums = [1,2,3,4]\nOutput: false\n\nConstraints:\n1 <= nums.length <= 105\n-109 <= nums[i] <= 109",
      "codeSkeleton": "class Solution(object):\n    def containsDuplicate(self, nums):\n        \"\"\"\n        :type nums: List[int]\n        :rtype: bool\n        \"\"\"\n        # <MISSING CODE BLOCK>",
      "choices": [
        {
          "text": "# Efficient Set-based solution O(n)\nseen = set()\nfor num in nums:\n    if num in seen:\n        return True\n    seen.add(num)\nreturn False",
          "correct": true
        },
        {
          "text": "# Sorting approach O(n log n)\nnums.sort()\nfor i in range(len(nums) - 1):\n    if nums[i] == nums[i+1]:\n        return True\nreturn False",
          "correct": false
        },
         {
           "text": "# Concise Set comparison (Also correct, but less explicit loop)\nreturn len(nums) != len(set(nums))",
           "correct": false // Marking as false to enforce one correct answer style
         },
         {
           "text": "# Incorrect Logic: Using dictionary count inefficiently\ncounts = {}\nfor num in nums:\n    counts[num] = counts.get(num, 0) + 1\n# Error: Fails to check if any count is >= 2\nreturn False # Always returns false",
          "correct": false
         }
      ]
    },
    {
      "problemTitle": "238. Product of Array Except Self",
      "problemStatement": "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].\nThe product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.\nYou must write an algorithm that runs in O(n) time and without using the division operation.\n\nExample 1:\nInput: nums = [1,2,3,4]\nOutput: [24,12,8,6]\n\nConstraints:\n1 <= nums.length <= 105\n-30 <= nums[i] <= 30\nProduct fits in 32-bit integer.",
      "codeSkeleton": "class Solution(object):\n    def productExceptSelf(self, nums):\n        \"\"\"\n        :type nums: List[int]\n        :rtype: List[int]\n        \"\"\"\n        # <MISSING CODE BLOCK>",
      "choices": [
         {
           "text": "# O(n) time, O(1) space (excluding output array)\nn = len(nums)\nresult = [1] * n\nprefix = 1\nfor i in range(n):\n    result[i] = prefix\n    prefix *= nums[i]\npostfix = 1\nfor i in range(n - 1, -1, -1):\n    result[i] *= postfix\n    postfix *= nums[i]\nreturn result",
           "correct": true
         },
         {
           "text": "# O(n) time, O(n) space (prefix/postfix arrays)\nn = len(nums)\nprefix_prod = [1] * n\nsuffix_prod = [1] * n\nres = [1] * n\nfor i in range(1, n):\n    prefix_prod[i] = prefix_prod[i-1] * nums[i-1]\nfor i in range(n-2, -1, -1):\n    suffix_prod[i] = suffix_prod[i+1] * nums[i+1]\nfor i in range(n):\n    res[i] = prefix_prod[i] * suffix_prod[i]\nreturn res",
           "correct": false // Less optimal space-wise
         },
         {
           "text": "# Incorrect: Uses division (violates constraint)\ntotal_product = 1\nzero_indices = [i for i, x in enumerate(nums) if x == 0]\nif len(zero_indices) > 1:\n    return [0] * len(nums)\nif len(zero_indices) == 1:\n    res = [0] * len(nums)\n    for x in nums:\n        if x != 0: total_product *= x\n    res[zero_indices[0]] = total_product\n    return res\n# No zeros\nfor x in nums: total_product *= x\nreturn [total_product // x for x in nums] # Division used",
           "correct": false
         },
         {
           "text": "# Incorrect: Off-by-one in prefix/postfix update\nn = len(nums)\nresult = [1] * n\nprefix = 1\nfor i in range(n):\n    result[i] = prefix\n    # Error: Should update prefix AFTER assigning to result[i]\n    prefix *= nums[i] \npostfix = 1\nfor i in range(n - 1, -1, -1):\n    result[i] *= postfix\n    # Error: Should update postfix AFTER multiplying result[i]\n    postfix *= nums[i] \nreturn result",
           "correct": false
         }
      ]
    },
     {
      "problemTitle": "53. Maximum Subarray",
      "problemStatement": "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.\n\nExample 1:\nInput: nums = [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6\nExplanation: [4,-1,2,1] has the largest sum = 6.\n\nExample 2:\nInput: nums = [1]\nOutput: 1\n\nExample 3:\nInput: nums = [5,4,-1,7,8]\nOutput: 23\n\nConstraints:\n1 <= nums.length <= 105\n-104 <= nums[i] <= 104",
      "codeSkeleton": "class Solution(object):\n    def maxSubArray(self, nums):\n        \"\"\"\n        :type nums: List[int]\n        :rtype: int\n        \"\"\"\n        # <MISSING CODE BLOCK>",
      "choices": [
          {
              "text": "# Kadane's Algorithm O(n)\nmax_so_far = nums[0]\ncurrent_max = nums[0]\nfor i in range(1, len(nums)):\n    num = nums[i]\n    current_max = max(num, current_max + num)\n    max_so_far = max(max_so_far, current_max)\nreturn max_so_far",
              "correct": true
          },
          {
               "text": "# Brute Force O(n^2)\nmax_sum = -float('inf')\nn = len(nums)\nfor i in range(n):\n    current_sum = 0\n    for j in range(i, n):\n        current_sum += nums[j]\n        max_sum = max(max_sum, current_sum)\nreturn max_sum",
              "correct": false
          },
          {
              "text": "# Incorrect Kadane's: Reset logic flawed\nmax_so_far = -float('inf')\ncurrent_max = 0\nfor num in nums:\n    current_max += num\n    # Error: This max_so_far update might miss single large negatives\n    max_so_far = max(max_so_far, current_max) \n    if current_max < 0:\n       current_max = 0 # Resetting can discard necessary negative start\n# Handling all negatives case requires adjustment outside loop usually\nif max_so_far == -float('inf') or (max_so_far == 0 and not any(x>0 for x in nums)):\n     return max(nums)\nreturn max_so_far",
               "correct": false
          },
          {
              "text": "# Incorrect: Only considers positive numbers\nmax_so_far = 0\ncurrent_max = 0\nfor num in nums:\n    if num > 0:\n      current_max += num\n      max_so_far = max(max_so_far, current_max)\n    else:\n      # Error: Ignores negative numbers that could be part of max subarray\n      current_max = 0 \n# Fails if max subarray is a single negative number or includes negatives\nreturn max_so_far if max_so_far > 0 else (max(nums) if nums else 0)",
              "correct": false
          }
      ]
    },
    {
      "problemTitle": "152. Maximum Product Subarray",
      "problemStatement": "Given an integer array nums, find a contiguous non-empty subarray within the array that has the largest product, and return the product.\nThe test cases are generated so that the answer will fit in a 32-bit integer.\n\nExample 1:\nInput: nums = [2,3,-2,4]\nOutput: 6\nExplanation: [2,3] has the largest product 6.\n\nExample 2:\nInput: nums = [-2,0,-1]\nOutput: 0\nExplanation: The result cannot be 2, because [-2,-1] is not a subarray.\n\nConstraints:\n1 <= nums.length <= 2 * 104\n-10 <= nums[i] <= 10\nProduct fits in a 32-bit integer.",
      "codeSkeleton": "class Solution(object):\n    def maxProduct(self, nums):\n        \"\"\"\n        :type nums: List[int]\n        :rtype: int\n        \"\"\"\n        # <MISSING CODE BLOCK>",
      "choices": [
          {
              "text": "# Modified Kadane's (Keep track of min and max) O(n)\nif not nums: return 0\nmax_prod = nums[0]\nmin_prod = nums[0]\nresult = nums[0]\nfor i in range(1, len(nums)):\n    num = nums[i]\n    # Need temp because max_prod is used in min_prod calculation\n    temp_max = max(num, max_prod * num, min_prod * num)\n    min_prod = min(num, max_prod * num, min_prod * num)\n    max_prod = temp_max\n    result = max(result, max_prod)\nreturn result",
              "correct": true
          },
          {
              "text": "# Brute Force O(n^2)\nif not nums: return 0\nmax_prod = -float('inf')\nn = len(nums)\nfor i in range(n):\n    current_prod = 1\n    for j in range(i, n):\n        current_prod *= nums[j]\n        max_prod = max(max_prod, current_prod)\nreturn max_prod",
              "correct": false
          },
          {
              "text": "# Incorrect: Simple Kadane's (fails on negatives)\nmax_so_far = nums[0] if nums else 0\ncurrent_max = nums[0] if nums else 0\nfor i in range(1, len(nums)):\n    num = nums[i]\n    # Error: Doesn't handle product logic with negatives\n    current_max = max(num, current_max * num) \n    max_so_far = max(max_so_far, current_max)\nreturn max_so_far",
              "correct": false
          },
          {
              "text": "# Incorrect: Doesn't reset product correctly on zero\nmax_prod = nums[0] if nums else 0\ncurrent_prod = 1\nfor num in nums:\n    current_prod *= num\n    if num == 0:\n       # Error: Should reset to 1 for future subarray, also need max logic\n       current_prod = 0 \n    max_prod = max(max_prod, current_prod)\n# Fails cases like [2, -5, -2, -4, 3]\nreturn max_prod",
              "correct": false
          }
      ]
    },
    {
      "problemTitle": "153. Find Minimum in Rotated Sorted Array",
      "problemStatement": "Suppose an array of length n sorted in ascending order is rotated between 1 and n times. For example, the array nums = [0,1,2,4,5,6,7] might become:\n[4,5,6,7,0,1,2] if it was rotated 4 times.\n[0,1,2,4,5,6,7] if it was rotated 7 times.\nNotice that rotating an array [a[0], a[1], ..., a[n-1]] 1 time results in the array [a[n-1], a[0], a[1], ..., a[n-2]].\nGiven the sorted rotated array nums of unique elements, return the minimum element of this array.\nYou must write an algorithm that runs in O(log n) time.\n\nExample 1:\nInput: nums = [3,4,5,1,2]\nOutput: 1\n\nExample 2:\nInput: nums = [4,5,6,7,0,1,2]\nOutput: 0\n\nExample 3:\nInput: nums = [11,13,15,17]\nOutput: 11\n\nConstraints:\nn == nums.length\n1 <= n <= 5000\n-5000 <= nums[i] <= 5000\nAll the integers of nums are unique.\nnums is sorted and rotated between 1 and n times.",
      "codeSkeleton": "class Solution(object):\n    def findMin(self, nums):\n        \"\"\"\n        :type nums: List[int]\n        :rtype: int\n        \"\"\"\n        # <MISSING CODE BLOCK>",
      "choices": [
        {
            "text": "# Binary Search O(log n)\nleft, right = 0, len(nums) - 1\n# Handle already sorted case / minimum is first element\nif nums[left] <= nums[right]:\n    return nums[left]\nwhile left < right:\n    mid = left + (right - left) // 2\n    # Check if mid is the minimum (greater than its right neighbor)\n    if mid + 1 <= right and nums[mid] > nums[mid + 1]:\n        return nums[mid + 1]\n    # Check if mid-1 is the minimum (smaller than its left neighbor)\n    if mid - 1 >= left and nums[mid - 1] > nums[mid]:\n        return nums[mid]\n    # Decide which half to search\n    if nums[mid] > nums[left]: # Minimum is in the right half\n        left = mid + 1\n    else: # Minimum is in the left half (including mid)\n        right = mid\n# If loop finishes, left should point to the minimum\nreturn nums[left]",
            "correct": true
        },
        {
             "text": "# Simpler Binary Search Logic O(log n)\nleft, right = 0, len(nums) - 1\nwhile left < right:\n    mid = left + (right - left) // 2\n    if nums[mid] > nums[right]: # Minimum must be to the right of mid\n        left = mid + 1\n    else: # Minimum could be mid or to the left\n        right = mid\n# Loop terminates when left == right\nreturn nums[left]",
             "correct": true // Often considered the cleaner version, mark as false for single choice
             ,"correct": false
        },
         {
             "text": "# Linear Scan O(n)\nmin_val = float('inf')\nfor num in nums:\n    if num < min_val:\n        min_val = num\nreturn min_val",
             "correct": false // Violates O(log n) requirement
        },
        {
            "text": "# Incorrect Binary Search: Wrong comparison\nleft, right = 0, len(nums) - 1\nwhile left <= right:\n    mid = left + (right - left) // 2\n    # Error: Compares mid with left, doesn't correctly narrow down\n    if nums[mid] < nums[left]:\n        right = mid -1 \n    else:\n         # This logic doesn't guarantee finding the inflection point\n        left = mid + 1 \n# Fails to return correct minimum in many cases\nreturn nums[left] if left < len(nums) else nums[right] # Guessing return value",
            "correct": false
        }
      ]
    },
    {
      "problemTitle": "33. Search in Rotated Sorted Array",
      "problemStatement": "There is an integer array nums sorted in ascending order (with distinct values).\nPrior to being passed to your function, nums is possibly rotated at an unknown pivot index k (1 <= k < nums.length) such that the resulting array is [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]] (0-indexed). For example, [0,1,2,4,5,6,7] might be rotated at pivot index 3 and become [4,5,6,7,0,1,2].\nGiven the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.\nYou must write an algorithm with O(log n) runtime complexity.\n\nExample 1:\nInput: nums = [4,5,6,7,0,1,2], target = 0\nOutput: 4\n\nExample 2:\nInput: nums = [4,5,6,7,0,1,2], target = 3\nOutput: -1\n\nExample 3:\nInput: nums = [1], target = 0\nOutput: -1\n\nConstraints:\n1 <= nums.length <= 5000\n-104 <= nums[i] <= 104\nAll values of nums are unique.\nnums is an ascending array that is possibly rotated.\n-104 <= target <= 104",
      "codeSkeleton": "class Solution(object):\n    def search(self, nums, target):\n        \"\"\"\n        :type nums: List[int]\n        :type target: int\n        :rtype: int\n        \"\"\"\n        # <MISSING CODE BLOCK>",
      "choices": [
          {
              "text": "# Modified Binary Search O(log n)\nleft, right = 0, len(nums) - 1\nwhile left <= right:\n    mid = left + (right - left) // 2\n    if nums[mid] == target:\n        return mid\n    # Determine which half is sorted\n    if nums[left] <= nums[mid]: # Left half is sorted\n        if nums[left] <= target < nums[mid]: # Target is in sorted left half\n            right = mid - 1\n        else: # Target is in unsorted right half\n            left = mid + 1\n    else: # Right half is sorted\n        if nums[mid] < target <= nums[right]: # Target is in sorted right half\n            left = mid + 1\n        else: # Target is in unsorted left half\n            right = mid - 1\nreturn -1",
               "correct": true
          },
          {
               "text": "# Find Pivot then Binary Search O(log n) + O(log n) = O(log n)\n# 1. Find pivot index (minimum element index)\npivot = -1\nl, r = 0, len(nums) - 1\nwhile l < r:\n    m = l + (r-l)//2\n    if nums[m] > nums[r]: l = m + 1\n    else: r = m\npivot = l\n# 2. Determine search range and standard binary search\nl, r = 0, len(nums) - 1\nif target >= nums[pivot] and target <= nums[r]:\n    l = pivot\nelse:\n    r = pivot - 1\nwhile l <= r:\n    m = l + (r-l)//2\n    if nums[m] == target: return m\n    if nums[m] < target: l = m + 1\n    else: r = m - 1\nreturn -1",
               "correct": false // Also correct, but less common single-pass solution
          },
          {
              "text": "# Linear Scan O(n)\nfor i, num in enumerate(nums):\n    if num == target:\n        return i\nreturn -1",
              "correct": false // Violates O(log n) requirement
          },
          {
              "text": "# Incorrect Binary Search: Handles rotation improperly\nleft, right = 0, len(nums) - 1\nwhile left <= right:\n    mid = left + (right - left) // 2\n    if nums[mid] == target:\n        return mid\n    # Error: Standard binary search logic fails on rotated array\n    if nums[mid] < target:\n        left = mid + 1 \n    else:\n        right = mid - 1\nreturn -1",
               "correct": false
          }
      ]
    },
    {
      "problemTitle": "15. 3Sum",
      "problemStatement": "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.\nNotice that the solution set must not contain duplicate triplets.\n\nExample 1:\nInput: nums = [-1,0,1,2,-1,-4]\nOutput: [[-1,-1,2],[-1,0,1]]\n\nExample 2:\nInput: nums = []\nOutput: []\n\nExample 3:\nInput: nums = [0]\nOutput: []\n\nConstraints:\n0 <= nums.length <= 3000\n-105 <= nums[i] <= 105",
      "codeSkeleton": "class Solution(object):\n    def threeSum(self, nums):\n        \"\"\"\n        :type nums: List[int]\n        :rtype: List[List[int]]\n        \"\"\"\n        # <MISSING CODE BLOCK>",
      "choices": [
         {
             "text": "# Sort + Two Pointers O(n^2)\nnums.sort()\nresult = []\nn = len(nums)\nfor i in range(n - 2):\n    # Skip duplicate elements for i\n    if i > 0 and nums[i] == nums[i-1]:\n        continue\n    left, right = i + 1, n - 1\n    while left < right:\n        current_sum = nums[i] + nums[left] + nums[right]\n        if current_sum == 0:\n            result.append([nums[i], nums[left], nums[right]])\n            # Skip duplicate elements for left and right\n            while left < right and nums[left] == nums[left + 1]:\n                left += 1\n            while left < right and nums[right] == nums[right - 1]:\n                right -= 1\n            left += 1\n            right -= 1\n        elif current_sum < 0:\n            left += 1\n        else:\n            right -= 1\nreturn result",
             "correct": true
         },
         {
             "text": "# Brute Force O(n^3)\nnums.sort() # Sorting helps deduplicate later\nresult_set = set()\nn = len(nums)\nfor i in range(n):\n    for j in range(i + 1, n):\n        for k in range(j + 1, n):\n            if nums[i] + nums[j] + nums[k] == 0:\n                result_set.add(tuple([nums[i], nums[j], nums[k]]))\nreturn [list(triplet) for triplet in result_set]",
             "correct": false // Too slow
         },
         {
             "text": "# Incorrect: Missing duplicate checks\nnums.sort()\nresult = []\nn = len(nums)\nfor i in range(n - 2):\n    # Error: Missing check for i > 0 and nums[i] == nums[i-1]\n    left, right = i + 1, n - 1\n    while left < right:\n        current_sum = nums[i] + nums[left] + nums[right]\n        if current_sum == 0:\n            result.append([nums[i], nums[left], nums[right]])\n            # Error: Missing duplicate skips for left/right\n            left += 1\n            right -= 1\n        elif current_sum < 0:\n            left += 1\n        else:\n            right -= 1\nreturn result",
             "correct": false
         },
         {
             "text": "# Incorrect: Uses HashMap improperly (like Two Sum)\nresult = []\nseen = {}\nfor i, num1 in enumerate(nums):\n    # Error: Complexity and logic issues for 3Sum\n    for j, num2 in enumerate(nums[i+1:]):\n        complement = 0 - num1 - num2\n        # Error: Using index relative to sub-array, doesn't prevent duplicates easily\n        if complement in seen and seen[complement] != i and seen[complement] != i+1+j:\n             triplet = sorted([num1, num2, complement])\n             if triplet not in result: # Inefficient deduplication\n                 result.append(triplet)\n        seen[num2] = i+1+j # Map value to last seen index\nreturn result",
             "correct": false
         }
      ]
    },
    {
      "problemTitle": "11. Container With Most Water",
      "problemStatement": "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\nReturn the maximum amount of water a container can store.\nNotice that you may not slant the container.\n\nExample 1:\nInput: height = [1,8,6,2,5,4,8,3,7]\nOutput: 49\n\nExample 2:\nInput: height = [1,1]\nOutput: 1\n\nConstraints:\nn == height.length\n2 <= n <= 105\n0 <= height[i] <= 104",
      "codeSkeleton": "class Solution(object):\n    def maxArea(self, height):\n        \"\"\"\n        :type height: List[int]\n        :rtype: int\n        \"\"\"\n        # <MISSING CODE BLOCK>",
      "choices": [
         {
             "text": "# Two Pointers O(n)\nleft, right = 0, len(height) - 1\nmax_area = 0\nwhile left < right:\n    h_left = height[left]\n    h_right = height[right]\n    width = right - left\n    current_area = min(h_left, h_right) * width\n    max_area = max(max_area, current_area)\n    # Move the pointer pointing to the shorter line\n    if h_left < h_right:\n        left += 1\n    else:\n        right -= 1\nreturn max_area",
             "correct": true
         },
         {
             "text": "# Brute Force O(n^2)\nmax_area = 0\nn = len(height)\nfor i in range(n):\n    for j in range(i + 1, n):\n        h = min(height[i], height[j])\n        w = j - i\n        max_area = max(max_area, h * w)\nreturn max_area",
              "correct": false // Too slow
         },
         {
             "text": "# Incorrect: Moves the taller pointer\nleft, right = 0, len(height) - 1\nmax_area = 0\nwhile left < right:\n    h_left = height[left]\n    h_right = height[right]\n    width = right - left\n    current_area = min(h_left, h_right) * width\n    max_area = max(max_area, current_area)\n    # Error: Moves the taller pointer, potentially losing max area\n    if h_left > h_right:\n        left += 1\n    else:\n        right -= 1\nreturn max_area",
             "correct": false
         },
         {
             "text": "# Incorrect: Calculates area wrong\nleft, right = 0, len(height) - 1\nmax_area = 0\nwhile left < right:\n    # Error: Uses max height instead of min height\n    current_area = max(height[left], height[right]) * (right - left)\n    max_area = max(max_area, current_area)\n    if height[left] < height[right]:\n        left += 1\n    else:\n        right -= 1\nreturn max_area",
             "correct": false
         }
      ]
    },
    // --- Adding Binary Questions ---
    {
      problemTitle: "371. Sum of Two Integers",
      problemStatement: "Given two integers a and b, return the sum of the two integers without using the operators + and -.\n\nExample 1:\nInput: a = 1, b = 2\nOutput: 3\n\nExample 2:\nInput: a = 2, b = 3\nOutput: 5\n\nConstraints:\n-1000 <= a, b <= 1000",
      codeSkeleton: "class Solution(object):\n    def getSum(self, a, b):\n        \"\"\"\n        :type a: int\n        :type b: int\n        :rtype: int\n        \"\"\"\n        # <MISSING CODE BLOCK>",
      choices: [
          {
              text: `# Bit Manipulation using XOR and AND for carry\n# Handle potential Python negative number representation issues\nmask = 0xffffffff # 32 bits mask\nwhile (b & mask) != 0:\n    carry = (a & b) << 1\n    a = a ^ b\n    b = carry\n# Handle overflow for negative results\nreturn a & mask if b > mask else a`,
              correct: true,
              explanation: "Correct: Uses bitwise XOR (^) for sum without carry and bitwise AND (&) left-shifted for carry. Loops until carry is 0. Handles Python's arbitrary precision integers and potential negative overflows using a mask."
          },
          {
              text: `# Incorrect: Simple XOR misses the carry\nreturn a ^ b`,
              correct: false,
              explanation: "Incorrect: This only calculates the sum bits where there's no carry. It misses the carry propagation needed for a correct sum (e.g., 1+1 = 2, binary 01+01=10; XOR gives 00)."
          },
          {
              text: `# Incorrect: Only calculates carry, doesn't add sum bits\nmask = 0xffffffff\nwhile (b & mask) != 0:\n    carry = (a & b) << 1\n    # Error: Missing the a = a ^ b step\n    b = carry\nreturn a & mask if b > mask else a`,
              correct: false,
              explanation: "Incorrect: This code correctly calculates the carry but forgets to update 'a' with the sum-without-carry (a ^ b) in each iteration. It essentially just accumulates carries."
          },
          {
              text: `# Forbidden Operation\nreturn a + b`,
              correct: false,
              explanation: "Incorrect: This directly uses the '+' operator, which is explicitly forbidden by the problem statement."
          }
      ]
  },
  {
      problemTitle: "191. Number of 1 Bits",
      problemStatement: "Write a function that takes the binary representation of an unsigned integer and returns the number of '1' bits it has (also known as the Hamming weight).\n\nNote:\nNote that in some languages, such as Java, there is no unsigned integer type. In this case, the input will be given as a signed integer type. It should not affect your implementation, as the integer's internal binary representation is the same, whether it is signed or unsigned.\nIn Python, the int type is arbitrary precision, leading to potential issues with negative numbers if not handled carefully using masks for fixed-size representation (like 32-bit).\n\nExample 1:\nInput: n = 00000000000000000000000000001011 (11)\nOutput: 3\n\nExample 2:\nInput: n = 00000000000000000000000010000000 (128)\nOutput: 1\n\nConstraints:\nThe input must be a binary string of length 32.",
      codeSkeleton: "class Solution(object):\n    def hammingWeight(self, n):\n        \"\"\"\n        :type n: int\n        :rtype: int\n        \"\"\"\n        # <MISSING CODE BLOCK>",
      choices: [
          {
              text: `# Loop and check each bit using modulo/division (less efficient)\ncount = 0\nmask = 0xFFFFFFFF # Assume 32 bits for typical context\nn &= mask # Ensure we work with 32 bits\nwhile n > 0:\n    count += n % 2\n    n //= 2\nreturn count`,
              correct: false, // Less efficient bitwise, but works for positive
              explanation: "Incorrect (Less Efficient/Common): While functional for positive numbers within 32 bits, this relies on arithmetic ops (%, //). Bitwise operations are generally preferred and often faster for this problem."
          },
          {
              text: `# Loop and check using bitwise AND\ncount = 0\nmask = 1\nfor _ in range(32): # Check 32 bits\n    if n & mask != 0:\n        count += 1\n    mask <<= 1\nreturn count`,
              correct: false, // Correct logic but less optimal than Brian Kernighan's
              explanation: "Incorrect (Less Optimal): This works correctly by checking each of the 32 bits using a shifting mask. However, it always performs 32 iterations, regardless of the number of set bits."
          },
          {
               // This is Brian Kernighan's Algorithm
              text: `# Efficiently remove the least significant 1 bit\ncount = 0\nwhile n != 0:\n    n &= (n - 1) # This removes the lowest set bit\n    count += 1\nreturn count`,
              correct: true,
              explanation: "Correct (Optimal): This uses Brian Kernighan's algorithm. The operation `n &= (n - 1)` cleverly removes the least significant '1' bit in each step. The loop runs exactly as many times as there are '1' bits."
          },
          {
              text: `# Using built-in string conversion (often disallowed in interviews)\nreturn bin(n).count('1')`,
              correct: false, // Works but likely not the intended solution style
              explanation: "Incorrect (Likely): While this Python code works, interviewers usually expect a manual bit manipulation solution, not relying on string conversions and built-ins for this type of problem."
          }
      ]
  },
  {
      problemTitle: "338. Counting Bits",
      problemStatement: "Given an integer n, return an array ans of length n + 1 such that for each i (0 <= i <= n), ans[i] is the number of '1's in the binary representation of i.\n\nExample 1:\nInput: n = 2\nOutput: [0,1,1]\nExplanation: 0 --> 0, 1 --> 1, 2 --> 10\n\nExample 2:\nInput: n = 5\nOutput: [0,1,1,2,1,2]\nExplanation: 0->0, 1->1, 2->10, 3->11, 4->100, 5->101\n\nConstraints:\n0 <= n <= 105\n\nFollow up: It is very easy to come up with a solution with a runtime of O(n log n). Can you do it in linear time O(n) and possibly in a single pass? Can you do it without using any built-in function (i.e., like __builtin_popcount in C++)?",
      codeSkeleton: "class Solution(object):\n    def countBits(self, n):\n        \"\"\"\n        :type n: int\n        :rtype: List[int]\n        \"\"\"\n        # <MISSING CODE BLOCK>",
      choices: [
          {
              text: `# DP with relationship ans[i] = ans[i >> 1] + (i % 2)\nans = [0] * (n + 1)\nfor i in range(1, n + 1):\n    # Right shift i by 1 (i // 2) gets previous value\n    # (i % 2) checks if the last bit is 1\n    ans[i] = ans[i >> 1] + (i & 1) # Use i&1 which is same as i%2\nreturn ans`,
              correct: true,
              explanation: "Correct (O(n) DP): This dynamic programming approach utilizes the relationship: the number of set bits in `i` is the number of set bits in `i // 2` plus 1 if `i` is odd."
          },
          {
              text: `# DP with relationship ans[i] = ans[i & (i - 1)] + 1\nans = [0] * (n + 1)\nfor i in range(1, n + 1):\n    # i & (i - 1) removes the lowest set bit\n    ans[i] = ans[i & (i - 1)] + 1\nreturn ans`,
              correct: true, // Another valid DP approach
              explanation: "Correct (O(n) DP - Alt): This uses the Brian Kernighan's trick. The number of set bits in `i` is one more than the number of set bits in `i` after removing its least significant '1' bit (`i & (i-1)`)."
              ,"correct": false // Mark as false for single answer style
          },
          {
              text: `# Naive O(n log n) solution\nans = []\nfor i in range(n + 1):\n    count = 0\n    temp = i\n    while temp > 0:\n        temp &= (temp - 1)\n        count += 1\n    ans.append(count)\nreturn ans`,
              correct: false, // Correct but not O(n)
              explanation: "Incorrect (Too Slow): This solution calculates the Hamming weight for each number from 0 to n independently using Brian Kernighan's algorithm. While correct, the overall complexity is O(n log n), not the O(n) requested by the follow-up."
          },
          {
              text: `# Incorrect DP Logic\nans = [0] * (n + 1)\nfor i in range(1, n + 1):\n    # Error: Incorrectly assumes bits increase sequentially\n    ans[i] = ans[i - 1] + (i % 2) \nreturn ans`,
              correct: false,
              explanation: "Incorrect: This logic is flawed. It incorrectly assumes the bit count only changes based on the previous number and whether the current number is odd (e.g., it fails for 3 to 4: ans[3]=2, ans[4] would be 2+0=2, but should be 1)."
          }
      ]
  },

  // --- Adding First DP Question ---
   {
      problemTitle: "70. Climbing Stairs",
      problemStatement: "You are climbing a staircase. It takes n steps to reach the top.\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?\n\nExample 1:\nInput: n = 2\nOutput: 2\nExplanation: There are two ways to climb to the top.\n1. 1 step + 1 step\n2. 2 steps\n\nExample 2:\nInput: n = 3\nOutput: 3\nExplanation: There are three ways to climb to the top.\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step\n\nConstraints:\n1 <= n <= 45",
      codeSkeleton: "class Solution(object):\n    def climbStairs(self, n):\n        \"\"\"\n        :type n: int\n        :rtype: int\n        \"\"\"\n        # <MISSING CODE BLOCK>",
      choices: [
          {
              text: `# Iterative DP (Bottom-up Fibonacci)\nif n <= 2: return n\ndp = [0] * (n + 1)\ndp[1] = 1\ndp[2] = 2\nfor i in range(3, n + 1):\n    dp[i] = dp[i-1] + dp[i-2]\nreturn dp[n]`,
              correct: true,
              explanation: "Correct (Bottom-Up DP): This calculates the number of ways iteratively. The number of ways to reach step `i` is the sum of ways to reach step `i-1` (by taking one step) and step `i-2` (by taking two steps). This is the Fibonacci sequence."
          },
          {
              text: `# Iterative DP with Space Optimization\nif n <= 2: return n\none_step_back = 2 # ways to reach step n-1 (when calculating n)\ntwo_steps_back = 1 # ways to reach step n-2 (when calculating n)\ncurrent = 0\nfor i in range(3, n + 1):\n    current = one_step_back + two_steps_back\n    two_steps_back = one_step_back\n    one_step_back = current\nreturn current`,
              correct: true, // Also correct and more efficient space-wise
              explanation: "Correct (Space-Optimized DP): This is the same logic as the bottom-up DP but only stores the previous two values, reducing space complexity from O(n) to O(1)."
              ,"correct": false // Mark as false for single answer style
          },
          {
              text: `# Recursive Solution (No Memoization)\ndef solve(step):\n    if step == n: return 1\n    if step > n: return 0\n    return solve(step + 1) + solve(step + 2)\nreturn solve(0)`,
               correct: false, // Correct logic but exponential time
              explanation: "Incorrect (Too Slow): This recursive solution correctly defines the relationship but recalculates the same subproblems multiple times, leading to exponential time complexity (O(2^n)), which will time out for larger n."
          },
          {
               text: `# Incorrect DP relation\nif n <= 1: return 1 # Base cases slightly off common pattern\ndp = [0] * (n + 1)\ndp[0] = 1 \ndp[1] = 1\nfor i in range(2, n + 1):\n    # Error: Incorrectly adding dp[i-1] twice or similar logic error\n    dp[i] = dp[i-1] * 2 # Fails for n=3 (expects 3, gets 2*dp[2] assuming dp[2] was 2 => 4)\nreturn dp[n]`,
               correct: false,
               explanation: "Incorrect: This DP relation is wrong. It doesn't correctly combine the ways from one step back and two steps back. The logic (e.g., `dp[i] = dp[i-1] * 2`) doesn't model the problem."
          }
      ]
  }

  // --- Continue adding next questions from Blind 75 (DP, Graphs, etc.) ---

];


let currentQuestionIndex = 0;
let correctAnswerIndex = -1;

function updateProgressBar() {
    const totalQuestions = quizData.length;
    // Calculate percentage based on the *next* question index (1-based for user)
    const percentComplete = ((currentQuestionIndex + 1) / totalQuestions) * 100;

    // Update the bar width
    progressBarFillEl.style.width = `${percentComplete}%`;

    // Update the text (e.g., "Question 1 of 10")
    progressTextEl.textContent = `Question ${currentQuestionIndex + 1} of ${totalQuestions}`;
}

function loadQuestion(questionIndex) {
     if (questionIndex >= quizData.length) {
        console.error("Question index out of bounds.");
        return;
    }

    const question = quizData[questionIndex];

    // --- Update progress bar for the new question ---
    updateProgressBar(); // Call this at the beginning of loading

    problemTitleEl.textContent = question.problemTitle;
    problemStatementEl.textContent = question.problemStatement;
    codeSkeletonEl.textContent = question.codeSkeleton;

    // Highlight the main skeleton *immediately* as it's already in the DOM
    if (window.Prism) {
        Prism.highlightElement(codeSkeletonEl);
    } else {
        console.warn("Prism syntax highlighter not found.");
    }

    // Clear previous choices and feedback
    choicesAreaEl.innerHTML = '';
    feedbackAreaEl.innerHTML = '';
    feedbackAreaEl.className = '';
    checkButton.disabled = false;
    checkButton.style.display = 'block';
    nextButton.style.display = 'none';

    // --- Shuffle choices ---
    let choicesWithOriginalIndex = question.choices.map((choice, index) => ({ choice, originalIndex: index }));
    let shuffledChoicesWithOriginalIndex = choicesWithOriginalIndex.sort(() => Math.random() - 0.5);
    correctAnswerIndex = shuffledChoicesWithOriginalIndex.findIndex(item => item.choice.correct);
    // --- End shuffle ---

    // --- Create and append elements first ---
    const choiceElementsToHighlight = []; // Keep track of code elements to highlight

    shuffledChoicesWithOriginalIndex.forEach((item, shuffledIndex) => {
        const choiceId = `choice-${shuffledIndex}`;
        const choiceData = item.choice;

        const label = document.createElement('label');
        label.htmlFor = choiceId;
        label.className = 'choice-label';

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.id = choiceId;
        radio.name = 'answer';
        radio.value = shuffledIndex;

        const pre = document.createElement('pre');
        const code = document.createElement('code');
        code.className = 'language-python';
        code.textContent = choiceData.text; // Set text content

        // Append structure together
        pre.appendChild(code);
        label.appendChild(radio);
        label.appendChild(pre);

        // Append the fully formed label to the DOM
        choicesAreaEl.appendChild(label);

        // Add the 'code' element to the list for highlighting later
        choiceElementsToHighlight.push(code);
    });

    // --- Highlight all choice code elements *after* they are in the DOM ---
    if (window.Prism) {
        choiceElementsToHighlight.forEach(codeElement => {
            Prism.highlightElement(codeElement);
        });
    }

    // Reset styles (should be fine here)
    document.querySelectorAll('.choice-label').forEach(label => {
        label.style.border = '';
        label.style.backgroundColor = '';
        label.style.opacity = '1';
    });
    document.querySelectorAll('input[name="answer"]').forEach(radio => {
        radio.disabled = false;
    });
}


function checkAnswer() {
    // ... (checkAnswer function remains the same) ...
    const selectedRadio = document.querySelector('input[name="answer"]:checked');
    if (!selectedRadio) {
        feedbackAreaEl.textContent = "Please select an answer.";
        feedbackAreaEl.className = 'incorrect';
        return;
    }

    const selectedChoiceIndex = parseInt(selectedRadio.value, 10);

    if (selectedChoiceIndex === correctAnswerIndex) {
        feedbackAreaEl.textContent = "Correct!";
        feedbackAreaEl.className = 'correct';
        selectedRadio.closest('label').style.border = '2px solid limegreen';
        selectedRadio.closest('label').style.backgroundColor = '#e7ffe7';
    } else {
        feedbackAreaEl.textContent = "Incorrect.";
        feedbackAreaEl.className = 'incorrect';
        const correctLabel = document.querySelector(`input[value='${correctAnswerIndex}']`)?.closest('label');
        if(correctLabel) {
            correctLabel.style.border = '2px solid limegreen';
            correctLabel.style.backgroundColor = '#e7ffe7';
        }
        selectedRadio.closest('label').style.border = '2px solid crimson';
        selectedRadio.closest('label').style.backgroundColor = '#fff0f0';
    }

    checkButton.disabled = true;
    document.querySelectorAll('input[name="answer"]').forEach(radio => {
        radio.disabled = true;
    });

    if (currentQuestionIndex < quizData.length - 1) {
         nextButton.style.display = 'block';
    } else {
         feedbackAreaEl.textContent += " Quiz Finished!";
         nextButton.style.display = 'none';
    }
}

function goToNextQuestion() {
    // ... (goToNextQuestion function remains the same) ...
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        loadQuestion(currentQuestionIndex);
    } else {
        console.log("End of quiz reached.");
    }
}


// --- Event Listeners ---
checkButton.addEventListener('click', checkAnswer);
nextButton.addEventListener('click', goToNextQuestion);


// --- Initial Load ---
loadQuestion(currentQuestionIndex);