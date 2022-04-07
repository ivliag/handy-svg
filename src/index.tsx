import React, {useRef, useEffect} from 'react';
import {injector} from './lib/injector';

interface Props {
    src: string;
    loadTimeot?: number;
    loadRetryCount?: number;
    [key: string]: string | number | undefined;
}

export const HandySvg = (props: Props) => {
    const {src, loadTimeot, loadRetryCount, ...restProps} = props;
    const isFirstRun = useRef(true);

    useEffect(() => {
        if (isFirstRun.current) {
            injector.load(
                src,
                {timeout: loadTimeot, retryCount: loadRetryCount}
            );

            isFirstRun.current = false;
            return;
        }

        injector.load(
            src,
            {timeout: loadTimeot, retryCount: loadRetryCount, flushImmediate: true}
        );
    }, [src]);

    return (
        <svg {...restProps}>
            <use xlinkHref={`#${injector.getId(src)}`} />
        </svg>
    )
};
