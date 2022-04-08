import React, {useRef, useEffect} from 'react';
import {injector} from './lib/injector';

interface Props {
    url: string;
    loadTimeot?: number;
    loadRetryCount?: number;
    [key: string]: string | number | undefined;
}

export const HandySvg = (props: Props) => {
    const {url, loadTimeot, loadRetryCount, ...restProps} = props;
    const isFirstRun = useRef(true);

    useEffect(() => {
        if (isFirstRun.current) {
            injector.load(
                url,
                {timeout: loadTimeot, retryCount: loadRetryCount}
            );

            isFirstRun.current = false;
            return;
        }

        injector.load(
            url,
            {timeout: loadTimeot, retryCount: loadRetryCount, flushImmediate: true}
        );
    }, [url]);

    return (
        <svg {...restProps}>
            <use xlinkHref={`#${injector.getId(url)}`} />
        </svg>
    )
};
