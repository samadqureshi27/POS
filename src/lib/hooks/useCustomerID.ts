// hooks/useCustomerId.ts
import { useMemo } from 'react';
import { useParams } from 'next/navigation';

export const useCustomerId = () => {
    const params = useParams();

    const customerId = useMemo(() => {
        const param = params["customer-profile"];

        if (!param) {
            return null;
        }

        const id = parseInt(param as string);
        return isNaN(id) ? null : id;
    }, [params]);

    return customerId;
};