import React from 'react';

import RichTextComponent from './components/RichTextComponent';
import FaqComponent from './components/FaqComponent';
import BannerComponent from './components/BannerComponent';
import SliderComponent from './components/SliderComponent';
import ListProduct from './components/ListProduct';
import TextImage from './components/TextImage';
import Skeleton from './components/Skeleton';
import BannerComponentBg from './components/BannerComponentBg';

import { useCssHandles } from 'vtex.css-handles';
import styles from "../../../styles/css/pages.page-manager"

const CSS_HANDLES = ['page-manager__component-container', 'hasPadding', 'background-white', 'background-blue', 'background-grey'];

const componentMap = {
    'rich-text': RichTextComponent,
    'banner': BannerComponent,
    'bannerBg': BannerComponentBg,
    'slider': SliderComponent,
    'faq': FaqComponent,
    'list-product': ListProduct,
    'text-image': TextImage
    // Adicione mais mapeamentos aqui conforme necessário
};

const BlockRenderer = ({ section, ListContext, SearchCustomQuery, disabledDev }) => {
    const { componentType, disabled, padding, backgroundColor, classe, anchorComponent, idAnchor } = section;
    const background = backgroundColor ?? ''
    const { handles } = useCssHandles(CSS_HANDLES);

    if (disabled) return null;

    let ComponentToRender;

    if (disabledDev && (componentType === 'list-product' || (componentType === 'slider' && section.sliderType === 'product'))) {
        ComponentToRender = Skeleton;
    } else {
        ComponentToRender = componentMap[componentType] || null;
    }

    const containerClasses = `${handles['page-manager__component-container']} ${classe} ${handles[background]} ${padding ? handles['hasPadding'] : ''} ${styles[classe]}`;
    const idAnchorValue = anchorComponent && idAnchor ? idAnchor : ''

    return ComponentToRender && (
        <div className={containerClasses} id={idAnchorValue} >
            <ComponentToRender section={section} {...(componentType === 'slider' ? { ListContext } : componentType === 'list-product' ? {SearchCustomQuery} : {})} />
        </div>
    );
};

export default BlockRenderer;
