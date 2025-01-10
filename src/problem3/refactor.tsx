import {usePrices, useWalletBalances, WalletRow} from "./fake";
import {ReactNode, useMemo} from 'react'

export type BoxProps = {
    classes?: {
        row?: string;
    }
}


interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: string;
    id: string;
}

interface Props extends BoxProps {
    children: ReactNode
}

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

const filterBalancesWithAmount = (balances: WalletBalance[]): WalletBalance[] =>
    balances.filter((balance) => balance.amount > 0);

const compareByBlockchainPriority = (a: WalletBalance, b: WalletBalance): number => {
    return (getPriority(b.blockchain) - getPriority(a.blockchain));
};

export const WalletPage = (props: Props) => {
    const {children, classes, ...rest} = props;
    const balances = useWalletBalances();
    const prices = usePrices();

    const sortedBalances = useMemo(() => {
        const filteredBalances = filterBalancesWithAmount(balances);
        return filteredBalances.sort(compareByBlockchainPriority);
    }, [balances]);

    return (
        <div {...rest}>
            {sortedBalances.map((balance: WalletBalance) => (
                <WalletRow
                    className={classes?.row ?? ''}
                    key={balance.id}
                    amount={balance.amount}
                    usdValue={prices[balance.currency] * balance.amount}
                    formattedAmount={balance.amount.toFixed()}
                />
            ))}
        </div>
    )
}