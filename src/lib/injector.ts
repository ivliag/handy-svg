import debounce from 'lodash.debounce';
import {fetchSvg} from './fetcher';
import {extractFileName} from './utils';

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

const INJECTION_DELAY = 20;

class Injector {
    private fragment: DocumentFragment | null = null;

    private symbolsMountingPoint: SVGElement;

    private cache = new Set();

    private parseSvgString(svg: string) {
        return new DOMParser().parseFromString(svg, 'image/svg+xml').children[0];
    }

    private svgToSymbol({id, svgString}: {id: string; svgString: string}): SVGElement {
        const svgDocument = this.parseSvgString(svgString);
        const viewBox = svgDocument!.getAttribute('viewBox');
        const symbol = document.createElementNS(SVG_NAMESPACE, 'symbol');

        if (viewBox) {
            symbol.setAttributeNS(null, 'viewBox', viewBox);
        }

        symbol.setAttributeNS(null, 'id', id);
        symbol.innerHTML = svgDocument!.innerHTML;

        return symbol;
    }

    private accumulateSvg = ({url, svgString}: {url: string, svgString: string}) => {
        const id = this.getId(url);
        const symbol = this.svgToSymbol({id, svgString});

        this.fragment = this.fragment || document.createDocumentFragment();
        this.fragment.append(symbol);
    };

    private flushSvg = () => {
        const sprite = this.getSymbolMountPoint();

        if (this.fragment) {
            sprite.appendChild(this.fragment);
            this.fragment = null;
        }
    }

    private deboucedflushSvg = debounce(this.flushSvg, INJECTION_DELAY);

    private getSymbolMountPoint() {
        if (!this.symbolsMountingPoint) {
            const sprite = document.createElementNS(SVG_NAMESPACE, 'svg');
            const defs = document.createElementNS(SVG_NAMESPACE, 'defs');
            this.symbolsMountingPoint = defs;

            sprite.appendChild(defs);


            sprite.style.position = 'absolute';
            sprite.style.left = '-9999px';
            sprite.style.top = '-9999px';

            document.body.appendChild(sprite);
        }

        return this.symbolsMountingPoint;
    }

    getId(url: string) {
        return extractFileName(url);
    }

    load(
        url: string,
        {isImmediate}: {isImmediate?: boolean} = {}
    ) {
        if (this.cache.has(url)) {
            return Promise.resolve();
        }

        return fetchSvg(url)
            .then((svgString) => {
                this.accumulateSvg({url, svgString})
                this.cache.add(url)
                isImmediate ? this.flushSvg() : this.deboucedflushSvg()
            })
            .catch((error: Error) => {
                throw error;
            });
    }
}

export const injector = new Injector();
