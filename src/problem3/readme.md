# Refactoring `WalletPage` Component

This document outlines the step-by-step process and key transformations performed while refactoring the `WalletPage` component from `old.tsx` to `refactor.tsx`.

---

### 1. **Purpose of Refactoring**
The purpose of the refactor was to:
- **Improve readability and maintainability** of the code.
- Reduce **duplication** by extracting common logic into reusable functions.
- Simplify and properly type utilities to ensure **clear business logic**.
- Enhance **typing** and adhere to TypeScript best practices.
- Ensure **better separation of concerns** while preserving component functionality.

---

### 2. **Steps in the Refactoring Process**

#### **Step 1: Extracted Reusable Utilities**
- Extracted **priority calculation logic** (`getPriority`) into a standalone function.
    - In `old.tsx`, the priority logic was part of the `WalletPage` component. The standalone function is now reusable and avoids duplication.
    - The priority values were replaced with a `BLOCKCHAIN_PRIORITIES` constant and a function `getPriority`.

  ```typescript
  const BLOCKCHAIN_PRIORITIES: Record<string, number> = {
      Osmosis: 100,
      Ethereum: 50,
      Arbitrum: 30,
      Zilliqa: 20,
      Neo: 20
  };

  const getPriority = (blockchain: string): number => {
      return BLOCKCHAIN_PRIORITIES[blockchain] ?? -99;
  };
  ```

#### **Step 2: Simplified Filtering Logic**
- Refactored the logic for filtering balances with amounts greater than `0`.
    - Replaced the complex conditions in `old.tsx` with a clear and direct `filterBalancesWithAmount` function:

      ```typescript
      const filterBalancesWithAmount = (balances: WalletBalance[]): WalletBalance[] => 
          balances.filter((balance) => balance.amount > 0);
      ```

#### **Step 3: Simplified Sorting Logic**
- Simplified the sorting logic by separating priority decisions into a reusable `compareByBlockchainPriority` function:

    ```typescript
    const compareByBlockchainPriority = (a: WalletBalance, b: WalletBalance): number => {
        return getPriority(b.blockchain) - getPriority(a.blockchain);
    };
    ```

- The `useMemo` logic for sorting balances now composes the filtering and sorting in a clean and readable manner:

    ```typescript
    const sortedBalances = useMemo(() => {
        const filteredBalances = filterBalancesWithAmount(balances);
        return filteredBalances.sort(compareByBlockchainPriority);
    }, [balances]);
    ```

#### **Step 4: Removed Redundant Variables**
- Removed unused variables (`formattedBalances` and `rows`) from `old.tsx` as these were redundant. Now, formatting happens inline while rendering rows.

#### **Step 5: Simplified Props and Children Handling**
- Simplified the handling of children and props. Added optional `classes` with better typing using the `BoxProps` type, allowing for cleaner component extension.

#### **Step 6: Improved Typing**
- Properly typed the `WalletBalance` interface with the `blockchain` field and improved component props with the `Props` interface.
- Used `ReactNode` for typing `children`.

#### **Step 7: Cleaned Up Rendering Logic**
- In `refactor.tsx`, rows are directly created within the `return` statement. This simplifies how rows are rendered, making the code easier to follow:

    ```typescript
    {sortedBalances.map((balance: WalletBalance) => (
        <WalletRow
            className={classes?.row ?? ''}
            key={balance.id}
            amount={balance.amount}
            usdValue={prices[balance.currency] * balance.amount}
            formattedAmount={balance.amount.toFixed()} />
    ))}
    ```

#### **Step 8: Improved Readability**
- Code readability was significantly improved by breaking down complex logic into small, reusable, and well-named functions:
    - `filterBalancesWithAmount`
    - `compareByBlockchainPriority`
    - `getPriority`
- This separation of logic ensures clarity and testability.

---

### 3. **Key Changes Summary**
| **Feature**                | **`old.tsx`**                                                                | **`refactor.tsx`**                                                        |
|----------------------------|-----------------------------------------------------------------------------|---------------------------------------------------------------------------|
| **Priority Calculation**   | Inline `switch` case inside `getSortedBalances`.                            | Extracted into `BLOCKCHAIN_PRIORITIES` and `getPriority` function.        |
| **Filtering Logic**        | Nested `if` conditions inside useMemo.                                      | Extracted into `filterBalancesWithAmount` function.                      |
| **Sorting Logic**          | Inline nested `sort` logic.                                                 | Replaced with `compareByBlockchainPriority` function.                    |
| **Props Handling**         | Implicit usage of `props.classes.row`.                                       | Explicitly implemented optional props `classes` and improved typings.    |
| **Formatted Amount Logic** | Calculated and stored in `formattedBalances`, then reused in `rows`.         | Directly calculated inline while rendering rows in JSX.                  |
| **Component Simplification**| Complex and redundant assignments for filtered, sorted, and formatted data. | Streamlined data transformation with simple utilities and single flow.   |

---

### 4. **How to Use the Refactored Component**
1. Import the `WalletPage` component as usual:

    ```typescript
    import { WalletPage } from './refactor';
    ```

2. Pass in the appropriate props:
    ```typescript
    <WalletPage
        classes={{ row: 'custom-row-class' }}
    >
        {/* Additional children here */}
    </WalletPage>
    ```

3. The component will now:
    - Filter wallet balances with amounts greater than `0`.
    - Sort balances based on the predefined blockchain priority.
    - Render rows with `WalletRow` including calculated `usdValue` and `formattedAmount`.

---

This structured approach ensures that the `WalletPage` component is cleaner, functionally consistent, and easier to maintain.