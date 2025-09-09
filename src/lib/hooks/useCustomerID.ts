// hooks/useCustomerId.ts
import { useMemo } from 'react';
import { useParams } from 'next/navigation';

export const useCustomerId = () => {
    const params = useParams();

    const customerId = useMemo(() => {
        const param = params["customer-profile"];
        console.log("Raw param:", param, "Type:", typeof param);

        if (!param) {
            console.log("No customer-profile param found");
            return null;
        }

        const id = parseInt(param as string);
        console.log("Parsed customer ID:", id);
        return isNaN(id) ? null : id;
    }, [params]);

    return customerId;
};