import {useEffect} from 'react';
import {injector} from './lib/injector';

interface Props {
    url: string;
    [key: string]: string | number;
}

export const HandySvg = (props: Props) => {
    const {url, ...restProps} = props;

    useEffect(() => {
        injector.load(url);
    }, []);

    useEffect(() => {
        injector.load(url, {isImmediate: true});
    }, [url]);

    return (
        <svg {...restProps}>
            <use xlinkHref={`#${injector.getId(url)}`} />
        </svg>
    )
};
